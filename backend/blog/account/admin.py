from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from blog.account.models import User, Resume, WorkExperience


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("id", "username", "email", "is_active", "phone_number")
    list_display_links = ("id", "username", "phone_number")
    list_editable = ("is_active",)
    search_fields = ("username", "email", "is_active")

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "username",
                    "email",
                    "phone_number",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                )
            },
        ),
        ("Personal info", {"fields": ("first_name", "last_name")}),
    )


class WorkExperienceInline(admin.StackedInline):
    model = WorkExperience
    extra = 1


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    inlines = [WorkExperienceInline]
    list_display = ("id", "user", "current_position")
    list_display_links = ("id", "current_position")
