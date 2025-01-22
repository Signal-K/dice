from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/stripe/', include('payments.urls')),
    path('admin/', admin.site.urls),
    path('api/auth/', include('authings.urls')),
]