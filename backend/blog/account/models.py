from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    email = models.EmailField(
        max_length=100,
        unique=True,
        verbose_name="email"
    )
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        verbose_name=_("Phone Number")
    )
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["last_name", "username"]

    def __str__(self) -> str:
        return self.username


class Resume(models.Model):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name="resume"
    )
    summary = models.TextField(
        max_length=400,
        blank=True,
        null=True,
        verbose_name=_("Summary")
    )
    avatar = models.CharField(
        blank=True,
        null=True,
        verbose_name=_("Profile Avatar")
    )
    contacts = ArrayField(
        models.CharField(max_length=80, blank=True, null=True),
        size=5,
        blank=True,
        null=True,
        verbose_name=_("Social Links"),
    )
    current_position = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_("Current Position"),
    )
    skills = ArrayField(
        models.CharField(max_length=50, blank=True, null=True),
        size=15,
        blank=True,
        null=True,
        verbose_name=_("Skills"),
    )
    soft_skills = ArrayField(
        models.CharField(max_length=100, blank=True, null=True),
        size=4,
        blank=True,
        null=True,
        verbose_name=_("Soft Skills"),
    )
    educations=models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_("Educations"),
    )

    def __str__(self) -> str:
        return self.user.username


class WorkExperience(models.Model):
    resume = models.ForeignKey(
        to="Resume",
        related_name="work_experiences",
        on_delete=models.CASCADE
    )
    company_name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name=_("Company Name"),
    )
    position=models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name=_("Position"),
    )
    links = ArrayField(
        models.CharField(max_length=60, blank=True, null=True),
        size=3,
        blank=True,
        null=True,
        verbose_name=_("Links"),
    )
    work_duration = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_("Work Duration"),
    )
    summary = models.CharField(
        max_length=300,
        blank=True,
        null=True,
        verbose_name=_("Summary"),
    )
    achievements = ArrayField(
        models.CharField(max_length=300, blank=True, null=True),
        size=6,
        blank=True,
        null=True,
        verbose_name=_("Bullet Points"),
    )

    def __str__(self):
        return f"{self.company_name} - {self.work_duration}"
