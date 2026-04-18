from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Category, Car, Review, Favorite, Part, CommunityPost, CommunityComment


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data['username'].strip()
        password = data['password']
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError('Неверный логин или пароль.')
        data['username'] = username
        data['user'] = user
        return data


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    password_confirm = serializers.CharField(write_only=True, required=False)
    passwordConfirm = serializers.CharField(write_only=True, required=False)

    def validate_username(self, value):
        value = value.strip()
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Это имя уже занято.')
        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate(self, data):
        data['username'] = data['username'].strip()
        data['email'] = data['email'].strip().lower()
        password_confirm = data.get('password_confirm') or data.get('passwordConfirm')
        if not password_confirm:
            raise serializers.ValidationError({'password_confirm': 'Подтвердите пароль.'})
        if data['password'] != password_confirm:
            raise serializers.ValidationError({'password_confirm': 'Пароли не совпадают.'})
        data['password_confirm'] = password_confirm
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        validated_data.pop('passwordConfirm', None)
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon']


class CarSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    bodyType = serializers.CharField(source='body_type', required=False)
    engineVolume = serializers.DecimalField(source='engine_volume', max_digits=3, decimal_places=1, required=False)
    fuelType = serializers.CharField(source='fuel_type', required=False)
    drivetrain = serializers.CharField(required=False)
    transmission = serializers.CharField(required=False)
    color = serializers.CharField(required=False)
    image_file = serializers.FileField(required=False, allow_null=True, write_only=True)
    is_active = serializers.BooleanField(required=False, default=True)

    class Meta:
        model = Car
        fields = [
            'id', 'owner', 'owner_name', 'category', 'category_name',
            'title', 'brand', 'model', 'year', 'price', 'mileage',
            'bodyType', 'engineVolume', 'fuelType', 'transmission', 'drivetrain', 'color',
            'condition', 'description', 'city', 'image_url', 'image_file', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'owner', 'owner_name', 'created_at']

    def get_owner_name(self, obj):
        return obj.owner.first_name or obj.owner.username

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image_file:
            image_url = instance.image_file.url
            data['image_url'] = request.build_absolute_uri(image_url) if request else image_url
        return data


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'car', 'username', 'rating', 'text', 'created_at']
        read_only_fields = ['id', 'username', 'created_at']

    def get_username(self, obj):
        return obj.user.first_name or obj.user.username


class FavoriteSerializer(serializers.ModelSerializer):
    car_detail = CarSerializer(source='car', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'car', 'car_detail', 'created_at']
        read_only_fields = ['id', 'created_at']


class PartSerializer(serializers.ModelSerializer):
    sellerName = serializers.SerializerMethodField()
    partCategory = serializers.CharField(source='part_category')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    image = serializers.CharField(source='image_url', required=False)
    image_file = serializers.FileField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = Part
        fields = [
            'id', 'title', 'brand', 'model', 'partCategory', 'condition',
            'price', 'city', 'description', 'image', 'image_url', 'image_file', 'sellerName', 'createdAt'
        ]
        read_only_fields = ['id', 'sellerName', 'createdAt']

    def get_sellerName(self, obj):
        return obj.owner.first_name or obj.owner.username

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image_file:
            image_url = instance.image_file.url
            resolved = request.build_absolute_uri(image_url) if request else image_url
            data['image_url'] = resolved
            data['image'] = resolved
        return data


class CommunityCommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    postId = serializers.IntegerField(source='post_id', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = CommunityComment
        fields = ['id', 'postId', 'author', 'text', 'createdAt']
        read_only_fields = ['id', 'postId', 'author', 'createdAt']

    def get_author(self, obj):
        return obj.author.first_name or obj.author.username


class CommunityPostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    comments = CommunityCommentSerializer(many=True, read_only=True)

    class Meta:
        model = CommunityPost
        fields = ['id', 'title', 'description', 'brand', 'author', 'createdAt', 'comments']
        read_only_fields = ['id', 'author', 'createdAt', 'comments']

    def get_author(self, obj):
        return obj.author.first_name or obj.author.username
