from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Ticket, TicketComment
from .serializers import TicketSerializer, TicketCommentSerializer

class TicketListCreateView(APIView):
    """
    List tickets (customers see their own, agents/admins see all) and create new tickets.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        status_filter = request.query_params.get('status')
        priority_filter = request.query_params.get('priority')
        search_query = request.query_params.get('search')

        if user.is_agent:
            tickets = Ticket.objects.all().select_related('created_by', 'assigned_to')
        else:
            tickets = Ticket.objects.filter(created_by=user).select_related('created_by', 'assigned_to')

        if status_filter:
            tickets = tickets.filter(status=status_filter)
        if priority_filter:
            tickets = tickets.filter(priority=priority_filter)
        if search_query:
            tickets = tickets.filter(title__icontains=search_query) | tickets.filter(ticket_number__icontains=search_query)

        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            ticket = serializer.save(created_by=request.user)
            return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TicketDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, ticket_number):
        user = request.user
        if user.is_agent:
            ticket = get_object_or_404(Ticket, ticket_number=ticket_number)
        else:
            ticket = get_object_or_404(Ticket, ticket_number=ticket_number, created_by=user)
        return Response(TicketSerializer(ticket).data)

    def patch(self, request, ticket_number):
        user = request.user
        if user.is_agent:
            ticket = get_object_or_404(Ticket, ticket_number=ticket_number)
        else:
            ticket = get_object_or_404(Ticket, ticket_number=ticket_number, created_by=user)

        data = request.data
        if 'status' in data and user.is_agent:
            ticket.status = data['status']
        if 'priority' in data and user.is_agent:
            ticket.priority = data['priority']
        if 'assigned_to' in data and user.is_agent:
            ticket.assigned_to_id = data['assigned_to']
        if 'resolution_notes' in data and user.is_agent:
            ticket.resolution_notes = data['resolution_notes']
        if 'title' in data and (user.is_agent or ticket.status == 'Open'):
            ticket.title = data['title']
        if 'description' in data and (user.is_agent or ticket.status == 'Open'):
            ticket.description = data['description']

        ticket.save()
        return Response(TicketSerializer(ticket).data)

class TicketCommentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, ticket_number):
        ticket = get_object_or_404(Ticket, ticket_number=ticket_number)
        if not request.user.is_agent and ticket.created_by != request.user:
            return Response({'error': 'Unauthorized to comment on this ticket.'}, status=status.HTTP_403_FORBIDDEN)

        comment_text = request.data.get('comment')
        is_internal = request.data.get('is_internal_note', False) and request.user.is_agent

        if not comment_text:
            return Response({'error': 'Comment content cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        comment = TicketComment.objects.create(
            ticket=ticket,
            author=request.user,
            comment=comment_text,
            is_internal_note=is_internal
        )
        return Response(TicketCommentSerializer(comment).data, status=status.HTTP_201_CREATED)
