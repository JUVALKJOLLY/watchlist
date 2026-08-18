import os
from pathlib import Path
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse
from django.conf import settings


def home_view(request):
    frontend_index = settings.BASE_DIR.parent / 'frontend' / 'dist' / 'index.html'
    if os.path.exists(frontend_index):
        try:
            with open(frontend_index, 'r', encoding='utf-8') as f:
                return HttpResponse(f.read(), content_type='text/html')
        except Exception:
            pass

    return JsonResponse({
        'app': 'CineTrack — Movie & TV Watchlist API',
        'status': 'online',
        'version': '1.0.0',
        'message': 'Django REST Backend is running successfully!',
        'endpoints': {
            'api_root': '/api/',
            'auth_login': '/api/auth/login/',
            'auth_register': '/api/auth/register/',
            'auth_me': '/api/auth/me/',
            'media': '/api/media/',
            'stats': '/api/media/stats/',
            'admin': '/admin/',
        },
        'demo_credentials': {
            'username': 'demo',
            'password': 'demo1234'
        }
    })


urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('watchlist_api.urls')),
]
