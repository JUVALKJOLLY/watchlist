from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MediaViewSet,
    register_view,
    login_view,
    current_user_view,
    seed_data_view
)

router = DefaultRouter()
router.register(r'media', MediaViewSet, basename='media')

urlpatterns = [
    path('auth/register/', register_view, name='auth-register'),
    path('auth/login/', login_view, name='auth-login'),
    path('auth/me/', current_user_view, name='auth-me'),
    path('seed/', seed_data_view, name='seed-data'),
    path('', include(router.urls)),
]
