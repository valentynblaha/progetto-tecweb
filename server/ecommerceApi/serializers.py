from rest_framework import serializers
from .models import *


class ProductCategorySerializer(serializers.ModelSerializer):
      class Meta:
            model = ProductCategory
            fields = ["id", "name"]

class ProductsSerializer(serializers.ModelSerializer):
      class Meta:
            model = Product
            fields = [
                  'id', 'name','image','brand','category','size','description','rating',
                  'numReviews','price','countInStock','createdAt'
            ]
      def get_catagory(self, obj):
            return ProductCategorySerializer(obj.category).data

class  OrderedProductsSerializer(serializers.ModelSerializer):
       product = serializers.SerializerMethodField()
       total_price = serializers.SerializerMethodField()
       class Meta:
          model = OrderProduct
          fields = (
            'id',
            'item',
            'quantity',
            'total_price'
          )
       def get_item(self, obj):
             return ProductsSerializer(obj.product).data
       def get_total_price(self, obj):
              return obj.get_total_price()

      
class OrderSerializer(serializers.ModelSerializer):
      ordered_products = serializers.SerializerMethodField()
      total = serializers.SerializerMethodField()
      class meta:
            model = Cart
            fields = ['id','ordered_products','total','shippingAddress']
      def get_ordered_products(self,obj):
            return OrderedProductsSerializer(obj.products.all(),many=True).data
      def get_total(self, obj):
            return obj.get_total()


class ReviewsSerializer(serializers.ModelSerializer):
      class meta:
            model = Review
            fields = ['id','product','User','name','rating','comment']
