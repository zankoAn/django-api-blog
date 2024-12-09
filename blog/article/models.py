import base64

from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext as _
from django.utils.translation import gettext_lazy as lazy_

User = get_user_model()


class Category(models.Model):
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children"
    )
    name = models.CharField(
        max_length=100,
        verbose_name=lazy_("Name")
    )
    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
        allow_unicode=True,
        verbose_name=lazy_("Slug")
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=lazy_("Description")
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Article(models.Model):

    class StatusChoices(models.TextChoices):
        publish = _("publish")
        reject = _("reject")
        draft = _("draft")
        waiting = _("waiting")

    author = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name="articles",
        verbose_name=lazy_("Author")
    )
    categories = models.ManyToManyField(
        Category,
        related_name="articles",
        verbose_name=lazy_("Categories")
    )
    tags = ArrayField(
        models.CharField(max_length=20, blank=True, null=True),
        size=5,
        blank=True,
        null=True,
        verbose_name=lazy_("Tags"),
        help_text=lazy_("Comma-separated list of tags")
    )
    title = models.CharField(
        max_length=200,
        verbose_name=lazy_("Title")
    )
    slug = models.SlugField(
        max_length=120,
        unique=True,
        allow_unicode=True,
        blank=True,
        verbose_name=lazy_("Slug")
    )
    summary = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name=lazy_("Short Summary")
    )
    status = models.CharField(
        max_length=40,
        choices=StatusChoices.choices,
        default=StatusChoices.draft,
        blank=True,
    )
    cover = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name=lazy_("Cover")
    )
    body = models.TextField(
        verbose_name=lazy_("Body")
    )
    view_cnt = models.PositiveIntegerField(
        default=0,
        blank=True,
        verbose_name=lazy_("View count")
    )
    is_commentable = models.BooleanField(
        default=True,
        blank=True,
        verbose_name=lazy_("Allow Send Comment")
    )
    metadata = models.JSONField(
        null=True,
        blank=True,
        verbose_name=lazy_("Metadata")
    )
    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name=lazy_("Created Time")
    )
    updated = models.DateTimeField(
        auto_now=True,
        verbose_name=lazy_("Updated Time")
    )
    published = models.DateField(
        auto_now_add=True,
        verbose_name=lazy_("Publish Date")
    )

    def __str__(self):
        return self.title
    

    def generate_unique_id(self):
        data = f"{self.id}:{self.title[:6]}"
        key = 0x5F
        encrypted_data = "".join(chr(ord(char) ^ key) for char in data)
        encoded_data = base64.urlsafe_b64encode(encrypted_data.encode())
        return encoded_data.decode()

    def save(self, *args, **kwargs):
        if not self.pk:
            slug = self.slug if self.slug else self.title
            self.slug = slugify(slug) + f"-{self.generate_unique_id()}"
        super().save(*args, **kwargs)