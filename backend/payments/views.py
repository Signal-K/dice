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
        
class StripeCheckoutViewIndividualYearly(APIView):
    def post(self, request):
        try:
            line_items = [
                {
                    'price': 'price_1QjD0LBTr6htJNMLetJHpwsj',
                    'quantity': 1
                },
            ]

            intervals = set()
            for item in line_items:
                price = stripe.Price.retrieve(item['price'])
                if 'recurring' in price and 'interval' in price.recurring:
                    intervals.add(price.recurring['interval'])

            if len(intervals) > 1:
                return Response(
                    {'error': 'Checkout does not support multiple prices with different billing intervals.'},
                    status=status.HTTP_400_BAD_REQUEST,
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
            logger.error(f'StripeError: {e.user_message}')
            return Response(
                {'error': e.user_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.error(f"General Error: {str(e)}")
            return Response(
                {'error': 'Something went wrong when creating the stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class StripeCheckoutViewTeamMonthly(APIView):
    def post(self, request):
        try:
            line_items = [
                {'price': 'price_1Qi9W4BTr6htJNMLBXYpe0K6', 'quantity': 1},
            ]

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
        
class StripeCheckoutViewTeamYearly(APIView):
    def post(self, request):
        try:
            line_items = [
                {
                    'price': 'price_1QjD1GBTr6htJNML5iNhf10w',
                    'quantity': 1
                },
            ]

            intervals = set()
            for item in line_items:
                price = stripe.Price.retrieve(item['price'])
                if 'recurring' in price and 'interval' in price.recurring:
                    intervals.add(price.recurring['interval'])

            if len(intervals) > 1:
                return Response(
                    {'error': 'Checkout does not support multiple prices with different billing intervals.'},
                    status=status.HTTP_400_BAD_REQUEST,
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
            logger.error(f'StripeError: {e.user_message}')
            return Response(
                {'error': e.user_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.error(f"General Error: {str(e)}")
            return Response(
                {'error': 'Something went wrong when creating the stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class StripeSessionDetailsView(APIView):
    def get(self, request):
        session_id = request.GET.get("session_id")
        if not session_id:
            return Response({'error': 'Session ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            session_details = {
                "id": session.id,
                "status": session.status,
                "amount_subtotal": session.amount_subtotal,
                "amount_total": session.amount_total,
                "currency": session.currency,
                "customer_email": session.customer_details.email if session.customer_details else None,
                "customer_name": session.customer_details.name if session.customer_details else None,
                "payment_status": session.payment_status,
                "invoice": session.invoice,
                "subscription": session.subscription,
                "success_url": session.success_url,
                "cancel_url": session.cancel_url,
                "created": session.created,
                "expiration": session.expires_at,
                "payment_method_types": session.payment_method_types,
                "customer_id": session.customer,
            }

            # Fetch line items with product_id and product_name
            line_items = stripe.checkout.Session.list_line_items(session.id, limit=10)
            product_details = []
            for item in line_items.data:
                product = stripe.Product.retrieve(item.price.product)
                product_details.append({
                    'product_id': product.id,  # Add the product ID
                    'product_name': product.name,  # Add the product name
                    'amount_total': item.amount_total,
                    'description': item.description,
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

    def get(self, request):
        session_id = request.GET.get("session_id")
        if not session_id:
            return Response({'error': 'Session ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            session_details = {
                "id": session.id,
                "status": session.status,
                "amount_subtotal": session.amount_subtotal,
                "amount_total": session.amount_total,
                "currency": session.currency,
                "customer_email": session.customer_details.email if session.customer_details else None,
                "customer_name": session.customer_details.name if session.customer_details else None,
                "payment_status": session.payment_status,
                "invoice": session.invoice,
                "subscription": session.subscription,
                "success_url": session.success_url,
                "cancel_url": session.cancel_url,
                "created": session.created,
                "expiration": session.expires_at,
                "payment_method_types": session.payment_method_types,
                "customer_id": session.customer 
            }

            # Fetch subscription details if available
            if session.subscription:
                subscription = stripe.Subscription.retrieve(session.subscription)

                # Get the current transaction date (start of the current period)
                current_transaction_date = subscription.current_period_start
                next_transaction_date = subscription.current_period_end

                # Convert to readable date format
                from datetime import datetime
                current_transaction_date = datetime.utcfromtimestamp(current_transaction_date).strftime('%Y-%m-%d')
                next_transaction_date = datetime.utcfromtimestamp(next_transaction_date).strftime('%Y-%m-%d')

                session_details["current_transaction_date"] = current_transaction_date
                session_details["next_transaction_date"] = next_transaction_date

            # Fetch line items
            line_items = stripe.checkout.Session.list_line_items(session.id, limit=10)
            product_details = []
            for item in line_items.data:
                product_details.append({
                    'name': item.description,
                    'amount_total': item.amount_total,
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
        
class StripeInvoiceDetailsView(APIView):
    def get(self, request):
        invoice_id = request.GET.get("invoice_id")
        if not invoice_id:
            return Response({'error': 'Invoice ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Retrieve the invoice details from Stripe
            invoice = stripe.Invoice.retrieve(invoice_id)
            
            # Structure the response data
            invoice_details = {
                "id": invoice.id,
                "status": invoice.status,
                "amount_due": invoice.amount_due,
                "amount_paid": invoice.amount_paid,
                "amount_remaining": invoice.amount_remaining,
                "currency": invoice.currency,
                "customer_email": invoice.customer_email,
                "customer_name": invoice.customer_name,
                "hosted_invoice_url": invoice.hosted_invoice_url,
                "invoice_pdf": invoice.invoice_pdf,
                "created": invoice.created,
                "due_date": invoice.due_date,
                "lines": [],
                "subscription": invoice.subscription,
                "metadata": invoice.metadata,
            }

            # Fetch product details for each line item
            for line in invoice.lines.data:
                product = stripe.Product.retrieve(line.price.product)
                invoice_details["lines"].append({
                    "description": line.description,
                    "amount": line.amount,
                    "quantity": line.quantity,
                    "product_id": product.id,  # Add the product ID here
                    "product_name": product.name,  # Add the product name here
                })

            return Response(invoice_details)
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e.user_message}")
            return Response({'error': e.user_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': 'Failed to retrieve invoice details'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CustomerInvoicesView(APIView):
    def get(self, request):
        customer_id = request.GET.get("customer_id")
        if not customer_id:
            return Response({'error': 'Customer ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            invoices = stripe.Invoice.list(customer=customer_id)
            invoice_data = [
                {
                    "id": invoice.id,
                    "hosted_invoice_url": invoice.hosted_invoice_url,
                    "status": invoice.status,
                    "amount_due": invoice.amount_due / 100,
                    "currency": invoice.currency.upper(),
                }
                for invoice in invoices.data
            ]
            return Response(invoice_data, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            return Response({'error': e.user_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'error': 'Failed to fetch invoices'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InvoiceProductIdsView(APIView):
    def get(self, request):
        invoice_id = request.GET.get("invoice_id")
        if not invoice_id:
            return Response({'error': 'Invoice ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve the invoice details from Stripe
            invoice = stripe.Invoice.retrieve(invoice_id)
            
            # Initialize list to store line item details
            line_items = []

            # Fetch product details for each line item
            for line in invoice.lines.data:
                product = stripe.Product.retrieve(line.price.product)
                
                # Append all relevant line item details
                line_items.append({
                    'id': line.id,
                    'amount': line.amount,
                    'amount_excluding_tax': line.amount_excluding_tax,
                    'currency': line.currency,
                    'description': line.description,
                    'livemode': line.livemode,
                    'quantity': line.quantity,
                    'subscription': line.subscription,
                    'price': line.price,
                    'plan': line.plan,
                    'unit_amount_excluding_tax': line.unit_amount_excluding_tax,
                    'product_id': product.id,
                    'product_name': product.name
                })

            return Response({"line_items": line_items})
        
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e.user_message}")
            return Response({'error': e.user_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': 'Failed to retrieve invoice details'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)