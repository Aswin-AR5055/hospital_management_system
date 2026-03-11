from django.contrib import admin
from .models import Visit


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "patient",
        "doctor",
        "token_no",
        "intime",
        "outtime",
    )

    list_filter = ("doctor", "intime")

    search_fields = ("patient__name",)

    ordering = ("-token_no",)