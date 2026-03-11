from django.db import models

class Patient(models.Model):

    name = models.CharField(max_length=100)

    address = models.TextField()

    phone = models.CharField(max_length=15)

    email = models.EmailField(blank=True)

    whatsapp_no = models.CharField(max_length=15)

    dob = models.DateField()

    age = models.IntegerField()

    temperature = models.FloatField()

    photo = models.ImageField(upload_to="patients/", null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name