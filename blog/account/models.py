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


class Profile(models.Model):
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    bio = models.TextField(
        max_length=300, 
        blank=True,
        null=True,
        verbose_name=_("Bio")
    )
    avatar = models.CharField(
        blank=True,
        null=True,
        verbose_name=_("Profile Avatar")
    )
    social_links = ArrayField(
        models.CharField(max_length=80, blank=True, null=True),
        size=4,
        blank=True,
        null=True,
        verbose_name=_("Social Links"),
    )

    def __str__(self) -> str:
        return self.user.username

