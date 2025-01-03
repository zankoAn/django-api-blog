# Generated by Django 5.0.6 on 2024-06-22 20:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('article', '0002_alter_article_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='status',
            field=models.CharField(blank=True, choices=[('publish', 'Publish'), ('reject', 'Reject'), ('draft', 'Draft'), ('waiting', 'Waiting')], default='draft', max_length=40),
        ),
        migrations.AlterField(
            model_name='category',
            name='slug',
            field=models.SlugField(allow_unicode=True, blank=True, max_length=120, unique=True, verbose_name='Slug'),
        ),
    ]
