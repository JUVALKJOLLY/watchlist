from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Media


class MediaAPITestCase(APITestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(username='filmfan', password='testpassword123', email='fan@movies.com')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Create another user to verify data isolation
        self.other_user = User.objects.create_user(username='otheruser', password='password123')

        # Create media items
        self.movie1 = Media.objects.create(
            title='Inception',
            type='Movie',
            status='Watched',
            rating=5,
            owner=self.user
        )
        self.tv1 = Media.objects.create(
            title='Breaking Bad',
            type='TV',
            status='Unwatched',
            rating=0,
            owner=self.user
        )
        self.other_media = Media.objects.create(
            title='Secret Movie',
            type='Movie',
            status='Watched',
            rating=4,
            owner=self.other_user
        )

    def test_auth_register(self):
        self.client.credentials()  # Remove credentials
        response = self.client.post('/api/auth/register/', {
            'username': 'newuser',
            'password': 'newpassword',
            'email': 'new@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_auth_login(self):
        self.client.credentials()
        response = self.client.post('/api/auth/login/', {
            'username': 'filmfan',
            'password': 'testpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['token'], self.token.key)

    def test_media_list_data_isolation(self):
        """User should only see their own media items."""
        response = self.client.get('/api/media/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [item['title'] for item in response.data]
        self.assertIn('Inception', titles)
        self.assertIn('Breaking Bad', titles)
        self.assertNotIn('Secret Movie', titles)

    def test_filter_by_status(self):
        """Test filtering by status='Watched' vs 'Unwatched'."""
        watched_resp = self.client.get('/api/media/?status=Watched')
        self.assertEqual(watched_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(watched_resp.data), 1)
        self.assertEqual(watched_resp.data[0]['title'], 'Inception')

        unwatched_resp = self.client.get('/api/media/?status=Unwatched')
        self.assertEqual(unwatched_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(unwatched_resp.data), 1)
        self.assertEqual(unwatched_resp.data[0]['title'], 'Breaking Bad')

    def test_create_media(self):
        payload = {
            'title': 'Dune',
            'type': 'Movie',
            'status': 'Unwatched',
            'genre': 'Sci-Fi'
        }
        response = self.client.post('/api/media/', payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Dune')
        self.assertEqual(response.data['owner_username'], 'filmfan')

    def test_rate_media_5_star_action(self):
        """Test updating 5-star rating via /api/media/<id>/rate/."""
        response = self.client.patch(f'/api/media/{self.tv1.id}/rate/', {'rating': 4})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['rating'], 4)
        self.tv1.refresh_from_db()
        self.assertEqual(self.tv1.rating, 4)

    def test_rate_media_invalid_rating(self):
        response = self.client.patch(f'/api/media/{self.tv1.id}/rate/', {'rating': 6})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_toggle_status_action(self):
        """Test toggling status between Watched and Unwatched."""
        self.assertEqual(self.tv1.status, 'Unwatched')
        response = self.client.patch(f'/api/media/{self.tv1.id}/toggle-status/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Watched')

        # Toggle back
        response = self.client.patch(f'/api/media/{self.tv1.id}/toggle-status/')
        self.assertEqual(response.data['status'], 'Unwatched')

    def test_stats_endpoint(self):
        response = self.client.get('/api/media/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total'], 2)
        self.assertEqual(response.data['watched'], 1)
        self.assertEqual(response.data['unwatched'], 1)
        self.assertEqual(response.data['average_rating'], 5.0)
