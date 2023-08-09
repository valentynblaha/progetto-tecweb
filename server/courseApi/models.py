from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

WEEK_DAYS = [
    ("Mon", "Lunedì"),
    ("Tue", "Martedì"),
    ("Wed", "Mercoledì"),
    ("Thu", "Giovedì"),
    ("Fri", "Venerdì"),
    ("Sat", "Sabato"),
    ("Sun", "Domenica"),
]

class FitnessCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name_plural = "fitness categories"

    def __str__(self):
        return self.name    

User = get_user_model()

class Instructor(User):
    cod_fisc = models.CharField(max_length=50, unique=True)
    categories = models.ManyToManyField(FitnessCategory)
    gym_address = models.CharField(max_length=50)

    class Meta:
        verbose_name_plural = "instructors"

    def __str__(self):
        return (self.first_name + " " + self.last_name).strip() or self.email

class Course(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    instructor = models.ForeignKey(Instructor, on_delete=models.RESTRICT)
    approved = models.BooleanField(default=False)
    category = models.ForeignKey(FitnessCategory, on_delete=models.RESTRICT )
    price = models.DecimalField(default=0, decimal_places=2, max_digits=7)
    max_subs = models.IntegerField(default=15)

    def clean(self) -> None:
        categories = self.instructor.categories.all()
        if (self.category not in categories):
            raise ValidationError("La categoria del corso deve appartenere alle categorie dell'istruttore")
        return super().clean()

    def __str__(self):
        return self.name
    

class CourseSchedule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="schedule")
    week_day = models.CharField(max_length=50, choices=WEEK_DAYS)
    start1 = models.TimeField()
    end1 = models.TimeField()
    start2 = models.TimeField(blank=True, null=True)
    end2 = models.TimeField(blank=True, null=True)

    def clean(self) -> None:
        if (self.start1 >= self.end1 or ((self.start2 is not None or self.end2 is not None) 
                                         and not self.start1 < self.end1 < self.start2 < self.end2)):
            raise ValidationError("Orari non validi (sovrapposti o non in ordine)")
        
        return super().clean()

    class Meta:
        unique_together = ("course", "week_day")

    def __str__(self):
        return self.course.name + " " + self.week_day
    

class CourseSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "course")

    def __str__(self) -> str:
        return self.user.email + " to " + self.course.name