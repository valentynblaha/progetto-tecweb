from django.test import TestCase,Client
from django.urls import reverse


class TestView(TestCase):
   
        

     def test_courses_list_GET(self):
          client = Client()
          response = client.get(reverse('courses-list'))
          self.assertEqual(response.status_code,200)

     def test_courses_POST(self):
           client = Client()
           response = client.post(reverse('courses-list'),{
                'name': 'pilates',
                'instructor': 1,
                'catagory': 1,
                'description': 'this is a shirt',
                'price': 20,
                'schedule': {
                     'week_day': "Mon",
                     'start1': '10:00:00',
                     'end1': '11:00:00',
                     'start2': '12:00:00',
                     'end2': '13:00:00'
                }
           })
           self.assertEqual(response.status_code,401)
    
    