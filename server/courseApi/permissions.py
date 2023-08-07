from rest_framework import permissions


class IsInstructor(permissions.BasePermission):
    """
    Custom permission for instructors
    """
    def has_permission(self, request, view):
        return hasattr(request.user, "is_instructor") and request.user.is_instructor == True
    
    def has_object_permission(self, request, view, obj):
        return hasattr(obj, "instructor") and obj.instructor.email == request.user.email

class ReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
    
class UpdateOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.method == "PUT"
    