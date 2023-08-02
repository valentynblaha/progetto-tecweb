from rest_framework import routers
from django.urls import include, path

from . import views

router = routers.SimpleRouter()
router.register("fitnessField", views.FitnessFieldViewSet)
router.register("course", views.CourseViewSet)

urlpatterns = [
    path("", include(router.urls))
]
