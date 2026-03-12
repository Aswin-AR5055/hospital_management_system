from rest_framework import serializers
from .models import Visit
from django.utils import timezone

class VisitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Visit
        fields = '__all__'
        read_only_fields = ['token_no', 'intime', 'outtime']

    def validate(self, attrs):
        doctor = attrs.get("doctor")

        if doctor and doctor.role != "doctor":
            raise serializers.ValidationError({
                "doctor": "Selected user must have the doctor role."
            })

        return attrs

    def create(self, validated_data):

        today = timezone.now().date()
        patient = validated_data["patient"]
        doctor = validated_data["doctor"]

        existing = Visit.objects.filter(
            patient=patient,
            doctor=doctor,
            intime__date=today
        ).first()

        if existing:
            return existing

        last_visit = Visit.objects.filter(
            intime__date = today
        ).order_by('-token_no').first()

        if last_visit:
            token = last_visit.token_no + 1
        else:
            token = 1

        validated_data['token_no'] = token

        return super().create(validated_data)

    def update(self, instance, validated_data):
        instance.outtime = timezone.now()
        return super().update(instance, validated_data)
