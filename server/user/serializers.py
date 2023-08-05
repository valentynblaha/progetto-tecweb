from rest_framework import serializers

from .models import BasicUser


class UserSerializer(serializers.ModelSerializer):

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
        fields = ('id', 'email', 'password', 'phone', 'gender',
                  'is_active', 'is_staff', 'is_superuser', 'is_instructor')
