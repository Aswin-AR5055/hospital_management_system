from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'phone_number']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role', 'phone_number']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            role=validated_data['role'],
            phone_number=validated_data.get('phone_number', '')  # Add this line
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get("username", "").strip()
        password = data.get("password")

        matched_user = User.objects.filter(username__iexact=username).first()

        user = authenticate(
            username=matched_user.username if matched_user else username,
            password=password
        )

        if not user:
            raise serializers.ValidationError({
                "detail": "Invalid username or password."
            })
        if not user.is_active:
            raise serializers.ValidationError({
                "detail": "This account is disabled."
            })

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "username": user.username
        }
