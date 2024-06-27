from django.contrib import admin

from blog.account.models import Profile, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "is_active", "phone_number")
    list_display_links = ("id", "username", "phone_number")
    list_editable = ("is_active",)
    search_fields = ("username", "email", "is_active")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user")
    list_display_links = ("id", "user")
