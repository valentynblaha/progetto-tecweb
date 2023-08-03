from rest_framework import viewsets, permissions

from .serializers import FitnessCategorySerializer, CourseSerializer
from .models import FitnessCategory, Course
from .permissions import InstructorPermission

# Create your views here.
class FitnessCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FitnessCategory.objects.all()
    serializer_class = FitnessCategorySerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly, InstructorPermission]