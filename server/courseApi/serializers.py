from rest_framework import serializers
from .models import FitnessCategory, Course, CourseSchedule, Instructor


class FitnessCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FitnessCategory
        fields = ("id", "name")


class CourseScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseSchedule
        fields = ("week_day", "start1", "end1", "start2", "end2")


class CourseSerializer(serializers.ModelSerializer):

    schedule = CourseScheduleSerializer(many=True)
    instructor = serializers.PrimaryKeyRelatedField(queryset=Instructor.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=FitnessCategory.objects.all())

    class Meta:
        model = Course
        fields = ("id", "name", "instructor", "approved",
                  "category", "price", "max_subs", "schedule")
        depth = 1
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.approved = validated_data.get("approved", instance.approved)
        instance.category = validated_data.get("category", instance.category)
        instance.max_subs = validated_data.get("max_subs", instance.max_subs)
        instance.price = validated_data.get("price", instance.price)

        # TODO: maybe there's a better way than deleting all object then adding
        schedule_data = validated_data.get("schedule")
        saved_schedule = CourseSchedule.objects.filter(course=instance)
        saved_schedule.delete()
        if schedule_data:
            for schedule_item_data in schedule_data:
                
                schedule_item_data["course"] = instance
                CourseSchedule.objects.create(**schedule_item_data)

        instance.save()

        return instance
