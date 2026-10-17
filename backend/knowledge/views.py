import uuid
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import KnowledgeDocument
from .serializers import KnowledgeDocumentSerializer
from .vector_store import VectorStoreRetriever

class KnowledgeDocumentListView(APIView):
    """
    List active knowledge base documents or upload new knowledge base files/policies.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        category = request.query_params.get('category')
        doc_type = request.query_params.get('type')
        query = request.query_params.get('search')

        docs = KnowledgeDocument.objects.all()
        if not request.user.is_agent:
            docs = docs.filter(is_active=True)

        if category:
            docs = docs.filter(category__iexact=category)
        if doc_type:
            docs = docs.filter(document_type__iexact=doc_type)
        if query:
            docs = docs.filter(document_name__icontains=query)

        serializer = KnowledgeDocumentSerializer(docs, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_admin:
            return Response({'error': 'Only administrators can upload knowledge base documents.'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['vector_id'] = f"vec_{uuid.uuid4().hex[:12]}"
        
        # Calculate summary if not provided
        content_text = data.get('content_text', '')
        if not data.get('content_summary') and content_text:
            data['content_summary'] = (content_text[:200] + '...') if len(content_text) > 200 else content_text

        # Estimate chunk count
        words = len(content_text.split())
        data['total_chunks'] = max(1, words // 100)
        data['file_size_kb'] = max(1, len(content_text.encode('utf-8')) // 1024)

        serializer = KnowledgeDocumentSerializer(data=data)
        if serializer.is_valid():
            doc = serializer.save(uploaded_by=request.user)
            return Response(KnowledgeDocumentSerializer(doc).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class KnowledgeDocumentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        doc = get_object_or_404(KnowledgeDocument, pk=pk)
        return Response(KnowledgeDocumentSerializer(doc).data)

    def patch(self, request, pk):
        if not request.user.is_admin:
            return Response({'error': 'Only administrators can modify knowledge base documents.'}, status=status.HTTP_403_FORBIDDEN)
        doc = get_object_or_404(KnowledgeDocument, pk=pk)
        data = request.data.copy()
        
        # If content_text is updated, recalculate summary and chunk stats
        if 'content_text' in data:
            content_text = data['content_text']
            data['content_summary'] = (content_text[:200] + '...') if len(content_text) > 200 else content_text
            words = len(content_text.split())
            data['total_chunks'] = max(1, words // 100)
            data['file_size_kb'] = max(1, len(content_text.encode('utf-8')) // 1024)

        serializer = KnowledgeDocumentSerializer(doc, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_admin:
            return Response({'error': 'Only administrators can delete knowledge base documents.'}, status=status.HTTP_403_FORBIDDEN)
        doc = get_object_or_404(KnowledgeDocument, pk=pk)
        doc.delete()
        return Response({'message': 'Knowledge document deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

class KnowledgeSemanticSearchView(APIView):
    """
    RAG Semantic search endpoint for testing retrieval queries.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        query = request.data.get('query', '')
        if not query:
            return Response({'error': 'Query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        results = VectorStoreRetriever.search(query, top_k=5)
        return Response({
            'query': query,
            'match_count': len(results),
            'results': results
        })
