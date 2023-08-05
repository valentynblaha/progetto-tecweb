from rest_framework import viewsets
from .serializers import UserSerializer
from .models import BasicUser
# Create your views here.

class RegisterUser(viewsets.ModelViewSet):
    queryset = BasicUser.objects.filter(is_instructor = False)
    serializer_class = UserSerializer
