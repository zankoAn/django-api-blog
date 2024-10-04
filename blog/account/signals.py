from django.db.models.signals import post_save
from django.dispatch import receiver

from blog.account.models import Resume, User


@receiver(post_save, sender=User)
def create_order(sender, instance, created, **kwargs):
    if created:
        Resume.objects.create(user=instance)
