import uuid
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from .models import ChatSession, Message
from .serializers import ChatSessionSerializer, ChatSessionDetailSerializer, MessageSerializer
from .ai_engine import RCorpAIEngine, EmotionAnalyzer
from tickets.models import Ticket

class ChatSessionListCreateView(APIView):
    """
    List user sessions or create a new session. Supports authenticated users and guest access.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            if request.user.is_agent:
                sessions = ChatSession.objects.all().select_related('user')
            else:
                sessions = ChatSession.objects.filter(user=request.user)
        else:
            guest_id = request.query_params.get('guest_id')
            if not guest_id:
                return Response([])
            sessions = ChatSession.objects.filter(guest_session_id=guest_id)

        serializer = ChatSessionSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        session_uuid = f"sess_{uuid.uuid4().hex[:16]}"
        title = request.data.get('title', 'Customer Inquiry')
        user = request.user if request.user.is_authenticated else None
        guest_id = request.data.get('guest_id') if not user else None

        session = ChatSession.objects.create(
            session_uuid=session_uuid,
            user=user,
            guest_session_id=guest_id,
            title=title
        )

        # Initial welcome message
        welcome_text = (
            "Hello! Welcome to R Corporation Customer Support. I am your AI assistant. "
            "How can I assist you with your services or account today?"
        )
        Message.objects.create(
            session=session,
            sender='ai_assistant',
            message=welcome_text,
            sentiment='Positive',
            emotion='Happy',
            confidence_score=99.0
        )

        return Response(ChatSessionDetailSerializer(session).data, status=status.HTTP_201_CREATED)

class ChatSessionDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, session_uuid):
        session = get_object_or_404(ChatSession, session_uuid=session_uuid)
        if request.user.is_authenticated and not request.user.is_agent and session.user and session.user != request.user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        return Response(ChatSessionDetailSerializer(session).data)

class SendMessageView(APIView):
    """
    Core AI Chat endpoint. Receives user message, runs emotion detection, performs RAG,
    generates solution-oriented adaptive response, updates escalation status, and logs ticket if needed.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, session_uuid):
        session = get_object_or_404(ChatSession, session_uuid=session_uuid)
        user_text = request.data.get('message', '').strip()

        if not user_text:
            return Response({'error': 'Message cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Analyze Emotion & Sentiment of user message
        analysis = EmotionAnalyzer.analyze(user_text)
        
        # 2. Persist Customer Message
        user_message_obj = Message.objects.create(
            session=session,
            sender='customer',
            message=user_text,
            sentiment=analysis['sentiment'],
            emotion=analysis['emotion'],
            confidence_score=analysis['confidence'],
            is_escalation_trigger=analysis['is_escalation_trigger']
        )

        # Update session title if first message
        if session.messages.count() <= 3:
            session.title = user_text[:40] + ('...' if len(user_text) > 40 else '')
            session.save()

        # 3. Retrieve conversation history for context
        history = list(session.messages.all().order_by('created_at'))

        # 4. Generate AI Response using R Corporation Engine + RAG
        user_profile = session.user.profile if (session.user and hasattr(session.user, 'profile')) else None
        ai_result = RCorpAIEngine.generate_response(
            user_message=user_text,
            conversation_history=history,
            user_profile=user_profile
        )

        # 5. Persist AI Assistant Message
        ai_message_obj = Message.objects.create(
            session=session,
            sender='ai_assistant',
            message=ai_result['response_text'],
            sentiment='Neutral',
            emotion='Neutral',
            confidence_score=95.0,
            retrieved_doc_sources=ai_result['retrieved_sources'],
            is_escalation_trigger=ai_result['is_escalation_trigger']
        )

        # 6. Check Escalation Trigger & Auto-ticket generation
        created_ticket_number = None
        if ai_result['is_escalation_trigger'] or session.status == 'escalated':
            session.status = 'escalated'
            session.save()

            # Auto-generate ticket if user is registered and no ticket exists for this session yet
            if session.user and not Ticket.objects.filter(source_session_id=session.session_uuid).exists():
                ticket = Ticket.objects.create(
                    title=f"Escalated Session: {session.title}",
                    description=f"Auto-generated ticket from escalated conversation.\n\nTrigger Query: {user_text}\nDetected Emotion: {analysis['emotion']} ({analysis['sentiment']})",
                    status='Open',
                    priority='Urgent' if analysis['emotion'] in ['Angry', 'Urgent'] else 'High',
                    created_by=session.user,
                    source_session_id=session.session_uuid
                )
                created_ticket_number = ticket.ticket_number

        return Response({
            'customer_message': MessageSerializer(user_message_obj).data,
            'ai_message': MessageSerializer(ai_message_obj).data,
            'session_status': session.status,
            'internal_analysis': analysis,  # Provided for admin/agent inspection
            'retrieved_sources': ai_result['retrieved_sources'],
            'created_ticket_number': created_ticket_number
        }, status=status.HTTP_200_OK)

class EscalateSessionView(APIView):
    """
    Explicit user or agent escalation trigger.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, session_uuid):
        session = get_object_or_404(ChatSession, session_uuid=session_uuid)
        session.status = 'escalated'
        session.save()

        # Add system notification message
        system_msg = Message.objects.create(
            session=session,
            sender='system',
            message='Conversation has been escalated to a Human Support Specialist. An agent will connect shortly.',
            sentiment='Neutral',
            emotion='Neutral',
            confidence_score=100.0,
            is_escalation_trigger=True
        )

        ticket_number = None
        if session.user and not Ticket.objects.filter(source_session_id=session.session_uuid).exists():
            ticket = Ticket.objects.create(
                title=f"User Escalation: {session.title}",
                description=f"User requested human escalation.\nSession: {session.session_uuid}",
                status='Open',
                priority='High',
                created_by=session.user,
                source_session_id=session.session_uuid
            )
            ticket_number = ticket.ticket_number

        return Response({
            'message': 'Session escalated successfully.',
            'session_status': session.status,
            'ticket_number': ticket_number,
            'system_message': MessageSerializer(system_msg).data
        })

class SubmitCSATView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, session_uuid):
        session = get_object_or_404(ChatSession, session_uuid=session_uuid)
        score = request.data.get('score')
        if score in [1, 2, 3, 4, 5]:
            session.satisfaction_score = score
            session.status = 'resolved'
            session.save()
            return Response({'message': 'Thank you for your rating!', 'satisfaction_score': score})
        return Response({'error': 'Score must be between 1 and 5.'}, status=status.HTTP_400_BAD_REQUEST)

class ExportChatHistoryView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, session_uuid):
        session = get_object_or_404(ChatSession, session_uuid=session_uuid)
        messages = session.messages.all().order_by('created_at')

        lines = [
            f"=== R Corporation Customer Support Transcript ===",
            f"Session ID: {session.session_uuid}",
            f"Started: {session.start_time}",
            f"Status: {session.status}",
            f"CSAT Rating: {session.satisfaction_score or 'N/A'}/5",
            "=" * 50,
            ""
        ]

        for m in messages:
            timestamp = m.created_at.strftime("%Y-%m-%d %H:%M:%S")
            sender_label = m.sender.replace('_', ' ').title()
            lines.append(f"[{timestamp}] {sender_label}:")
            lines.append(f"{m.message}")
            if m.sender == 'customer':
                lines.append(f"  [Internal Analysis: Emotion={m.emotion}, Sentiment={m.sentiment}, Confidence={m.confidence_score}%]")
            lines.append("-" * 40)

        transcript_text = "\n".join(lines)
        response = HttpResponse(transcript_text, content_type='text/plain')
        response['Content-Disposition'] = f'attachment; filename="rcorp_chat_{session.session_uuid[:8]}.txt"'
        return response
