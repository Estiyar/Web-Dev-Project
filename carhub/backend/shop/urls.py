from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login_view),
    path('auth/register/', views.register_view),
    path('auth/logout/', views.logout_view),
    path('auth/profile/', views.profile_view),

    path('categories/', views.CategoryListView.as_view()),

    path('cars/', views.CarListView.as_view()),
    path('cars/<int:pk>/', views.CarDetailView.as_view()),

    path('reviews/', views.ReviewListView.as_view()),
    path('reviews/<int:pk>/', views.ReviewDetailView.as_view()),

    path('favorites/', views.FavoriteListView.as_view()),

    path('parts/', views.PartListView.as_view()),
    path('parts/<int:pk>/', views.PartDetailView.as_view()),

    path('community/posts/', views.CommunityPostListView.as_view()),
    path('community/posts/<int:pk>/', views.CommunityPostDetailView.as_view()),
    path('community/posts/<int:pk>/comments/', views.community_comment_create_view),
]
