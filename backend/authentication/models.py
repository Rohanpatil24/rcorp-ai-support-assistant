from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, fullname, password=None, role='customer', **extra_fields):
        if not email:
            raise ValueError('Email address is mandatory')
        email = self.normalize_email(email)
        user = self.model(email=email, fullname=fullname, role=role, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)

        # Create linked profile automatically
        Profile.objects.create(user=user)
        return user

    def create_superuser(self, email, fullname, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'super_admin')
        extra_fields.setdefault('email_verified', True)
        return self.create_user(email, fullname, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('support_agent', 'Support Agent'),
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
    )

    fullname = models.CharField(max_length=150)
    email = models.EmailField(unique=True, db_index=True)
    mobile = models.CharField(max_length=25, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer', db_index=True)
    email_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['fullname']

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.fullname} ({self.email}) - {self.role}"

    @property
    def is_admin(self):
        return self.role in ['admin', 'super_admin']

    @property
    def is_agent(self):
        return self.role in ['support_agent', 'admin', 'super_admin']

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.URLField(max_length=500, blank=True, null=True)
    company_name = models.CharField(max_length=150, blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    notification_preferences = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'profiles'

    def __str__(self):
        return f"Profile of {self.user.email}"
