from django.urls import path
from .views import (
    ChatSessionListCreateView,
    ChatSessionDetailView,
    SendMessageView,
    EscalateSessionView,
    SubmitCSATView,
    ExportChatHistoryView
)

urlpatterns = [
    path('sessions/', ChatSessionListCreateView.as_view(), name='chat-sessions-list-create'),
    path('sessions/<str:session_uuid>/', ChatSessionDetailView.as_view(), name='chat-sessions-detail'),
    path('sessions/<str:session_uuid>/messages/', SendMessageView.as_view(), name='chat-send-message'),
    path('sessions/<str:session_uuid>/escalate/', EscalateSessionView.as_view(), name='chat-escalate'),
    path('sessions/<str:session_uuid>/csat/', SubmitCSATView.as_view(), name='chat-csat'),
    path('sessions/<str:session_uuid>/export/', ExportChatHistoryView.as_view(), name='chat-export'),
]
