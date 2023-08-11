from django.contrib import admin
from .models import *

class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "rating")

admin.site.register(ProductCategory)
admin.site.register(Product)
admin.site.register(Review, ReviewAdmin)
admin.site.register(OrderProduct)
admin.site.register(Cart)
admin.site.register(Payment)