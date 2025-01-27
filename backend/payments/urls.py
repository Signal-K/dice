from django.urls import path
from .views import (
    StripeCheckoutViewIndividualMonthly,
    StripeCheckoutViewTeamMonthly,
    StripeSessionDetailsView,
    StripeCheckoutViewIndividualYearly,
    StripeCheckoutViewTeamYearly,
    StripeInvoiceDetailsView,
    CustomerInvoicesView,
    InvoiceProductIdsView
)

urlpatterns = [
    path('create-checkout-individual-monthly-session', StripeCheckoutViewIndividualMonthly.as_view()),
    path('create-checkout-individual-yearly-session', StripeCheckoutViewIndividualYearly.as_view()),
    path('create-checkout-team-monthly-session', StripeCheckoutViewTeamMonthly.as_view()),
    path('create-checkout-team-yearly-session', StripeCheckoutViewTeamYearly.as_view()),
    path('get-plan-details', StripeSessionDetailsView.as_view(), name='get-plan-details'),
    path('get-customer-invoices', CustomerInvoicesView.as_view()),
    path('get-invoice-details', StripeInvoiceDetailsView.as_view(), name='get-invoice-details'),
    path('invoice-line-items/', InvoiceProductIdsView.as_view(), name='invoice_product_ids'),
]