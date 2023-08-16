from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import BasicUser

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
    
class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasicUser
        fields = ("email", "first_name", "last_name")
        read_only_fields = ("email", "first_name", "last_name")

class UserSerializer(serializers.ModelSerializer):
    image = URLToFileField()

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        request = self.context.get('request')
        if request and not request.user.is_staff:
            validated_data.pop('is_staff', None)
            validated_data.pop('is_instructor', None)
        instance = self.Meta.model(**validated_data)

        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and not request.user.is_staff:
            validated_data.pop('is_staff', None)
            validated_data.pop('is_instructor', None)
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)

        instance.save()
        return instance

    class Meta:
        model = BasicUser
        extra_kwargs = {'password': {'write_only': True}}
        fields = ('id', 'email', 'password', 'phone', 'gender', 'image',
                  'is_active', 'is_staff', 'is_superuser', 'is_instructor', 'first_name', 'last_name')


class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()
