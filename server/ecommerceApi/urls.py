from django.urls import path, include
from rest_framework import routers
from .views import ProductsViewSet, AddToCartView, OrderDetailView, Checkout, ProductQuantityUpdateView, ProductCategoriesViewSet,ReviewView

router = routers.SimpleRouter()
router.register("products", ProductsViewSet)
router.register("categories", ProductCategoriesViewSet)
router.register("reviews", ReviewView, basename="reviews")

urlpatterns = [
    path('', include(router.urls)),
    path('add_to_cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('order_summary/', OrderDetailView.as_view(), name='order-summary'),
    path('checkout/', Checkout.as_view(), name='checkout'),
    path('ordered_product/quantity_update/', ProductQuantityUpdateView.as_view(), name='update-product-quantity')
]