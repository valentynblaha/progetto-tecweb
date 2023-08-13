from rest_framework import routers
from django.urls import include, path

from . import views

router = routers.SimpleRouter()
router.register("fitnessCategory", views.FitnessCategoryViewSet)
router.register("course", views.CourseViewSet)
router.register("register_instructor", views.InstructorViewSet)
router.register("subscriptions", views.CourseSubscriptionViewSet, basename="subscriptions")

urlpatterns = [
    path("", include(router.urls)),
    path('upload/', views.ImageUploadView.as_view(), name='upload_image')
]
