import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'watchlist_backend.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from watchlist_api.models import Media

# 1. Create or get Demo User
user, created = User.objects.get_or_create(
    username='demo',
    defaults={'email': 'demo@watchlist.app'}
)
if created:
    user.set_password('demo1234')
    user.save()
    print("Created demo user: demo / demo1234")
else:
    user.set_password('demo1234')
    user.save()
    print("Updated demo user password")

token, _ = Token.objects.get_or_create(user=user)
print(f"Demo token: {token.key}")

# 2. Seed initial items for demo user if empty
if Media.objects.filter(owner=user).count() == 0:
    items = [
        {
            'title': 'Dune: Part Two',
            'type': 'Movie',
            'status': 'Watched',
            'rating': 5,
            'genre': 'Sci-Fi / Adventure',
            'release_year': 2024,
            'poster_url': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
            'notes': 'Cinematic masterpiece! Denis Villeneuve did it again.'
        },
        {
            'title': 'Oppenheimer',
            'type': 'Movie',
            'status': 'Watched',
            'rating': 5,
            'genre': 'Biography / Drama / History',
            'release_year': 2023,
            'poster_url': 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80',
            'notes': 'Gripping tension from start to finish.'
        },
        {
            'title': 'Severance',
            'type': 'TV',
            'status': 'Watched',
            'rating': 5,
            'genre': 'Sci-Fi / Mystery / Thriller',
            'release_year': 2022,
            'poster_url': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
            'notes': 'The waffle party episode is unforgettable.'
        },
        {
            'title': 'Shōgun',
            'type': 'TV',
            'status': 'Watched',
            'rating': 4,
            'genre': 'Drama / History / Adventure',
            'release_year': 2024,
            'poster_url': 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=600&auto=format&fit=crop&q=80',
            'notes': 'Stunning costume design and incredible acting.'
        },
        {
            'title': 'Interstellar',
            'type': 'Movie',
            'status': 'Unwatched',
            'rating': 0,
            'genre': 'Sci-Fi / Adventure',
            'release_year': 2014,
            'poster_url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
            'notes': 'Hans Zimmer score is legendary. Re-watching in 4K.'
        },
        {
            'title': 'The Bear',
            'type': 'TV',
            'status': 'Unwatched',
            'rating': 0,
            'genre': 'Drama / Comedy',
            'release_year': 2022,
            'poster_url': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            'notes': 'Starting Season 2 next Tuesday!'
        },
        {
            'title': 'Spider-Man: Across the Spider-Verse',
            'type': 'Movie',
            'status': 'Unwatched',
            'rating': 0,
            'genre': 'Animation / Action / Sci-Fi',
            'release_year': 2023,
            'poster_url': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
            'notes': 'Every frame is a work of art.'
        },
        {
            'title': 'Succession',
            'type': 'TV',
            'status': 'Unwatched',
            'rating': 0,
            'genre': 'Drama',
            'release_year': 2018,
            'poster_url': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
            'notes': 'High-stakes boardroom drama.'
        }
    ]
    for item in items:
        Media.objects.create(owner=user, **item)
    print(f"Seeded {len(items)} items for demo user.")
else:
    print("Demo items already exist.")
