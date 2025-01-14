import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)

class StripeCheckoutView(APIView):
    def post(self, request):
        try:
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': 'price_1Qgdg6BTr6htJNMLUfRBMpwl',
                        'quantity': 1,
                    },
                ],
                payment_method_types=['card',], # 'sepa_debit'],
                mode='subscription',
                success_url=settings.SITE_URL + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?canceled=true',
            )

            return Response({'url': checkout_session.url})
        except stripe.error.StripeError as e:
            logger.error(f"StripeError: {e.user_message}")  # Log Stripe-specific error
            return Response(
                {'error': e.user_message}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"General Error: {str(e)}")  # Log any other error
            return Response(
                {'error': 'Something went wrong when creating the stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )