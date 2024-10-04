from django.contrib import admin

from blog.account.models import User, Resume, WorkExperience


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "is_active", "phone_number")
    list_display_links = ("id", "username", "phone_number")
    list_editable = ("is_active",)
    search_fields = ("username", "email", "is_active")


class WorkExperienceInline(admin.StackedInline):
    model = WorkExperience
    extra = 1


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    inlines = [WorkExperienceInline]
    list_display = ("id", "user", "current_position")
    list_display_links = ("id", "current_position")

admin.site.register(WorkExperience)