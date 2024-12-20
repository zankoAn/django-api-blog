# Generated by Django 5.0.6 on 2024-09-29 00:25

import django.contrib.postgres.fields
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_alter_profile_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Resume',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('summary', models.TextField(blank=True, max_length=400, null=True, verbose_name='Summary')),
                ('avatar', models.CharField(blank=True, null=True, verbose_name='Profile Avatar')),
                ('contacts', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=80, null=True), blank=True, null=True, size=5, verbose_name='Social Links')),
                ('current_position', models.CharField(blank=True, max_length=100, null=True, verbose_name='Current Position')),
                ('skills', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=50, null=True), blank=True, null=True, size=15, verbose_name='Skills')),
                ('soft_skills', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=100, null=True), blank=True, null=True, size=4, verbose_name='Soft Skills')),
                ('educations', models.CharField(blank=True, max_length=100, null=True, verbose_name='Educations')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='resume', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='WorkExperience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(blank=True, max_length=100, null=True, verbose_name='Company Name')),
                ('position', models.CharField(blank=True, max_length=100, null=True, verbose_name='Position')),
                ('links', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=60, null=True), blank=True, null=True, size=3, verbose_name='Links')),
                ('work_duration', models.CharField(blank=True, max_length=100, null=True, verbose_name='Work Duration')),
                ('summary', models.CharField(blank=True, max_length=300, null=True, verbose_name='Summary')),
                ('achievements', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=300, null=True), blank=True, null=True, size=6, verbose_name='Bullet Points')),
                ('resume', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='work_experiences', to='account.resume')),
            ],
        ),
        migrations.DeleteModel(
            name='Profile',
        ),
    ]
