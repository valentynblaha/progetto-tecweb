from django.contrib import admin
from .models import *

class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "rating")

class OrderProductAdmin(admin.ModelAdmin):
    list_display= ( "quantity", "product")

admin.site.register(ProductCategory)
admin.site.register(Product)
admin.site.register(Review, ReviewAdmin)
admin.site.register(OrderProduct, OrderProductAdmin)
admin.site.register(Cart)
admin.site.register(Payment)