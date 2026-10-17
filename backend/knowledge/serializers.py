from rest_framework import serializers
from .models import KnowledgeDocument

class KnowledgeDocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.ReadOnlyField(source='uploaded_by.fullname')

    class Meta:
        model = KnowledgeDocument
        fields = [
            'id', 'document_name', 'document_type', 'category', 'vector_id',
            'file_path', 'content_text', 'content_summary', 'file_size_kb',
            'total_chunks', 'is_active', 'uploaded_by', 'uploaded_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'vector_id', 'created_at', 'updated_at']
