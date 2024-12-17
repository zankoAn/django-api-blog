from rest_framework.permissions import BasePermission


class IsAdminOrAuthor(BasePermission):
    def has_permission(self, request, view):
        if request.method in ("POST", "PATCH", "DELETE"):
            if not bool(request.user and request.user.is_authenticated):
                return False

        if request.method in ("PATCH", "DELETE"):
            is_admin = bool(request.user and request.user.is_staff)
            author = request.data.get("author")
            if not is_admin and author and author != request.user.id:
                return False
            return True
        return True


class IsReadOrCreateAllowed(BasePermission):
    def has_permission(self, request, view):
        if view.action in ("list", "destroy", "partial_update"):
            if not bool(request.user and request.user.is_authenticated):
                return False

        if view.action in ("list", "destroy"):
            if not request.user.is_staff:
                return False
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or view.action == "retrieve":
            return True

        if obj.id != request.user.id:
            return False

        return True


class AdminOrStaffCanModify(BasePermission):
    def has_permission(self, request, view):
        if request.method in ("POST", "PATCH", "DELETE"):
            if not request.user or not request.user.is_staff:
                return False

        return True

