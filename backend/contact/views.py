from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ContactInquiry
from .serializers import ContactInquirySerializer

class ContactInquiryCreateView(APIView):
    """
    Public endpoint for contact inquiries & demo requests.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ContactInquirySerializer(data=request.data)
        if serializer.is_valid():
            inquiry = serializer.save()
            return Response({
                'message': 'Thank you! Your inquiry has been received. Our team will contact you shortly.',
                'inquiry_id': inquiry.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContactInquiryListView(APIView):
    """
    Admin endpoint to view and triage contact leads.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)
        inquiries = ContactInquiry.objects.all()
        status_filter = request.query_params.get('status')
        if status_filter:
            inquiries = inquiries.filter(status=status_filter)
        serializer = ContactInquirySerializer(inquiries, many=True)
        return Response(serializer.data)

    def patch(self, request, pk):
        if not request.user.is_admin:
            return Response({'error': 'Admin permissions required.'}, status=status.HTTP_403_FORBIDDEN)
        inquiry = get_object_or_404(ContactInquiry, pk=pk)
        new_status = request.data.get('status')
        if new_status in ['New', 'Contacted', 'Qualified', 'Closed']:
            inquiry.status = new_status
            inquiry.save()
            return Response(ContactInquirySerializer(inquiry).data)
        return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
