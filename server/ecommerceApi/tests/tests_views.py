from django.test import TestCase,Client
from django.urls import reverse
from ecommerceApi.models import *
from user.models import BasicUser
import json


class TestView(TestCase):
   
        

     def test_products_list_GET(self):
          client = Client()
          response = client.get(reverse('products-list'))
          self.assertEqual(response.status_code,200)

     def test_products_POST(self):
           client = Client()
           response = client.post(reverse('products-list'),{
                'name': 'shirt',
                'brand': 'gucci',
                'catagory': '1',
                'size': 'M',
                'description': 'this is a shirt',
                'price': '200',
                'countInStock': '200'
           })
           self.assertEqual(response.status_code,405)
    
    