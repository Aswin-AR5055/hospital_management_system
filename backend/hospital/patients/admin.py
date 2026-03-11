from django.contrib import admin
from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "phone",
        "age",
        "temperature",
        "created_at",
    )

    search_fields = ("name", "phone")

    list_filter = ("created_at",)

    ordering = ("-id",)