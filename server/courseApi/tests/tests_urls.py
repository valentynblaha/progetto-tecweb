from django.test import SimpleTestCase
from django.urls import resolve, reverse
from courseApi.views import CourseViewSet


class TestUrls(SimpleTestCase):
    def test_courses_url_is_risolved(self):
        url = reverse('courses-list')
        self.assertEqual(resolve(url).route, "api/course/course/$")
