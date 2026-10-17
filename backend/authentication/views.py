from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .models import User, Profile
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    ProfileSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer
)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Account created successfully.',
                'user': UserSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Logged in successfully.',
                'user': UserSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginView(APIView):
    """
    Handles Google OAuth token exchange or simulated SSO for demo.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        fullname = request.data.get('fullname', 'Google User')
        avatar = request.data.get('avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80')

        if not email:
            return Response({'error': 'Email is required for Google authentication.'}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'fullname': fullname,
                'role': 'customer',
                'email_verified': True
            }
        )
        if created and hasattr(user, 'profile'):
            user.profile.avatar = avatar
            user.profile.save()

        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Google authentication successful.',
            'user': UserSerializer(user).data,
            'tokens': tokens,
            'is_new_user': created
        }, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        fullname = request.data.get('fullname')
        mobile = request.data.get('mobile')
        if fullname:
            user.fullname = fullname
        if mobile is not None:
            user.mobile = mobile
        user.save()

        if hasattr(user, 'profile'):
            profile = user.profile
            avatar = request.data.get('avatar')
            company_name = request.data.get('company_name')
            designation = request.data.get('designation')
            if avatar:
                profile.avatar = avatar
            if company_name is not None:
                profile.company_name = company_name
            if designation is not None:
                profile.designation = designation
            profile.save()

        return Response(UserSerializer(user).data)

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            # Always return success to prevent email enumeration
            return Response({
                'message': 'If your email is registered, password reset instructions have been sent.',
                'demo_reset_token': 'rcorp-reset-token-sample-99' if user else None
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            # For demo reset
            new_password = serializer.validated_data['new_password']
            email = request.data.get('email')
            if email:
                user = User.objects.filter(email=email).first()
                if user:
                    user.set_password(new_password)
                    user.save()
                    return Response({'message': 'Password has been reset successfully. Please log in.'})
            return Response({'message': 'Password has been updated.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        user.email_verified = True
        user.save()
        return Response({'message': 'Email verified successfully.'})

class UserListView(APIView):
    """
    Admin user management view.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.all().select_related('profile')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
        if not request.user.is_admin:
            return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)
        user = get_object_or_404(User, pk=pk)
        new_role = request.data.get('role')
        if new_role in ['customer', 'support_agent', 'admin', 'super_admin']:
            user.role = new_role
            if new_role in ['admin', 'super_admin']:
                user.is_staff = True
            user.save()
            return Response(UserSerializer(user).data)
        return Response({'error': 'Invalid role.'}, status=status.HTTP_400_BAD_REQUEST)
