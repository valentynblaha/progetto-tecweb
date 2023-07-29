from django.db import models

WEEK_DAYS = [
    ("Mon", "Lunedì"),
    ("Tue", "Martedì"),
    ("Wed", "Mercoledì"),
    ("Thu", "Giovedì"),
    ("Fri", "Venerdì"),
    ("Sat", "Sabato"),
    ("Sun", "Domenica"),
]


class FitnessField(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.TextField(unique=True)


class Instructor(models.Model):
    id = models.BigAutoField(primary_key=True)
    cod_fisc = models.TextField(unique=True)
    first_name = models.TextField()
    last_name = models.TextField()
    fields = models.ManyToManyField(FitnessField)
    gym_address = models.TextField()


class Course(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.TextField(unique=True)
    instructor = models.ForeignKey(Instructor, on_delete=models.RESTRICT)
    approved = models.BooleanField(default=False)
    field = models.ForeignKey(FitnessField, on_delete=models.RESTRICT)
    price = models.IntegerField(default=0)  # Price in eurocents
    max_subs = models.IntegerField(default=15)


class CourseScheduleDay(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    week_day = models.TextField(choices=WEEK_DAYS)
    start1 = models.TimeField()
    end1 = models.TimeField()
    start2 = models.TimeField(blank=True)
    end2 = models.TimeField(blank=True)
