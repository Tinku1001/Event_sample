from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventFileViewSet, EventLogViewSet

router = DefaultRouter()
router.register(r'files', EventFileViewSet)
router.register(r'events', EventLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]