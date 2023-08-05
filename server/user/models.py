from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class BasicUserManager(BaseUserManager):

    def create_superuser(self, email, password=None):
        user = self.model(
            email=email
        )
        user.is_superuser = True
        user.is_staff = True
        print(password)
        user.set_password(password)
        user.save(using=self._db)
        return user

class BasicUser(AbstractUser):
    email = models.EmailField(max_length=254, unique=True)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    is_instructor = models.BooleanField(default=False)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=20)
    gender = models.CharField(max_length=10)
    session_token = models.CharField(default=0, max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BasicUserManager()
