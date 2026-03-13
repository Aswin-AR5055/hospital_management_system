from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    list_display = (
        "id",
        "username",
        "role",
        "phone_number",
        "is_active",
        "is_superuser",
    )

    list_filter = ("role",)

    fieldsets = UserAdmin.fieldsets + (
        ("Hospital Role", {"fields": ("role", "phone_number")}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Hospital Role", {"fields": ("role", "phone_number")}),
    )