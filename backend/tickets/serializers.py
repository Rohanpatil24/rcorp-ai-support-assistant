from rest_framework import serializers
from .models import Ticket, TicketComment

class TicketCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.fullname')
    author_role = serializers.ReadOnlyField(source='author.role')

    class Meta:
        model = TicketComment
        fields = ['id', 'ticket', 'author', 'author_name', 'author_role', 'comment', 'is_internal_note', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']

class TicketSerializer(serializers.ModelSerializer):
    created_by_name = serializers.ReadOnlyField(source='created_by.fullname')
    created_by_email = serializers.ReadOnlyField(source='created_by.email')
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.fullname')
    comments = TicketCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_number', 'title', 'description', 'status', 'priority',
            'created_by', 'created_by_name', 'created_by_email',
            'assigned_to', 'assigned_to_name', 'source_session_id',
            'resolution_notes', 'comments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ticket_number', 'created_by', 'created_at', 'updated_at']
