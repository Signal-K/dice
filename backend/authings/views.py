from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

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
            # Fetch the user by ID
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