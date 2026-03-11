from rest_framework import viewsets
from .models import Prescription
from .serializers import PrescriptionSerializer

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()

    serializer_class = PrescriptionSerializer
