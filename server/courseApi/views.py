from django.db import IntegrityError
from django.db.models import Q
from django.core.files.storage import FileSystemStorage
from rest_framework import viewsets, permissions, views
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import mixins
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

import os

from .serializers import FitnessCategorySerializer, CourseSerializer, InstructorSerializer, CourseSubscriptionSerializer, CourseSubscriptionSerializer2, ImageUploadSerializer
from .models import FitnessCategory, Course, Instructor, CourseSubscription
from .permissions import IsInstructor, ReadOnly

# Create your views here.


class FitnessCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FitnessCategory.objects.all()
    serializer_class = FitnessCategorySerializer
    permission_classes = [permissions.IsAdminUser | ReadOnly]


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsInstructor | ReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user.is_anonymous and user.is_instructor:
            queryset = Course.objects.filter(Q(instructor=Instructor.objects.get(
                email=user.email)) | Q(approved=True))
        else:
            queryset = Course.objects.filter(approved=True)
        return queryset

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer


class CourseSubscriptionViewSet(mixins.DestroyModelMixin, viewsets.ViewSet):

    permission_classes = (permissions.IsAuthenticated,)

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
                course_subsription = CourseSubscription.objects.create(
                    course=course, user=request.user)
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
        queryset = CourseSubscription.objects.select_related(
            "course").filter(course__instructor=request.user)
        serializer = CourseSubscriptionSerializer2(queryset, many=True)
        return Response(serializer.data)


class ImageUploadView(views.APIView):

    PATH = "images/courses/"

    def post(self, request):
        if request.user.is_anonymous:  # TODO: allow only instructor
            return Response({"detail": "Non autorizzato"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            image = serializer.validated_data['image']
            fs = FileSystemStorage(location=os.path.join(
                settings.MEDIA_ROOT, self.PATH))
            filename = fs.save(image.name, image)
            return Response({'message': 'Image uploaded successfully', "file": self.PATH + filename},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InstructorImageUploadView(views.APIView):
    PATH = "images/profile_pictures/"

    def post(self, request):
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            image = serializer.validated_data['image']
            fs = FileSystemStorage(location=os.path.join(
                settings.MEDIA_ROOT, self.PATH))
            filename = fs.save(image.name, image)
            return Response({'message': 'Image uploaded successfully', "file": self.PATH + filename},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)