from rest_framework import viewsets

from .serializers import FitnessFieldSerializer
from .models import FitnessField

# Create your views here.
class FitnessFieldViewSet(viewsets.ModelViewSet):
    queryset = FitnessField.objects.all()
    serializer_class = FitnessFieldSerializer
    