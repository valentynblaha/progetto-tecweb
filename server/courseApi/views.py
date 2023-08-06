from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model

from .serializers import FitnessCategorySerializer, CourseSerializer, InstructorSerializer
from .models import FitnessCategory, Course, Instructor
from .permissions import InstructorPermission

# Create your views here.
class FitnessCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FitnessCategory.objects.all()
    serializer_class = FitnessCategorySerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly | InstructorPermission]

class RegisterInstructor(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer