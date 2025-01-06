import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)

class StripeCheckoutView(APIView):
    """
    Creates a Stripe Checkout session.
    """
    def post(self, request):
        try:
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': 'price_1Qgdg6BTr6htJNMLUfRBMpwl', 
                        'quantity': 1,
                    },
                ],
                payment_method_types=['card'],
                mode='subscription',
                success_url=settings.SITE_URL + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?canceled=true',
            )

            return Response({'url': checkout_session.url})
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e.user_message}")
            return Response({'error': e.user_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': 'Something went wrong when creating the Stripe checkout session'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StripeSessionDetailsView(APIView):
    """
    Retrieves session details from Stripe using the session ID.
    """
    def get(self, request):
        session_id = request.GET.get('session_id')
        if not session_id:
            return Response({'error': 'Session ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            session = stripe.checkout.Session.retrieve(session_id)
            line_items = stripe.checkout.Session.list_line_items(session_id, limit=1)

            product_details = []
            for item in line_items.data:
                product_details.append({
                    'name': item.description, 
                    'amount_total': item.amount_total,  
                    'image_url': item.image, 
                })

            return Response({'line_items': product_details})

        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e.user_message}")
            return Response({'error': e.user_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': 'Failed to retrieve session details'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)