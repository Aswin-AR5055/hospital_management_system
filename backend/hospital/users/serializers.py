from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role']

    def create(self, validated_data):
        user = User(
            username = validated_data['username'],
            role = validated_data['role']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user 

class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):

        user = authenticate(
            username=data.get("username"),
            password=data.get("password")
        )

        if not user:
            raise serializers.ValidationError("Invalid Credentials")
        if not user.is_active:
            raise serializers.ValidationError("User disabled")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "username": user.username
        }