from django.db import models
from django.contrib.auth.models import User

CATEGORY_CHOICES = (
    ('C', 'cloth'),
    ('SP', 'supplement'),
    ('EX', 'excercise equipment')
)
SIZE_CHOICES = (
    ('S', 'small'),
    ('M', 'Medium'),
    ('L', 'large'),
    ('XL', 'extra large')
)


class Product(models.Model):
    name=models.CharField(max_length=200,null=True,blank=True)
    image=models.ImageField(null=True,blank=True)
    brand=models.CharField(max_length=200,null=True,blank=True)
    category=models.CharField(choices=CATEGORY_CHOICES, max_length=2)
    size = models.CharField(choices=SIZE_CHOICES,max_length=2)
    description=models.TextField(null=True,blank=True)
    rating=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    numReviews=models.IntegerField(null=True,blank=True,default=0)
    price=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    countInStock=models.IntegerField(null=True,blank=True,default=0)
    createdAt=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    product=models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    name=models.CharField(max_length=200,null=True,blank=True)
    rating=models.IntegerField(null=True,blank=True,default=0)
    comment=models.TextField(null=True,blank=True)
    
    def __str__(self):
        return str(self.product + " " + self.user + " " + self.rating)
    
class OrderProduct(models.Model):
    user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    product = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    orderedProduct = models.BooleanField(default=False)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return str(self.quantity + " of " + self.product)
    def get_total_price(self):
        return self.quantity * self.product.price
    
class Cart(models.Model):
    user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    products = models.ManyToManyField(OrderProduct)
    createdAt = models.DateTimeField(auto_now_add=True)
    ordered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(null=True)
    shippingAddress = models.TextField(blank=True, null=True)
    payment = models.ForeignKey('Payment', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.user.username

    def get_total(self):
        total = 0
        for order_product in self.products.all():
            total += order_product.get_total_price()
        return total

class Payment(models.Model):
    cardNumber = models.CharField(max_length=50)
    user = models.ForeignKey(User,on_delete=models.SET_NULL, blank=True, null=True)
    amount = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

