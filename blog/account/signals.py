from django.db.models.signals import post_save
from django.dispatch import receiver

from blog.account.models import Profile, User


@receiver(post_save, sender=User)
def create_order(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
