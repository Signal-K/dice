from django.urls import path
from .views import LoginView, LogoutView, UpdateCustomerIdView, GetCustomerIdView, ProfileView

from django.urls import path
from .views import LoginView, LogoutView, ProfileView, UserOrganisationsView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('user-organisations/', UserOrganisationsView.as_view(), name='user-organisations'),
]