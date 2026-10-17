from django.urls import path
from .views import (
    KnowledgeDocumentListView,
    KnowledgeDocumentDetailView,
    KnowledgeSemanticSearchView
)

urlpatterns = [
    path('documents/', KnowledgeDocumentListView.as_view(), name='kb-documents-list'),
    path('documents/<int:pk>/', KnowledgeDocumentDetailView.as_view(), name='kb-documents-detail'),
    path('search/', KnowledgeSemanticSearchView.as_view(), name='kb-semantic-search'),
]
