from datetime import datetime
from django.test import TestCase
from ecommerceApi.models import *
from user.models import *

class TestModels(TestCase):
    def test_total_bill(self):
        d = datetime.now()
        user1 = BasicUser.objects.create(email="abc@fitcourse.com")
        user1.set_password('hello')
        user1.save
        t_cart = Cart.objects.create(
            user = user1,
            deliveredAt = d
        ) 
        Product1 = Product.objects.create(
            name = 'shirt',
            brand = 'fit',
            size = 'M',
            price = 20.00,
            countInStock = 20
        )
        Product2 = Product.objects.create(
            name = 'cap',
            brand = 'fit',
            size = 'M',
            price = 10.00,
            countInStock = 20
        )
        order_product1 = OrderProduct.objects.create(
              cart = t_cart,
              product = Product1,
              quantity = 5
        )
        order_product2 = OrderProduct.objects.create(
              cart = t_cart,
              product = Product2,
              quantity = 5
        )
        self.assertEqual(t_cart.get_total(),150.00)