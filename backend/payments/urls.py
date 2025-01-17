from django.urls import path
from .views import StripeCheckoutViewIndividualMonthly, StripeCheckoutViewTeamMonthly, StripeSessionDetailsView


urlpatterns = [
    path('create-checkout-individual-monthly-session', StripeCheckoutViewIndividualMonthly.as_view()),
    path('create-checkout-team-monthly-session', StripeCheckoutViewTeamMonthly.as_view()),
    path('get-session-details', StripeSessionDetailsView.as_view())
]