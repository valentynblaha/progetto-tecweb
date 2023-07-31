from rest_framework import serializers
from .models import FitnessField

class FitnessFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FitnessField
        fields = ("id", "name")