from rest_framework import serializers
from .models import FitnessCategory, Course, CourseSchedule, Instructor, CourseSubscription
from user.serializers import UserPublicSerializer

class FitnessCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FitnessCategory
        fields = ("id", "name")


class CourseScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseSchedule
        fields = ("week_day", "start1", "end1", "start2", "end2")
    
class URLToFileField(serializers.FileField):
    def to_internal_value(self, data):
        # Assuming 'data' is the URL to the media file
        return data  # Return the URL as is

    def to_representation(self, value):
        # Assuming 'value' is the path to the media file in the server
        if value:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(value.url)
            return value.url
        return None
    
class CourseSerializer(serializers.ModelSerializer):

    schedule = CourseScheduleSerializer(many=True)
    instructor = serializers.PrimaryKeyRelatedField(queryset=Instructor.objects.all(), required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=FitnessCategory.objects.all())
    image = URLToFileField()
    class Meta:
        model = Course
        fields = ("id", "name", "description", "image", "instructor", "approved",
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
    
    def create(self, validated_data):
        validated_data.pop("approved", None)
        validated_data.pop("instructor", None)
        approved = False
        instructor = Instructor.objects.get(email=self.context.get("request").user.email)
        schedule_data = validated_data.pop("schedule", None)
        if len(schedule_data) == 0:
            raise serializers.ValidationError({"detail": "Inserire almeno un giorno di orari"})
        instance = self.Meta.model(approved=approved, instructor=instructor, **validated_data)
        instance.save()
        if schedule_data:
            for schedule_item_data in schedule_data:
                
                schedule_item_data["course"] = instance
                course_schedule = CourseScheduleSerializer(data=schedule_item_data)
                if course_schedule.is_valid():
                    CourseSchedule.objects.create(**schedule_item_data)
                else:
                    raise serializers.ValidationError(course_schedule.errors)

        return instance
    
    def get_validation_exclusions(self):
        exclusions = super(CourseSerializer, self).get_validation_exclusions()
        return exclusions + ['instructor']

class CourseSubscriptionSerializer(serializers.ModelSerializer):
    course = CourseSerializer()
    class Meta:
        model = CourseSubscription
        fields = ("id", "course", "created_at")
        depth = 1
        
class CourseSubscriptionSerializer2(serializers.ModelSerializer):

    user = UserPublicSerializer()
    class Meta:
        model = CourseSubscription
        fields = ("id", "course", "user", "created_at")
        depth = 1

class InstructorSerializer(serializers.ModelSerializer):
    image = URLToFileField()

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        categories = validated_data.pop('categories', None)
        request = self.context.get('request')
        if request and not request.user.is_staff:
            validated_data.pop('is_staff', None)
        instance = self.Meta.model(**validated_data)
        instance.is_instructor = True
        instance.is_superuser = False

        if password is not None:
            instance.set_password(password)
        instance.save()
        instance.categories.set(categories)
        return instance

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and not request.user.is_staff:
            validated_data.pop('is_staff', None)
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)

        instance.save()
        return instance

    class Meta:
        model = Instructor
        extra_kwargs = {'password': {'write_only': True}}
        fields = ('id', 'email', 'password', 'phone', 'gender', 'image', 'first_name' , 'last_name', 'categories',
                  'is_active', 'is_staff', 'is_superuser', 'is_instructor', 'cod_fisc', 'gym_address')

class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()

