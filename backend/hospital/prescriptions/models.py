from django.db import models
from visits.models import Visit

class Prescription(models.Model):
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE)
    medicine_name = models.CharField(max_length=100)
    medicine_type = models.CharField(max_length=50)
    morning = models.BooleanField(default=False)
    afternoon = models.BooleanField(default=False)
    evening = models.BooleanField(default=False)
    quantity = models.IntegerField()