from django.urls import path, include
from rest_framework import routers
from .views import ProductsViewSet, Checkout, ProductCategoriesViewSet, ReviewView, OrderViewSet, CartView, RecommendedView

router = routers.SimpleRouter()
router.register("products", ProductsViewSet, basename="products")
router.register("categories", ProductCategoriesViewSet)
router.register("reviews", ReviewView, basename="reviews")
router.register("orders", OrderViewSet, basename="orders")

urlpatterns = [
    path('', include(router.urls)),
    path('checkout/', Checkout.as_view(), name='checkout'),
    path('cart/', CartView.as_view(), name="cart"),
    path('recommended/', RecommendedView.as_view(), name="recommended"),
]
