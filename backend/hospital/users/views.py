from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from .models import User
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated

class RegisterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role not in ['reception', 'doctor']:
            return Response({"error": "Permission denied"}, status=403)

        serializer = RegisterSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response({"message": "User created successfully"})

class LoginView(APIView):
    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
