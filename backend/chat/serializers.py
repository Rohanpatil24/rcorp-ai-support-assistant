from rest_framework import serializers
from .models import ChatSession, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = [
            'id', 'session', 'sender', 'message', 'sentiment',
            'emotion', 'confidence_score', 'retrieved_doc_sources',
            'is_escalation_trigger', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class ChatSessionSerializer(serializers.ModelSerializer):
    message_count = serializers.IntegerField(source='messages.count', read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            'id', 'session_uuid', 'user', 'guest_session_id', 'title',
            'start_time', 'end_time', 'status', 'satisfaction_score',
            'message_count', 'last_message', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'session_uuid', 'start_time', 'created_at', 'updated_at']

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'message': last_msg.message[:80],
                'sender': last_msg.sender,
                'created_at': last_msg.created_at
            }
        return None

class ChatSessionDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    user_name = serializers.ReadOnlyField(source='user.fullname')
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = ChatSession
        fields = [
            'id', 'session_uuid', 'user', 'user_name', 'user_email',
            'guest_session_id', 'title', 'start_time', 'end_time',
            'status', 'satisfaction_score', 'messages', 'created_at', 'updated_at'
        ]
