from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Visit
from .serializers import VisitSerializer

class DoctorQueueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "doctor":
            return Response(
                {"error": "Only doctors can access the queue"},
                status=403
            )
        today = timezone.now().date()

        visits = Visit.objects.filter(
            doctor=request.user,
            intime__date=today
        ).order_by("token_no")

        serializer = VisitSerializer(visits, many=True)

        return Response(serializer.data)

class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all() 

    serializer_class = VisitSerializer