from django.shortcuts import render, get_object_or_404
from django.http import Http404
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.generics import *
from .models import *
from rest_framework.permissions import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from .serializers import *


class ProductsListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ProductsSerializer
    queryset = Product.objects.all()

class ProductDetailView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ProductDetailSerializer
    queryset = Product.objects.all()

class ProductQuantityUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        id = request.data.get('id',None)
        if id is None:
            return Response({"message": "invalid id of product"},status=HTTP_400_BAD_REQUEST)
        product = get_object_or_404(Product, id=id)
        cart_instance = Cart.objects.filter(user=self.request.user,ordered=False)
        if cart_instance.exists():
            cart = cart_instance[0]
            if cart.products.filter(id=product.id).exists():
                  order_product = OrderProduct.objects.filter(product=product,user=request.user,orderedProduct=False)[0]
                  if order_product.quantity > 1:
                     order_product.quantity -= 1
                     order_product.save
                     product.countInStock += 1
                     product.save()
                  else:
                     cart.products.remove(order_product)
                     product.countInStock += 1
                     product.save()
                  return Response(status=HTTP_200_OK)
            else:
                return Response({"message" : "This product is not in your cart"},status=HTTP_400_BAD_REQUEST)

class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_objects(self):
        try:
            order = Cart.objects.get(user=self.request.user , ordered=False)
            return order
        
        except ObjectDoesNotExist:
            raise Http404("no active order of given user")
        

class ProductsDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = OrderProduct.objects.all()

class Checkout(APIView):
    def post(self, request , *args , **kwargs):
         cart_order = Cart.Object.get(user=self.request.user,ordered=False)
         card_number = request.data.get('card_number')
         shipping_address = request.data.get('shipping_address')
         try:
            payment = Payment()
            payment.cardNumber = card_number
            payment.user = self.request.user
            payment.amount = cart_order.get_total()
            payment.save()
            cart_order.ordered = True
            cart_order.payment = payment
            cart_order.shippingAddress = shipping_address
            cart_order.save()
            return Response(status=HTTP_200_OK)
         except Exception as e :
             return Response({"message": "error occurred in payment processing "}, status=HTTP_400_BAD_REQUEST)
         
class AddToCartView(APIView):
    def post(self,request,*args,**kwargs):
        id_product = request.get.data('id_product',None)
        if id_product is None:
            return Response({"message":"invalid request product id is none"},status=HTTP_400_BAD_REQUEST)
        product_add = get_object_or_404(Product,id=id_product)
        if product_add.countInStock < 1:
           return Response({"message":"product out of stock"},status=HTTP_400_BAD_REQUEST)
        order_product = OrderProduct.objects.filter(product=product_add,user=request.user,orderedProduct=False)
        if order_product.exists():
            order_product.quantity +=1
            order_product.save()
            product_add.countInStock -= 1
            product_add.save()
        else:
            order_product = OrderProduct.objects.create(
                product=product_add,
                user = request.User,
                ordered=False
            )
            order_product.save
            product_add.countInStock -= 1
            product_add.save() 

        cart_update = Cart.objects.filter(user=request.user, ordered=False)
        if cart_update.exists():
            if not cart_update.products.filter(products__id=order_product.id).exists():
                  cart_update.products.add(order_product)
                  order_product.save()
                  return Response(status=HTTP_200_OK)
        else:
            cart = Cart.object.create(
                user=request.user
            )
            cart.products.add(order_product)
            return Response(status=HTTP_200_OK)


                           




             
             