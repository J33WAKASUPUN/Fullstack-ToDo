from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    # logic to select all tasks
    queryset = Task.objects.all().order_by('-created_at') 
    # logic to convert them to JSON
    serializer_class = TaskSerializer