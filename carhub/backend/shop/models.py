from django.db import models
from django.contrib.auth.models import User


class ActiveCarManager(models.Manager):
    def active(self):
        return self.get_queryset().filter(is_active=True)

    def by_user(self, user):
        return self.get_queryset().filter(owner=user)


class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=100, default='🚗')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'


class Car(models.Model):
    CONDITION_CHOICES = [
        ('new', 'Новый'),
        ('used', 'Б/У'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cars')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='cars')
    title = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    mileage = models.IntegerField(default=0)
    body_type = models.CharField(max_length=50, default='Sedan')
    engine_volume = models.DecimalField(max_digits=3, decimal_places=1, default=2.0)
    fuel_type = models.CharField(max_length=50, default='Petrol')
    transmission = models.CharField(max_length=50, default='Automatic')
    drivetrain = models.CharField(max_length=50, default='FWD')
    color = models.CharField(max_length=50, default='Black')
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES, default='used')
    description = models.TextField()
    city = models.CharField(max_length=100, default='Алматы')
    image_url = models.URLField(blank=True, default='')
    image_file = models.FileField(upload_to='cars/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = ActiveCarManager()

    def __str__(self):
        return f"{self.brand} {self.model} {self.year}"

    class Meta:
        ordering = ['-created_at']


class Review(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(default=5)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.car.title}"


class Part(models.Model):
    CONDITION_CHOICES = [
        ('new', 'Новая'),
        ('used', 'Б/У'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='parts')
    title = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    part_category = models.CharField(max_length=100)
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES, default='used')
    price = models.DecimalField(max_digits=12, decimal_places=2)
    city = models.CharField(max_length=100, default='Алматы')
    description = models.TextField()
    image_url = models.URLField(blank=True, default='')
    image_file = models.FileField(upload_to='parts/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class CommunityPost(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_posts')
    title = models.CharField(max_length=200)
    description = models.TextField()
    brand = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class CommunityComment(models.Model):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username} - {self.post.title}"

    class Meta:
        ordering = ['-created_at']


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'car')

    def __str__(self):
        return f"{self.user.username} - {self.car.title}"
