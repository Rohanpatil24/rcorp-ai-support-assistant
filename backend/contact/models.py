from django.db import models

class ContactInquiry(models.Model):
    STATUS_CHOICES = (
        ('New', 'New Lead'),
        ('Contacted', 'Contacted'),
        ('Qualified', 'Qualified Demo'),
        ('Closed', 'Closed'),
    )

    name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    company = models.CharField(max_length=150, blank=True, null=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_demo_request = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contact_inquiries'
        ordering = ['-created_at']

    def __str__(self):
        lead_type = "Demo Request" if self.is_demo_request else "Inquiry"
        return f"[{lead_type}] {self.name} - {self.company or self.email}"
