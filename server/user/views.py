from rest_framework import viewsets
from .serializers import UserSerializer
from .models import BasicUser
from rest_framework.response import Response
from rest_framework import status
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
