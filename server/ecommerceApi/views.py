from django.shortcuts import render, get_object_or_404
from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError

from django.db.models import Q
import os
from rest_framework.generics import *
from .models import *
from django.conf import settings
from rest_framework.permissions import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet, ViewSet
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from .serializers import ProductsSerializer, OrderSerializer, ProductCategorySerializer, ReviewsSerializer


class ProductsViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = ProductsSerializer

    def get_queryset(self):
        minprice = self.request.query_params.get("minprice")
        maxprice = self.request.query_params.get("maxprice")
        sizes = self.request.query_params.get("sizes")
        query = {}
        if (minprice is not None):
            try:
                minprice_val = float(minprice)
                if minprice_val < 0:
                    minprice_val = 0
            except ValueError:
                minprice_val = 0
            query["price__gt"] = minprice_val
        if (maxprice is not None):
            try:
                maxprice_val = float(maxprice)
            except ValueError:
                maxprice_val = 0
            query["price__lt"] = maxprice_val
        if (sizes is not None):
            query["size__in"] = sizes.split(',')

        return Product.objects.filter(**query)


class ProductCategoriesViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = ProductCategorySerializer
    queryset = ProductCategory.objects.all()


class ProductQuantityUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        id = request.data.get('id', None)
        if id is None:
            return Response({"message": "invalid id of product"}, status=HTTP_400_BAD_REQUEST)
        product = get_object_or_404(Product, id=id)
        cart_instance = Cart.objects.filter(
            user=self.request.user, ordered=False)
        if cart_instance.exists():
            cart = cart_instance[0]
            if cart.products.filter(id=product.id).exists():
                order_product = OrderProduct.objects.filter(
                    product=product, user=request.user, orderedProduct=False)[0]
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
                return Response({"message": "This product is not in your cart"}, status=HTTP_400_BAD_REQUEST)


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_objects(self):
        try:
            order = Cart.objects.get(user=self.request.user, ordered=False)
            return order

        except ObjectDoesNotExist:
            raise Http404("no active order of given user")


class Checkout(APIView):
    def post(self, request, *args, **kwargs):
        cart_order = Cart.Object.get(user=self.request.user, ordered=False)
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
        except Exception as e:
            return Response({"message": "error occurred in payment processing "}, status=HTTP_400_BAD_REQUEST)


class AddToCartView(APIView):

    def post(self, request, *args, **kwargs):
        id_product = request.get.data('id_product', None)
        if id_product is None:
            return Response({"message": "invalid request product id is none"}, status=HTTP_400_BAD_REQUEST)
        product_add = get_object_or_404(Product, id=id_product)
        if product_add.countInStock < 1:
            return Response({"message": "product out of stock"}, status=HTTP_400_BAD_REQUEST)
        order_product = OrderProduct.objects.filter(
            product=product_add, user=request.user, orderedProduct=False)
        if order_product.exists():
            order_product.quantity += 1
            order_product.save()
            product_add.countInStock -= 1
            product_add.save()
        else:
            order_product = OrderProduct.objects.create(
                product=product_add,
                user=request.User,
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


class ReviewView(ViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def retrieve(self, request, pk=None):
        queryset = Review.objects.filter(product=pk)
        serializer = ReviewsSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        product_id = request.data.get("product", None)
        if product_id is not None:
            try:
                product_reviewed = get_object_or_404(Product, id=product_id)
                review = Review.objects.create(
                    product=product_reviewed,
                    user=request.user,
                    name=request.data.get('name', None),
                    rating=request.data.get('rating', None),
                    comment=request.data.get('comment', None)
                )
                product_reviewed.save()
                serializer = ReviewsSerializer(review)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response(
                    {"detail": "Failed to create the review due to integrity violation.", "code": 1},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response({"detail": "You need to provide a product"}, status=status.HTTP_400_BAD_REQUEST)
