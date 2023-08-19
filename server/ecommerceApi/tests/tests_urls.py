from django.test import SimpleTestCase
from django.urls import resolve , reverse
from ecommerceApi.views import ProductsViewSet,Checkout


class TestUrls(SimpleTestCase):
      def test_checkout_url_is_risolved(self):
          url = reverse('checkout')
          self.assertEqual(resolve(url).func.view_class ,Checkout)