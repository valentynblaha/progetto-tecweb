from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator



SIZE_CHOICES = (
    ('S', 'small'),
    ('M', 'Medium'),
    ('L', 'large'),
    ('XL', 'extra large')
)

User = get_user_model()
class ProductCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name_plural = "product categories"

    def __str__(self):
        return self.name   
    
class Product(models.Model):
    id=models.BigAutoField(primary_key=True)
    name=models.CharField(max_length=200)
    image=models.FileField(upload_to="images/products", blank=True)
    brand=models.CharField(max_length=200,blank=True)
    category=models.CharField(ProductCategory, max_length=2)
    size = models.CharField(choices=SIZE_CHOICES,max_length=2)
    description=models.TextField(blank=True)
    price=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    countInStock=models.IntegerField(null=True,blank=True,default=0)
    createdAt=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    product=models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    name=models.CharField(max_length=200,blank=True)
    rating=models.IntegerField(null=True,blank=True,default=0, validators=[MaxValueValidator(10), MinValueValidator(0)])
    comment=models.TextField(blank=True)
    
    def __str__(self):
        return str(self.product.name + " " + self.user.email + " " + str(self.rating))
    
    class Meta:
        unique_together = ("user", "product")
    
class Cart(models.Model):
    user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    ordered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(null=True)
    shippingAddress = models.TextField(default="", blank=True)
    payment = models.ForeignKey('Payment', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return "Cart with id: " + str(self.id) + " of " + str(self.user)

    def get_total(self):
        total_price = 0
        ordered_products = OrderProduct.objects.filter(cart=self)

        for order_product in ordered_products:
            total_price += order_product.get_total_price()

        return total_price
    
    def get_product_count(self):
        ordered_products = OrderProduct.objects.filter(cart=self)
        return len(ordered_products)

class OrderProduct(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    orderedProduct = models.BooleanField(default=False)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return str(self.quantity) + " of " + str(self.product)
    
    def get_total_price(self):
        return self.quantity * self.product.price
    
class Payment(models.Model):
    cardNumber = models.CharField(max_length=50)
    user = models.ForeignKey(User,on_delete=models.SET_NULL, blank=True, null=True)
    amount = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email
