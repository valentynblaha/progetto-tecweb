from django.contrib import admin
from .models import Product, OrderProduct, Review, Payment
# Register your models here.

admin.site.register(Product)
admin.site.register(OrderProduct)
admin.site.register(Review)
admin.site.register(Payment)