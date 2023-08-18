from rest_framework import serializers
from django.db.models import Avg
from user.serializers import UserPublicSerializer
from .models import *


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ["id", "name"]


class ProductsSerializer(serializers.ModelSerializer):

    numReviews = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'image', 'brand', 'category', 'size', 'description',
            'numReviews', 'price', 'countInStock', 'createdAt', 'rating'
        ]

    def get_catagory(self, obj):
        return ProductCategorySerializer(obj.category).data

    def get_numReviews(self, obj):
        return Review.objects.filter(product_id=obj.pk).count()

    def get_rating(self, obj):
        aggregate = Review.objects.filter(
            product_id=obj.pk).aggregate(avg=Avg("rating"))
        return round(aggregate["avg"] or 0)


class OrderedProductsSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderProduct
        fields = (
            'id',
            'cart',
            'product',
            'quantity',
            'total_price'
        )

    def get_total_price(self, obj):
        return obj.get_total_price()


class OrderSerializer(serializers.ModelSerializer):
    ordered_products = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'ordered_products', 'total', 'shippingAddress']

    def get_ordered_products(self, obj):
        return OrderedProductsSerializer(obj.products.all(), many=True).data

    def get_total(self, obj):
        return obj.get_total()


class ReviewsSerializer(serializers.ModelSerializer):

    user = UserPublicSerializer()

    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'name', 'rating', 'comment']


class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = ('id', 'user', 'amount', 'timestamp')
