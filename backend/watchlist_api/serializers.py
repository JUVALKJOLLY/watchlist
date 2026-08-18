from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Media


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class MediaSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Media
        fields = [
            'id',
            'title',
            'type',
            'status',
            'rating',
            'owner',
            'owner_username',
            'genre',
            'release_year',
            'poster_url',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def validate_rating(self, value):
        if value is not None and (value < 0 or value > 5):
            raise serializers.ValidationError("Rating must be an integer between 0 and 5.")
        return value

    def create(self, validated_data):
        # Assign current authenticated user as owner
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
