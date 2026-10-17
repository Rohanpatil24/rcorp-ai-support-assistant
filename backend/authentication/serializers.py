from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar', 'company_name', 'designation', 'notification_preferences', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'fullname', 'email', 'mobile', 'role', 'email_verified', 'is_active', 'created_at', 'profile']
        read_only_fields = ['id', 'email_verified', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    company_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['fullname', 'email', 'mobile', 'password', 'confirm_password', 'role', 'company_name']

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        company_name = validated_data.pop('company_name', None)
        role = validated_data.get('role', 'customer')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            fullname=validated_data['fullname'],
            password=validated_data['password'],
            mobile=validated_data.get('mobile', ''),
            role=role
        )
        if company_name and hasattr(user, 'profile'):
            user.profile.company_name = company_name
            user.profile.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password credentials.')
            if not user.is_active:
                raise serializers.ValidationError('This user account has been disabled.')
            attrs['user'] = user
            return attrs
        raise serializers.ValidationError('Both email and password are required.')

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    confirm_new_password = serializers.CharField(min_length=8)

    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('confirm_new_password'):
            raise serializers.ValidationError({"new_password": "Passwords do not match."})
        return attrs
