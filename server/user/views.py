from django.conf import settings
from rest_framework import viewsets
from .serializers import ImageUploadSerializer, UserSerializer
from .models import BasicUser
from rest_framework.response import Response
from rest_framework.permissions import (IsAuthenticated)
from rest_framework import status
from rest_framework import views
from django.core.files.storage import FileSystemStorage
from django.core import exceptions
from django.contrib.auth.password_validation import validate_password
import os
# Create your views here.

class RegisterUser(viewsets.ModelViewSet):
    queryset = BasicUser.objects.filter(is_instructor = False)
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        if request.user.is_anonymous:
            return Response({"detail": "Non autorizzato"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            serializer = self.serializer_class(request.user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
class ResetPasswordView(views.APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        user = request.user
        new_password = request.data.get('newPassword')
        old_password = request.data.get('oldPassword')
        if not user.check_password(old_password):
            return Response({"detail": "password not valid", "code": 1}, status=status.HTTP_400_BAD_REQUEST)
        if old_password == new_password:
            return Response({"detail": "The new password has to be different from the old one", "code": 2})
        try:
            validate_password(new_password)
        except exceptions.ValidationError as e:
            return Response({"password": [er.message for er in e.error_list], "code": 3}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"detail": "password reset successfully"}, status=status.HTTP_201_CREATED)

class ImageUploadView(views.APIView):

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