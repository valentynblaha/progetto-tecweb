from rest_framework import serializers
from .models import FitnessField, Course, CourseScheduleDay

class FitnessFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FitnessField
        fields = ("id", "name")

class CourseSerializer(serializers.ModelSerializer):

    schedule = serializers.PrimaryKeyRelatedField(many=True, queryset=CourseScheduleDay.objects.all())

    class Meta:
        model = Course
        fields = ("id", "name", "instructor", "approved", "field", "price", "max_subs", "schedule")

