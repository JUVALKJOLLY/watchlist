from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Media(models.Model):
    TYPE_CHOICES = [
        ('Movie', 'Movie'),
        ('TV', 'TV Show'),
    ]

    STATUS_CHOICES = [
        ('Unwatched', 'To Watch'),
        ('Watched', 'Watched'),
    ]

    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Movie')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Unwatched')
    rating = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        null=True,
        blank=True,
        help_text="5-star rating (0-5, where 0 means unrated)"
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='media_items'
    )
    genre = models.CharField(max_length=120, blank=True, default='')
    release_year = models.IntegerField(null=True, blank=True)
    poster_url = models.URLField(max_length=500, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at', '-created_at']
        verbose_name = 'Media Item'
        verbose_name_plural = 'Media Items'

    def __str__(self):
        return f"{self.title} ({self.type}) - {self.status} [{self.rating}★]"
