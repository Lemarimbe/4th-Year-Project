from django.urls import path
from .views import process_image_view

urlpatterns = [
    path('process-image/', process_image_view, name='process-image'),
]
