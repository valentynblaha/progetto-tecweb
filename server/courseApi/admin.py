from django.contrib import admin
from .models import Course, CourseSchedule, Instructor, FitnessCategory, CourseSubscription

class ScheduleAdmin(admin.ModelAdmin):
    list_display = ("course", "week_day", "start1", "end1", "start2", "end2")

class CourseAdmin(admin.ModelAdmin):
    list_display = ("name", "approved", "instructor", "category", "price", "max_subs")

class CourseSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "course")

admin.site.register(Instructor)
admin.site.register(FitnessCategory)
admin.site.register(Course, CourseAdmin)
admin.site.register(CourseSchedule, ScheduleAdmin)
admin.site.register(CourseSubscription, CourseSubscriptionAdmin)
