from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Avg, Count, Q

from .models import Media
from .serializers import MediaSerializer, UserSerializer, RegisterSerializer


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': 'User registered successfully.'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data,
        'message': 'Login successful.'
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user_view(request):
    return Response({
        'user': UserSerializer(request.user).data
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def seed_data_view(request):
    """Seed sample watchlist items for the authenticated user."""
    sample_items = [
        {
            'title': 'Dune: Part Two',
            'type': 'Movie',
            'status': 'Watched',
            'rating': 5,
            'genre': 'Sci-Fi / Adventure',
            'release_year': 2024,
            'poster_url': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
            'notes': 'Stunning cinematography and sound design. Must watch in IMAX!'
        },
        {
            'title': 'Oppenheimer',
            'type': 'Movie',
            'status': 'Watched',
            'rating': 5,
            'genre': 'Biography / Drama / History',
            'release_year': 2023,
            'poster_url': 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80',
            'notes': 'Cillian Murphy gives an extraordinary performance.'
        },
        {
            'title': 'Severance',
            'type': 'TV',
            'status': 'Watched',
            'rating': 5,
            'genre': 'Sci-Fi / Thriller / Mystery',
            'release_year': 2022,
            'poster_url': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
            'notes': 'Mind-bending workplace dystopia. Best cliffhanger in years.'
        },
        {
            'title': 'Shōgun',
            'type': 'TV',
            'status': 'Watched',
            'rating': 4,
            'genre': 'Drama / History / War',
            'release_year': 2024,
            'poster_url': 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=600&auto=format&fit=crop&q=80',
            'notes': 'Masterclass in political intrigue and Japanese feudal history.'
        },
        {
            'title': 'Interstellar',
            'type': 'Movie',
            'status': 'Unwatched',
            'rating': 0,
            'genre': 'Sci-Fi / Adventure',
            'release_year': 2014,
            'poster_url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
            'notes': 'Planning a rewatch this weekend.'
        },
        {
            'title': 'The Bear',
            'type': 'TV',
            'status': 'Unwatched',
            'rating': 0,
            'genre': 'Drama / Comedy',
            'release_year': 2022,
            'poster_url': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
            'notes': 'Heard incredible things about Season 2 and 3.'
        },
        {
            'title': 'Spider-Man: Across the Spider-Verse',
            'type': 'Movie',
            'status': 'Unwatched',
            'rating': 0,
            'genre': 'Animation / Action',
            'release_year': 2023,
            'poster_url': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
            'notes': 'Next up on family movie night.'
        },
        {
            'title': 'Succession',
            'type': 'TV',
            'status': 'Unwatched',
            'rating': 0,
            'genre': 'Drama',
            'release_year': 2018,
            'poster_url': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
            'notes': 'Need to start season 4 soon.'
        }
    ]

    created_count = 0
    for item in sample_items:
        _, created = Media.objects.get_or_create(
            owner=request.user,
            title=item['title'],
            defaults=item
        )
        if created:
            created_count += 1

    return Response({
        'message': f'Successfully seeded {created_count} media items!',
        'count': created_count
    })


class MediaViewSet(viewsets.ModelViewSet):
    serializer_class = MediaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Media.objects.filter(owner=self.request.user)

        # Filter by status: 'Watched' vs 'Unwatched' (To Watch)
        status_param = self.request.query_params.get('status')
        if status_param in ['Watched', 'Unwatched']:
            queryset = queryset.filter(status=status_param)

        # Filter by media type: 'Movie' vs 'TV'
        type_param = self.request.query_params.get('type')
        if type_param in ['Movie', 'TV']:
            queryset = queryset.filter(type=type_param)

        # Search by title or genre or notes
        search_query = self.request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(genre__icontains=search_query) |
                Q(notes__icontains=search_query)
            )

        # Ordering
        ordering = self.request.query_params.get('ordering', '-updated_at')
        valid_orderings = ['created_at', '-created_at', 'updated_at', '-updated_at', 'rating', '-rating', 'title', '-title']
        if ordering in valid_orderings:
            queryset = queryset.order_by(ordering)

        return queryset

    @action(detail=True, methods=['patch', 'post'], url_path='rate')
    def rate(self, request, pk=None):
        """Update the 5-star rating of a media item directly."""
        media = self.get_object()
        rating = request.data.get('rating')

        if rating is None:
            return Response({'error': 'Rating is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rating_val = int(rating)
            if rating_val < 0 or rating_val > 5:
                return Response({'error': 'Rating must be between 0 and 5 stars.'}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid rating value.'}, status=status.HTTP_400_BAD_REQUEST)

        media.rating = rating_val
        # If user rates it with 1-5 stars and it was Unwatched, we can optionally keep or update status.
        # But keeping status change explicit or if rated > 0, allow it.
        media.save()
        return Response(MediaSerializer(media).data)

    @action(detail=True, methods=['patch', 'post'], url_path='toggle-status')
    def toggle_status(self, request, pk=None):
        """Toggle status between 'Watched' and 'Unwatched'."""
        media = self.get_object()
        if media.status == 'Watched':
            media.status = 'Unwatched'
        else:
            media.status = 'Watched'
        media.save()
        return Response(MediaSerializer(media).data)

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Return quick stats summary for dashboard counters."""
        user_media = Media.objects.filter(owner=request.user)
        total = user_media.count()
        watched = user_media.filter(status='Watched').count()
        unwatched = user_media.filter(status='Unwatched').count()
        movies = user_media.filter(type='Movie').count()
        tv_shows = user_media.filter(type='TV').count()
        
        rated_items = user_media.filter(status='Watched', rating__gt=0)
        avg_rating = rated_items.aggregate(Avg('rating'))['rating__avg'] or 0.0

        return Response({
            'total': total,
            'watched': watched,
            'unwatched': unwatched,
            'movies': movies,
            'tv_shows': tv_shows,
            'average_rating': round(avg_rating, 1)
        })
