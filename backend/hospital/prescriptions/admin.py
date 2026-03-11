from django.contrib import admin
from .models import Prescription


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "visit",
        "medicine_name",
        "medicine_type",
        "quantity",
    )

    search_fields = ("medicine_name",)

    ordering = ("-id",)