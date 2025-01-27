from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from authings import urls

urlpatterns = [
    path('api/stripe/', include('payments.urls')),
    path('admin/', admin.site.urls),
    path('api/auth/', include('authings.urls')), 
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
]