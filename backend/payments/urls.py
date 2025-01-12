from django.urls import path
from .views import StripeCheckoutView
from .views import StripeSessionDetailsView

urlpatterns = [
    path('create-checkout-session', StripeCheckoutView.as_view()),
    path('get-session-details', StripeSessionDetailsView.as_view()),  # Add this line
]