from django.db import models
from authentication.models import User

class KnowledgeDocument(models.Model):
    DOC_TYPE_CHOICES = (
        ('PDF', 'PDF Document'),
        ('DOCX', 'Word Document'),
        ('FAQ', 'FAQ Document'),
        ('SOP', 'Standard Operating Procedure'),
        ('POLICY', 'Company Policy'),
        ('MANUAL', 'Product Manual'),
    )

    document_name = models.CharField(max_length=255, db_index=True)
    document_type = models.CharField(max_length=20, choices=DOC_TYPE_CHOICES, default='POLICY')
    category = models.CharField(max_length=100, default='General')
    vector_id = models.CharField(max_length=128, unique=True, db_index=True)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    content_text = models.TextField(help_text="Extracted plain text or policy content for semantic search")
    content_summary = models.TextField(blank=True, null=True)
    file_size_kb = models.PositiveIntegerField(default=0)
    total_chunks = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='uploaded_docs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'knowledge_base'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.document_name} [{self.document_type}]"
