from rest_framework import serializers
from .models import ContactInquiry

class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = ['id', 'name', 'email', 'phone', 'company', 'subject', 'message', 'is_demo_request', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']
