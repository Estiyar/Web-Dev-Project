from django.contrib import admin
from .models import Category, Car, Review, Favorite, Part, CommunityPost, CommunityComment

admin.site.register(Category)
admin.site.register(Review)
admin.site.register(Favorite)
admin.site.register(Part)
admin.site.register(CommunityPost)
admin.site.register(CommunityComment)

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ['title', 'brand', 'year', 'price', 'city', 'owner', 'is_active']
    list_filter = ['category', 'condition', 'city']
    search_fields = ['title', 'brand']
