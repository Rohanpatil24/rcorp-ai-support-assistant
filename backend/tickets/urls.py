from django.urls import path
from .views import TicketListCreateView, TicketDetailView, TicketCommentCreateView

urlpatterns = [
    path('', TicketListCreateView.as_view(), name='tickets-list-create'),
    path('<str:ticket_number>/', TicketDetailView.as_view(), name='tickets-detail'),
    path('<str:ticket_number>/comments/', TicketCommentCreateView.as_view(), name='tickets-comments'),
]
