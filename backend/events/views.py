import time
import threading
from concurrent.futures import ThreadPoolExecutor
from django.db import connection
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import EventFile, EventLog
from .serializers import EventFileSerializer, EventLogSerializer, SearchResponseSerializer
from .utils import parse_event_file, build_search_query

class EventFileViewSet(viewsets.ModelViewSet):
    queryset = EventFile.objects.all()
    serializer_class = EventFileSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def create(self, request, *args, **kwargs):
        """Upload and process event files"""
        files = request.FILES.getlist('files')
        if not files:
            return Response(
                {'error': 'No files provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        results = []
        
        def process_file(file):
            try:
                event_file = EventFile.objects.create(
                    name=file.name,
                    file=file
                )
                
                # Process file in background thread for large files
                events_count = parse_event_file(event_file)
                
                return {
                    'id': event_file.id,
                    'name': event_file.name,
                    'status': 'success',
                    'events_processed': events_count
                }
            except Exception as e:
                return {
                    'name': file.name,
                    'status': 'error',
                    'error': str(e)
                }
        
        # Process files concurrently for better performance
        with ThreadPoolExecutor(max_workers=3) as executor:
            results = list(executor.map(process_file, files))
        
        return Response(results, status=status.HTTP_201_CREATED)

class EventLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventLog.objects.all()
    serializer_class = EventLogSerializer
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        """Optimized search endpoint with timing"""
        start_time = time.time()
        
        search_params = request.data
        
        # Build base queryset with optimizations
        queryset = EventLog.objects.all()
        
        # Apply search filters
        filtered_queryset = build_search_query(queryset, search_params)
        
        # Get total count for pagination
        total_count = filtered_queryset.count()
        
        # Apply pagination
        page = int(request.data.get('page', 1))
        page_size = int(request.data.get('page_size', 100))
        offset = (page - 1) * page_size
        
        # Execute query with limit
        results = filtered_queryset[offset:offset + page_size]
        
        # Calculate search time
        search_time = round(time.time() - start_time, 4)
        
        # Serialize results
        serializer = EventLogSerializer(results, many=True)
        
        response_data = {
            'results': serializer.data,
            'search_time': search_time,
            'total_count': total_count,
            'page': page,
            'page_size': page_size,
            'total_pages': (total_count + page_size - 1) // page_size
        }
        
        return Response(response_data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get database statistics"""
        total_events = EventLog.objects.count()
        total_files = EventFile.objects.count()
        processed_files = EventFile.objects.filter(processed=True).count()
        
        return Response({
            'total_events': total_events,
            'total_files': total_files,
            'processed_files': processed_files,
        })