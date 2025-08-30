from rest_framework import serializers
from .models import EventFile, EventLog

class EventFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventFile
        fields = ['id', 'name', 'uploaded_at', 'processed', 'total_events']

class EventLogSerializer(serializers.ModelSerializer):
    file_name = serializers.CharField(source='file.name', read_only=True)

    class Meta:
        model = EventLog
        fields = [
            'id', 'file_name', 'serial_no', 'version', 'account_id',
            'instance_id', 'src_addr', 'dst_addr', 'src_port', 'dst_port',
            'protocol', 'packets', 'bytes_transferred', 'start_time',
            'end_time', 'action', 'log_status'
        ]

class SearchResponseSerializer(serializers.Serializer):
    results = EventLogSerializer(many=True)
    search_time = serializers.FloatField()
    total_count = serializers.IntegerField()