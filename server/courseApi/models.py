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
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    


class Instructor(models.Model):
    id = models.BigAutoField(primary_key=True)
    cod_fisc = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    fields = models.ManyToManyField(FitnessField)
    gym_address = models.CharField(max_length=50)

    def __str__(self):
        return self.first_name + " " + self.last_name
    
    


class Course(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    instructor = models.ForeignKey(Instructor, on_delete=models.RESTRICT)
    approved = models.BooleanField(default=False)
    field = models.ForeignKey(FitnessField, on_delete=models.RESTRICT)
    price = models.IntegerField(default=0)  # Price in eurocents
    max_subs = models.IntegerField(default=15)

    def __str__(self):
        return self.name
    

class CourseScheduleDay(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="schedule")
    week_day = models.CharField(max_length=50, choices=WEEK_DAYS)
    start1 = models.TimeField()
    end1 = models.TimeField()
    start2 = models.TimeField(blank=True)
    end2 = models.TimeField(blank=True)

    class Meta:
        unique_together = ("course", "week_day")

    def __str__(self):
        return self.course.name + " " + self.week_day
    
