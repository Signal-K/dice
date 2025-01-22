from django.urls import path
from .views import UpdateCustomerIdView, GetCustomerIdView

urlpatterns = [
    path('update-customer-id/', UpdateCustomerIdView.as_view(), name='update-customer-id'),
    path('update-customer-id/<int:user_id>/', GetCustomerIdView.as_view(), name='get-customer-id'),
]