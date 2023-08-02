from django.urls import path
from .views import *

urlpatterns = [
    path('products/', ProductsListView.as_view(), name='product-list'),
    path('products/<pk>/' , ProductDetailView.as_view, name='product-detail'),
    path('add_to_cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('order_summary/', OrderDetailView.as_view(), name='order-summary'),
    path('checkout/', Checkout.as_view(), name='checkout'),
    path('delete_added_products/<pk>/', ProductsDeleteView.as_view(), name='delete-added-product'),
    path('ordered_product/quantity_update/', ProductQuantityUpdateView.as_view(), name='update-product-quantity'),

]