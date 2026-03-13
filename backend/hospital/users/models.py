from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    ROLE_CHOICES = (
        ('doctor', 'Doctor'),
        ('reception', 'Reception'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True, null=True, help_text="WhatsApp number with country code (e.g., +919999999999)")