from django.db import models
from patients.models import Patient
from users.models import User

class Visit(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)

    doctor = models.ForeignKey(User, on_delete=models.CASCADE)

    token_no = models.IntegerField()

    health_issue = models.TextField(null=True, blank=True)

    weight = models.FloatField(null=True, blank=True)

    blood_pressure = models.CharField(max_length=20, null=True, blank=True)

    height = models.FloatField(null=True, blank=True)

    intime = models.DateTimeField(auto_now_add=True)

    outtime = models.DateTimeField(null=True, blank=True)