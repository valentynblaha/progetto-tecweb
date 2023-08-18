import os

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.db.models import Q
from django.http import Http404
from django.shortcuts import get_object_or_404, render
from rest_framework import status
from rest_framework.generics import *
from rest_framework.permissions import *
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet, ViewSet

from .models import *
from .serializers import (OrderSerializer, ProductCategorySerializer,
                          ProductsSerializer, ReviewsSerializer, OrderedProductsSerializer, PaymentSerializer)


class ProductsViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = ProductsSerializer

    def get_queryset(self):
        s = self.request.query_params.get("s")
        minprice = self.request.query_params.get("minprice")
        maxprice = self.request.query_params.get("maxprice")
        sizes = self.request.query_params.get("sizes")
        query = {}
        if s is not None:
            query["name__icontains"] = s
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


class Checkout(APIView):

    permission_classes = (IsAuthenticated,)
    def post(self, request, *args, **kwargs):
        cart_order = get_object_or_404(Cart, user=self.request.user, ordered=False)
        card_number = request.data.get('card_number')
        shipping_address = request.data.get('shipping_address')
        try:
            payment = Payment.objects.create(
                cardNumber=card_number, user=self.request.user, amount=cart_order.get_total())
            cart_order.ordered = True
            cart_order.payment = payment
            cart_order.shippingAddress = shipping_address
            cart_order.save()
            return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": "error occurred in payment processing "}, status=status.HTTP_400_BAD_REQUEST)


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


class OrderViewSet(ViewSet):
    serializer = OrderedProductsSerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        cart = Cart.objects.filter(user=self.request.user, ordered=False)[0]
        if cart is not None:
            queryset = OrderProduct.objects.filter(cart=cart)
            serializer = self.serializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response([])

    def create(self, request):
        quantity = request.data.get("quantity", None)
        product_id = request.data.get("product", None)
        product = Product.objects.get(id=product_id)
        if product.countInStock < quantity:
            return Response({"detail": "Out of stock", "code": 1}, status=status.HTTP_400_BAD_REQUEST)
        cart = Cart.objects.filter(user=request.user, ordered=False)[0]
        if cart is None:
            cart = Cart.objects.create(user=request.user, ordered=False)
            order = OrderProduct.objects.create(
                cart=cart, product=product, orderedProduct=False, quantity=quantity)
            serializer = self.serializer(order)
            product.countInStock -= quantity
            product.save()
            return Response(serializer.data)
        else:
            orders = OrderProduct.objects.filter(cart=cart, product=product)
            if len(orders) > 0:
                order = orders[0]
                order.quantity += quantity
                order.save()
                product.countInStock -= quantity
                product.save()
                return Response(self.serializer(order).data)
            else:
                order = OrderProduct.objects.create(
                    cart=cart, product=product, orderedProduct=False, quantity=quantity)
                serializer = self.serializer(order)
                product.countInStock -= quantity
                product.save()
                return Response(serializer.data)

    def destroy(self, request, pk=None):
        order = get_object_or_404(OrderProduct, pk=pk)
        if order.orderedProduct == False:
            product = order.product
            product.countInStock += order.quantity
            product.save()
            order.delete()
        else:
            return Response({"detail": "Cannot delete a closed order", "code": 1}, status=status.HTTP_403_FORBIDDEN)
        return Response(status=status.HTTP_204_NO_CONTENT)
