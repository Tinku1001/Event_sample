import csv
import time
import logging
from django.db import transaction
from .models import EventFile, EventLog

logger = logging.getLogger(__name__)

def parse_event_file(event_file):
    """Parse uploaded event file and store events in database"""
    try:
        with transaction.atomic():
            file_path = event_file.file.path
            events_created = 0
            
            with open(file_path, 'r') as file:
                # Skip header if present
                first_line = file.readline().strip()
                if not first_line.split('|')[0].strip().isdigit():
                    file.seek(0)
                    next(file)  # Skip header
                else:
                    file.seek(0)
                
                for line_num, line in enumerate(file, 1):
                    if line.strip():
                        try:
                            parts = [part.strip() for part in line.split('|')]
                            if len(parts) >= 15:
                                event = EventLog(
                                    file=event_file,
                                    serial_no=int(parts[0]),
                                    version=int(parts[1]),
                                    account_id=parts[2],
                                    instance_id=parts[3],
                                    src_addr=parts[4],
                                    dst_addr=parts[5],
                                    src_port=int(parts[6]),
                                    dst_port=int(parts[7]),
                                    protocol=int(parts[8]),
                                    packets=int(parts[9]),
                                    bytes_transferred=int(parts[10]),
                                    start_time=int(parts[11]),
                                    end_time=int(parts[12]),
                                    action=parts[13],
                                    log_status=parts[14]
                                )
                                event.save()
                                events_created += 1
                                
                                # Batch processing for large files
                                if events_created % 1000 == 0:
                                    logger.info(f"Processed {events_created} events...")
                                    
                        except (ValueError, IndexError) as e:
                            logger.error(f"Error parsing line {line_num}: {e}")
                            continue
            
            event_file.processed = True
            event_file.total_events = events_created
            event_file.save()
            
            logger.info(f"Successfully processed {events_created} events from {event_file.name}")
            return events_created
            
    except Exception as e:
        logger.error(f"Error processing file {event_file.name}: {e}")
        raise

def build_search_query(queryset, search_params):
    """Build optimized search query based on parameters"""
    filters = {}
    
    # Time range filters
    if search_params.get('start_time'):
        filters['start_time__gte'] = int(search_params['start_time'])
    if search_params.get('end_time'):
        filters['end_time__lte'] = int(search_params['end_time'])
    
    # Field-specific filters
    if search_params.get('src_addr'):
        filters['src_addr'] = search_params['src_addr']
    if search_params.get('dst_addr'):
        filters['dst_addr'] = search_params['dst_addr']
    if search_params.get('action'):
        filters['action__iexact'] = search_params['action']
    if search_params.get('account_id'):
        filters['account_id'] = search_params['account_id']
    if search_params.get('src_port'):
        filters['src_port'] = int(search_params['src_port'])
    if search_params.get('dst_port'):
        filters['dst_port'] = int(search_params['dst_port'])
    if search_params.get('protocol'):
        filters['protocol'] = int(search_params['protocol'])
    if search_params.get('log_status'):
        filters['log_status__iexact'] = search_params['log_status']
    
    return queryset.filter(**filters).select_related('file')