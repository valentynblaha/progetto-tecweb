from django.conf import settings
from rest_framework import viewsets
from .serializers import ImageUploadSerializer, UserSerializer
from .models import BasicUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework import views
from django.core.files.storage import FileSystemStorage
import os
# Create your views here.

class RegisterUser(viewsets.ModelViewSet):
    queryset = BasicUser.objects.filter(is_instructor = False)
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        if request.user.is_anonymous:
            return Response({"detail": "Non autorizzato"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            serializer = UserSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)

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