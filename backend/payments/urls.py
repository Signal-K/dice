from django.urls import path
from .views import StripeCheckoutViewIndividualMonthly, StripeCheckoutViewTeamMonthly, StripeSessionDetailsView, StripeCheckoutViewIndividualYearly, StripeCheckoutViewTeamYearly


urlpatterns = [
    path('create-checkout-individual-monthly-session', StripeCheckoutViewIndividualMonthly.as_view()),
    path('create-checkout-individual-yearly-session', StripeCheckoutViewIndividualYearly.as_view()),
    path('create-checkout-team-monthly-session', StripeCheckoutViewTeamMonthly.as_view()),
    path('create-checkout-team-yearly-session', StripeCheckoutViewTeamYearly.as_view()),
    path('get-session-details', StripeSessionDetailsView.as_view()),
]