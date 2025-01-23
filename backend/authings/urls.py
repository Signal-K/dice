# authings/urls.py

from django.urls import path
from .views import LoginView, LogoutView, UpdateCustomerIdView, GetCustomerIdView, ProfileView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'), 
    path('logout/', LogoutView.as_view(), name='logout'), 
    path('update-customer-id/', UpdateCustomerIdView.as_view(), name='update-customer-id'),
    path('update-customer-id/<int:user_id>/', GetCustomerIdView.as_view(), name='get-customer-id'),
    path('profile/', ProfileView.as_view(), name='profile'),
]