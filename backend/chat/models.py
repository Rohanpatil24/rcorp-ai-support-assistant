import uuid
from django.db import models
from authentication.models import User

class ChatSession(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('escalated', 'Escalated to Agent'),
        ('closed', 'Closed'),
    )

    session_uuid = models.CharField(max_length=64, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='chat_sessions')
    guest_session_id = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=255, default='New Support Conversation')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', db_index=True)
    satisfaction_score = models.PositiveSmallIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chat_sessions'
        ordering = ['-created_at']

    def __str__(self):
        user_display = self.user.email if self.user else f"Guest ({self.guest_session_id})"
        return f"ChatSession {self.session_uuid[:8]} - {user_display} [{self.status}]"

class Message(models.Model):
    SENDER_CHOICES = (
        ('customer', 'Customer'),
        ('ai_assistant', 'AI Assistant'),
        ('human_agent', 'Human Agent'),
        ('system', 'System Notification'),
    )

    SENTIMENT_CHOICES = (
        ('Positive', 'Positive'),
        ('Neutral', 'Neutral'),
        ('Negative', 'Negative'),
    )

    EMOTION_CHOICES = (
        ('Happy', 'Happy'),
        ('Satisfied', 'Satisfied'),
        ('Neutral', 'Neutral'),
        ('Confused', 'Confused'),
        ('Frustrated', 'Frustrated'),
        ('Angry', 'Angry'),
        ('Urgent', 'Urgent'),
        ('Disappointed', 'Disappointed'),
    )

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES)
    message = models.TextField()
    sentiment = models.CharField(max_length=20, choices=SENTIMENT_CHOICES, default='Neutral', db_index=True)
    emotion = models.CharField(max_length=20, choices=EMOTION_CHOICES, default='Neutral', db_index=True)
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, default=85.00)
    retrieved_doc_sources = models.JSONField(default=list, blank=True)
    is_escalation_trigger = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages'
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.sender}] {self.emotion} ({self.confidence_score}%): {self.message[:40]}"
