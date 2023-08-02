from rest_framework import viewsets

from .serializers import FitnessFieldSerializer, CourseSerializer
from .models import FitnessField, Course

# Create your views here.
class FitnessFieldViewSet(viewsets.ModelViewSet):
    queryset = FitnessField.objects.all()
    serializer_class = FitnessFieldSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    