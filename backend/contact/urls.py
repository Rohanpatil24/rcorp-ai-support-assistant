from django.urls import path
from .views import ContactInquiryCreateView, ContactInquiryListView

urlpatterns = [
    path('', ContactInquiryCreateView.as_view(), name='contact-create'),
    path('list/', ContactInquiryListView.as_view(), name='contact-admin-list'),
    path('<int:pk>/', ContactInquiryListView.as_view(), name='contact-admin-detail'),
]
