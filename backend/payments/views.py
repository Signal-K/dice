import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)

class StripeCheckoutViewIndividualMonthly(APIView):
    def post(self, request):
        try:
            line_items = [
                {'price': 'price_1Qi9MnBTr6htJNML1S8YjbOE', 'quantity': 1},
            ]

            # Fetch and validate prices individually
            intervals = set()
            for item in line_items:
                price = stripe.Price.retrieve(item['price'])
                if 'recurring' in price and 'interval' in price.recurring:
                    intervals.add(price.recurring['interval'])
            
            if len(intervals) > 1:
                return Response(
                    {'error': 'Checkout does not support multiple prices with different billing intervals.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            checkout_session = stripe.checkout.Session.create(
                line_items=line_items,
                payment_method_types=['card'],
                mode='subscription',
                success_url=settings.SITE_URL + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?canceled=true',
            )

            return Response({'url': checkout_session.url})
        except stripe.error.StripeError as e:
            logger.error(f"StripeError: {e.user_message}")
            return Response(
                {'error': e.user_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"General Error: {str(e)}")
            return Response(
                {'error': 'Something went wrong when creating the stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StripeCheckoutViewTeamMonthly(APIView):
    def post(self, request):
        try:
            line_items = [
                {'price': 'price_1Qi9W4BTr6htJNMLBXYpe0K6', 'quantity': 1},
            ]

            # Fetch and validate prices individually
            intervals = set()
            for item in line_items:
                price = stripe.Price.retrieve(item['price'])
                if 'recurring' in price and 'interval' in price.recurring:
                    intervals.add(price.recurring['interval'])
            
            if len(intervals) > 1:
                return Response(
                    {'error': 'Checkout does not support multiple prices with different billing intervals.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            checkout_session = stripe.checkout.Session.create(
                line_items=line_items,
                payment_method_types=['card'],
                mode='subscription',
                success_url=settings.SITE_URL + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?canceled=true',
            )

            return Response({'url': checkout_session.url})
        except stripe.error.StripeError as e:
            logger.error(f"StripeError: {e.user_message}")
            return Response(
                {'error': e.user_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"General Error: {str(e)}")
            return Response(
                {'error': 'Something went wrong when creating the stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class StripeSessionDetailsView(APIView):
    def get(self, request):
        session_id = request.GET.get("session_id")
        if not session_id:
            return Response({'error': 'Session ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            session = stripe.checkout.Session.retrieve(session_id)

            # Collect session details
            session_details = {
                "id": session.id,
                "status": session.status,
                "amount_subtotal": session.amount_subtotal,
                "amount_total": session.amount_total,
                "currency": session.currency,
                "customer_email": session.customer_details.email,
                "customer_name": session.customer_details.name,
                "payment_status": session.payment_status,
                "invoice": session.invoice,
                "subscription": session.subscription,
                "success_url": session.success_url,
                "cancel_url": session.cancel_url,
                "created": session.created,
                "expiration": session.expires_at,
                "payment_method_types": session.payment_method_types,
            }

            line_items = stripe.checkout.Session.list_line_items(session.id, limit=1)
            product_details = []
            for item in line_items.data:
                product_details.append({
                    'name': item.description,
                    'amount_total': item.amount_total,
                    'image_url': item.image,
                })

            session_details["line_items"] = product_details

            return Response(session_details)
        
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e.user_message}")
            return Response({'error': e.user_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': 'Failed to retrieve session details'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)