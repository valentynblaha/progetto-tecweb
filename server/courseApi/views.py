from django.db import IntegrityError
from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import mixins
from rest_framework import status

from .serializers import FitnessCategorySerializer, CourseSerializer, InstructorSerializer, CourseSubscriptionSerializer, CourseSubscriptionSerializer2
from .models import FitnessCategory, Course, Instructor, CourseSubscription
from .permissions import IsInstructor, ReadOnly

# Create your views here.
class FitnessCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FitnessCategory.objects.all()
    serializer_class = FitnessCategorySerializer
    permission_classes = [permissions.IsAdminUser | ReadOnly]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsInstructor | ReadOnly]

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer


class CourseSubscriptionViewSet(mixins.DestroyModelMixin, viewsets.ViewSet):

    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        queryset = CourseSubscription.objects.filter(user=request.user)
        serializer = CourseSubscriptionSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        course_id = request.data.get("course", None)
        if course_id is not None:
            try:
                course = Course.objects.get(id=course_id)
            except Exception as e:
                return Response({"detail": e.__str__()}, status=status.HTTP_400_BAD_REQUEST)
            if request.user.email == course.instructor.email:
                return Response({"detail": "You cannot subscribe to your own course"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                course_subsription = CourseSubscription.objects.create(course=course, user=request.user)
            except IntegrityError:
                return Response({"detail": "Subscription already exists"}, status=status.HTTP_400_BAD_REQUEST)
            serializer = CourseSubscriptionSerializer(course_subsription)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        else:
            return Response({"detail": "You need to provide a course id"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            course_subscription = CourseSubscription.objects.get(id=pk)
        except Exception as e:
            return Response({"detail": e.__str__()}, status=status.HTTP_400_BAD_REQUEST)
        if request.user != course_subscription.user:
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        course_subscription.delete()
        return Response({"detail": "Successfully deleted"}, status=status.HTTP_200_OK)
    
    @action(detail=False)
    def own_courses(self, request):
        queryset = CourseSubscription.objects.select_related("course").filter(course__instructor=request.user)
        serializer = CourseSubscriptionSerializer2(queryset, many=True)
        return Response(serializer.data)