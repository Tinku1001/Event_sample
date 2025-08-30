from django.db import models
from django.core.validators import FileExtensionValidator

class EventFile(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(
        upload_to='event_files/',
        validators=[FileExtensionValidator(allowed_extensions=['log', 'txt', 'csv'])]
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)
    total_events = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class EventLog(models.Model):
    file = models.ForeignKey(EventFile, on_delete=models.CASCADE, related_name='events')
    serial_no = models.IntegerField()
    version = models.IntegerField()
    account_id = models.CharField(max_length=50, db_index=True)
    instance_id = models.CharField(max_length=50)
    src_addr = models.GenericIPAddressField(db_index=True)
    dst_addr = models.GenericIPAddressField(db_index=True)
    src_port = models.IntegerField()
    dst_port = models.IntegerField()
    protocol = models.IntegerField()
    packets = models.BigIntegerField()
    bytes_transferred = models.BigIntegerField()
    start_time = models.BigIntegerField(db_index=True)  # Epoch time
    end_time = models.BigIntegerField(db_index=True)    # Epoch time
    action = models.CharField(max_length=20, db_index=True)
    log_status = models.CharField(max_length=20)

    class Meta:
        indexes = [
            models.Index(fields=['src_addr', 'start_time']),
            models.Index(fields=['dst_addr', 'start_time']),
            models.Index(fields=['action', 'start_time']),
            models.Index(fields=['account_id', 'start_time']),
        ]

    def __str__(self):
        return f"{self.src_addr} -> {self.dst_addr} | {self.action}"