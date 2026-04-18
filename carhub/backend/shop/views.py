from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Category, Car, Review, Favorite, Part, CommunityPost, CommunityComment
from .serializers import (
    LoginSerializer, RegisterSerializer,
    CategorySerializer, CarSerializer, ReviewSerializer, FavoriteSerializer,
    PartSerializer, CommunityPostSerializer, CommunityCommentSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = serializer.validated_data['user']
    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
        return Response({'message': 'Вы вышли из системы.'})
    except Exception:
        return Response({'error': 'Неверный токен.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    cars = Car.objects.by_user(user)
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'my_cars': CarSerializer(cars, many=True).data,
    })


class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        return Response(CategorySerializer(categories, many=True).data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CarListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        cars = Car.objects.active()
        category = request.query_params.get('category')
        brand = request.query_params.get('brand')
        city = request.query_params.get('city')
        search = request.query_params.get('search')
        model = request.query_params.get('model')
        body_type = request.query_params.get('bodyType') or request.query_params.get('body_type')
        fuel_type = request.query_params.get('fuelType') or request.query_params.get('fuel_type')
        transmission = request.query_params.get('transmission')
        drivetrain = request.query_params.get('drivetrain')
        color = request.query_params.get('color')
        condition = request.query_params.get('condition')
        min_engine = request.query_params.get('min_engine')
        max_engine = request.query_params.get('max_engine')
        year_from = request.query_params.get('year_from')
        year_to = request.query_params.get('year_to')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        min_mileage = request.query_params.get('min_mileage')
        max_mileage = request.query_params.get('max_mileage')

        if category:
            cars = cars.filter(category_id=category)
        if brand:
            cars = cars.filter(brand__icontains=brand)
        if model:
            cars = cars.filter(model__icontains=model)
        if city:
            cars = cars.filter(city__icontains=city)
        if search:
            cars = cars.filter(
                Q(title__icontains=search) |
                Q(brand__icontains=search) |
                Q(model__icontains=search)
            )
        if body_type:
            cars = cars.filter(body_type__icontains=body_type)
        if fuel_type:
            cars = cars.filter(fuel_type__icontains=fuel_type)
        if transmission:
            cars = cars.filter(transmission__icontains=transmission)
        if drivetrain:
            cars = cars.filter(drivetrain__icontains=drivetrain)
        if color:
            cars = cars.filter(color__icontains=color)
        if condition:
            cars = cars.filter(condition=condition)
        if min_engine:
            cars = cars.filter(engine_volume__gte=min_engine)
        if max_engine:
            cars = cars.filter(engine_volume__lte=max_engine)
        if year_from:
            cars = cars.filter(year__gte=year_from)
        if year_to:
            cars = cars.filter(year__lte=year_to)
        if min_price:
            cars = cars.filter(price__gte=min_price)
        if max_price:
            cars = cars.filter(price__lte=max_price)
        if min_mileage:
            cars = cars.filter(mileage__gte=min_mileage)
        if max_mileage:
            cars = cars.filter(mileage__lte=max_mileage)

        return Response(CarSerializer(cars, many=True, context={'request': request}).data)

    def post(self, request):
        serializer = CarSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(owner=request.user, is_active=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CarDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, pk):
        car = get_object_or_404(Car, pk=pk)
        return Response(CarSerializer(car, context={'request': request}).data)

    def put(self, request, pk):
        car = get_object_or_404(Car, pk=pk, owner=request.user)
        serializer = CarSerializer(car, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        car = get_object_or_404(Car, pk=pk, owner=request.user)
        car.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        car_id = request.query_params.get('car')
        reviews = Review.objects.filter(car_id=car_id) if car_id else Review.objects.all()
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        review = get_object_or_404(Review, pk=pk, user=request.user)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FavoriteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        return Response(FavoriteSerializer(favorites, many=True).data)

    def post(self, request):
        car_id = request.data.get('car')
        car = get_object_or_404(Car, pk=car_id)
        favorite, created = Favorite.objects.get_or_create(user=request.user, car=car)
        if not created:
            favorite.delete()
            return Response({'message': 'Удалено из избранного.'})
        return Response(FavoriteSerializer(favorite).data, status=status.HTTP_201_CREATED)


class PartListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        parts = Part.objects.all()
        brand = request.query_params.get('brand')
        model = request.query_params.get('model')
        category = request.query_params.get('category') or request.query_params.get('partCategory')
        condition = request.query_params.get('condition')
        city = request.query_params.get('city')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')

        if brand:
            parts = parts.filter(brand__icontains=brand)
        if model:
            parts = parts.filter(model__icontains=model)
        if category:
            parts = parts.filter(part_category__icontains=category)
        if condition:
            parts = parts.filter(condition=condition)
        if city:
            parts = parts.filter(city__icontains=city)
        if min_price:
            parts = parts.filter(price__gte=min_price)
        if max_price:
            parts = parts.filter(price__lte=max_price)

        return Response(PartSerializer(parts, many=True, context={'request': request}).data)

    def post(self, request):
        serializer = PartSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PartDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, pk):
        part = get_object_or_404(Part, pk=pk)
        return Response(PartSerializer(part, context={'request': request}).data)

    def put(self, request, pk):
        part = get_object_or_404(Part, pk=pk, owner=request.user)
        serializer = PartSerializer(part, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        part = get_object_or_404(Part, pk=pk, owner=request.user)
        part.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommunityPostListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        posts = CommunityPost.objects.prefetch_related('comments__author', 'author').all()
        brand = request.query_params.get('brand')
        if brand and brand != 'Все':
            posts = posts.filter(brand__iexact=brand)
        return Response(CommunityPostSerializer(posts, many=True).data)

    def post(self, request):
        serializer = CommunityPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommunityPostDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        post = get_object_or_404(CommunityPost.objects.prefetch_related('comments__author', 'author'), pk=pk)
        return Response(CommunityPostSerializer(post).data)

    def delete(self, request, pk):
        post = get_object_or_404(CommunityPost, pk=pk, author=request.user)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def community_comment_create_view(request, pk):
    post = get_object_or_404(CommunityPost, pk=pk)
    serializer = CommunityCommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user, post=post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
