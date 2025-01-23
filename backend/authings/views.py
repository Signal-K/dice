# authings/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model, login, logout, authenticate
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(email=email, password=password)
        if user is not None:
        
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

        
            return Response({'accessToken': access_token}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request) 
        return Response({"message": "Logged out successfully"})

class UpdateCustomerIdView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('userId')
        customer_id = request.data.get('customerId')

        if not user_id or not customer_id:
            return Response(
                {"error": "Both userId and customerId are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=user_id)
            user.customer_id = customer_id
            user.save()
            return Response({"message": "Customer ID updated successfully"})
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

class GetCustomerIdView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')

        if not user_id:
            return Response(
                {"error": "User ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=user_id)
            return Response({"customer_id": user.customer_id})
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            'email': user.email,
            'name': user.name,
            'customer_id': user.customer_id
        })



class LogoutView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, TokenError):
            return Response(status=status.HTTP_400_BAD_REQUEST)