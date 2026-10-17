from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    GoogleLoginView,
    UserProfileView,
    ForgotPasswordView,
    ResetPasswordView,
    VerifyEmailView,
    UserListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('google-login/', GoogleLoginView.as_view(), name='auth-google-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('users/', UserListView.as_view(), name='admin-users-list'),
    path('users/<int:pk>/', UserListView.as_view(), name='admin-users-detail'),
]
