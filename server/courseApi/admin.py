from django.contrib import admin
from .models import Course, CourseScheduleDay, Instructor, FitnessField

admin.site.register(Instructor)
admin.site.register(FitnessField)
admin.site.register(Course)
admin.site.register(CourseScheduleDay)
