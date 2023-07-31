from rest_framework import routers
from django.urls import include, path

from . import views

router = routers.SimpleRouter()
router.register("fitnessField", views.FitnessFieldViewSet)

urlpatterns = [
    path("", include(router.urls))
]
