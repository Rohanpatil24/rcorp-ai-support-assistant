import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'r_corp_support.settings')
django.setup()

from authentication.models import User, Profile
from knowledge.models import KnowledgeDocument
from tickets.models import Ticket, TicketComment
from chat.models import ChatSession, Message
from contact.models import ContactInquiry

def seed_database():
    print("[*] Starting R Corporation database seeding...")

    # 1. Create Default Users
    users_data = [
        {
            'email': 'superadmin@rcorporation.com',
            'fullname': 'Chief Systems Admin',
            'role': 'super_admin',
            'mobile': '+1-800-555-0199',
            'is_staff': True,
            'is_superuser': True,
            'company': 'R Corporation Global'
        },
        {
            'email': 'admin@rcorporation.com',
            'fullname': 'Sarah Jenkins (Ops Director)',
            'role': 'admin',
            'mobile': '+1-800-555-0144',
            'is_staff': True,
            'is_superuser': False,
            'company': 'R Corporation Operations'
        },
        {
            'email': 'agent@rcorporation.com',
            'fullname': 'Alex Rivera (Tier 2 Lead)',
            'role': 'support_agent',
            'mobile': '+1-800-555-0177',
            'is_staff': False,
            'is_superuser': False,
            'company': 'R Corporation Support'
        },
        {
            'email': 'customer@rcorporation.com',
            'fullname': 'David Miller',
            'role': 'customer',
            'mobile': '+1-555-234-8901',
            'is_staff': False,
            'is_superuser': False,
            'company': 'Miller Logistics LLC'
        }
    ]

    created_users = {}
    for u in users_data:
        user, created = User.objects.get_or_create(
            email=u['email'],
            defaults={
                'fullname': u['fullname'],
                'role': u['role'],
                'mobile': u['mobile'],
                'is_staff': u['is_staff'],
                'is_superuser': u['is_superuser'],
                'email_verified': True
            }
        )
        user.set_password('Password123!')
        user.save()
        if hasattr(user, 'profile'):
            user.profile.company_name = u['company']
            user.profile.save()
        created_users[u['role']] = user
        status_txt = "Created" if created else "Updated"
        print(f"  [+] User {status_txt}: {u['email']} [{u['role']}]")

    admin_user = created_users['admin']
    customer_user = created_users['customer']
    agent_user = created_users['support_agent']

    # 2. Seed Knowledge Base Documents & Policies
    kb_docs = [
        {
            'document_name': 'R Corp Fiber Internet Troubleshooting Guide v4.2',
            'document_type': 'SOP',
            'category': 'Network & Connectivity',
            'content_summary': 'Step-by-step diagnostic procedures for optical network terminals (ONT), router red alarm lights, and latency troubleshooting.',
            'content_text': """Step 1: Check Optical Terminal (ONT) Indicators.
Ensure the Power and PON lights on your R Corp Optical Network Terminal are solid green. If the LOS (Loss of Signal) light is blinking red, an optical cable dislocation or external neighborhood outage has occurred.
Step 2: 60-Second Power Cycle Routine.
Disconnect the power adapter from both the wall socket and your R Corp Gigabit Router for 60 continuous seconds before reconnecting.
Step 3: Direct Ethernet Validation.
Bypass internal Wi-Fi mesh extenders and connect directly using a CAT6 Ethernet cable to port LAN 1 to isolate localized wireless interference.
Step 4: Ticket Creation and Field Technician Dispatch.
If 3 consecutive power cycles fail to clear the red alarm or connection dropouts persist, escalate to Tier 2 support with your ticket number for a prioritized home technician dispatch within 4 business hours."""
        },
        {
            'document_name': 'R Corporation Billing, Invoicing & Refund Policy',
            'document_type': 'POLICY',
            'category': 'Billing & Finance',
            'content_summary': 'Official standards governing billing cycles, automated payment retries, dispute windows, and prorated service credits.',
            'content_text': """Section 1: Invoicing Cycle & Due Dates.
Invoices are generated on the 1st day of each calendar month with a net-15 payment window.
Section 2: Service Disruption Credit Policy.
Customers experiencing verified fiber or platform downtime exceeding 2 continuous hours are eligible for a 100% daily prorated credit applied automatically to their subsequent billing statement upon ticket resolution.
Section 3: Cancellation & Refund Standards.
Subscriptions may be cancelled anytime with 30 days notice. Prepaid annual enterprise contracts are eligible for prorated refunds minus standard transition administrative processing."""
        },
        {
            'document_name': 'Enterprise SLA & Multi-Tier Escalation Matrix',
            'document_type': 'POLICY',
            'category': 'SLA & Governance',
            'content_summary': 'Service level guarantees, response time thresholds, and mandatory escalation pathways.',
            'content_text': """Tier 1 Support: Automated AI Assistant and frontline triage. Immediate response time with continuous 24/7 coverage.
Tier 2 Support: Specialized Technical Operations. Maximum 15-minute response for Urgent/Critical outages, and 2-hour response for High-priority incidents.
Tier 3 Engineering: Principal Network & Core Infrastructure Engineers. Engaged immediately when multi-customer degradation or core switch anomalies occur.
Managerial Escalation: Whenever a customer expresses acute frustration, has made 3 or more previous inquiries without resolution, or formally requests supervisor intervention, the chat session is immediately routed to an on-duty Support Lead."""
        },
        {
            'document_name': 'Account Security, Single Sign-On (SSO) & 2FA Guidelines',
            'document_type': 'MANUAL',
            'category': 'Security & Compliance',
            'content_summary': 'Protocols for account recovery, multi-factor authentication setup, and password resets.',
            'content_text': """Two-Factor Authentication Setup:
1. Log into your R Corporation customer portal and navigate to Settings > Security.
2. Select 'Enable Two-Factor Authentication' and scan the QR code with Google Authenticator or Microsoft Authenticator.
3. Save your 16-character backup recovery keys in an encrypted vault.
Password Reset Procedures:
Self-service password resets can be requested via email link or verified mobile SMS token. For compromised accounts, identity re-verification by an authorized supervisor is strictly required before unlocking."""
        }
    ]

    for doc in kb_docs:
        k_doc, created = KnowledgeDocument.objects.get_or_create(
            document_name=doc['document_name'],
            defaults={
                'document_type': doc['document_type'],
                'category': doc['category'],
                'vector_id': f"vec_{uuid.uuid4().hex[:12]}",
                'content_summary': doc['content_summary'],
                'content_text': doc['content_text'],
                'total_chunks': 3,
                'file_size_kb': 24,
                'uploaded_by': admin_user,
                'is_active': True
            }
        )
        print(f"  [+] Knowledge Document: {k_doc.document_name}")

    # 3. Seed Benchmark Chat Session (From Prompt Specification)
    benchmark_session, _ = ChatSession.objects.get_or_create(
        session_uuid='sess_benchmark_rcorp_01',
        defaults={
            'user': customer_user,
            'title': 'Internet issue unresolved after 3 calls',
            'status': 'escalated'
        }
    )

    Message.objects.get_or_create(
        session=benchmark_session,
        sender='customer',
        message='I have called 3 times already and nobody has fixed my internet issue.',
        defaults={
            'sentiment': 'Negative',
            'emotion': 'Frustrated',
            'confidence_score': 94.00,
            'is_escalation_trigger': True
        }
    )

    Message.objects.get_or_create(
        session=benchmark_session,
        sender='ai_assistant',
        message="I apologize for the inconvenience you've experienced. I understand how frustrating it can be when an issue remains unresolved despite multiple follow-ups.\n\nLet me help you with this right away. Could you please share your ticket number or registered mobile number so I can check the current status and assist further?",
        defaults={
            'sentiment': 'Neutral',
            'emotion': 'Neutral',
            'confidence_score': 96.00,
            'retrieved_doc_sources': ['[SOP: R Corp Fiber Internet Troubleshooting Guide v4.2]'],
            'is_escalation_trigger': True
        }
    )

    # 4. Seed Support Tickets
    tickets_data = [
        {
            'ticket_number': 'RCORP-892104',
            'title': 'Critical Fiber Line Red Light - 3rd Follow-up',
            'description': 'Customer reported red LOS indicator on ONT terminal despite multiple router reboots. Escalated from AI Chat session.',
            'status': 'In Progress',
            'priority': 'Urgent',
            'created_by': customer_user,
            'assigned_to': agent_user,
            'source_session_id': benchmark_session.session_uuid
        },
        {
            'ticket_number': 'RCORP-552190',
            'title': 'Monthly Invoice Prorated Downtime Credit Inquiry',
            'description': 'Customer requesting service credit for 4-hour scheduled maintenance window on Fiber Tier 1.',
            'status': 'Open',
            'priority': 'Medium',
            'created_by': customer_user,
            'assigned_to': None,
            'source_session_id': None
        },
        {
            'ticket_number': 'RCORP-310488',
            'title': 'SSO Integration Configuration Assistance',
            'description': 'Assistance required setting up Google Workspace SAML SSO authentication for corporate domain.',
            'status': 'Resolved',
            'priority': 'Low',
            'created_by': customer_user,
            'assigned_to': agent_user,
            'source_session_id': None,
            'resolution_notes': 'SAML ACS URL and Entity ID configured successfully in tenant admin console.'
        }
    ]

    for t in tickets_data:
        ticket, created = Ticket.objects.get_or_create(
            ticket_number=t['ticket_number'],
            defaults=t
        )
        if created:
            TicketComment.objects.create(
                ticket=ticket,
                author=agent_user,
                comment="Ticket received and registered under SLA Tier 2 workflow.",
                is_internal_note=False
            )
        print(f"  [+] Ticket: {ticket.ticket_number} [{ticket.status}]")

    # 5. Seed Contact Us Inquiries
    inquiries = [
        {
            'name': 'Elena Rostova',
            'email': 'elena@vanguardtech.io',
            'phone': '+1-415-992-3841',
            'company': 'Vanguard Technologies',
            'subject': 'Enterprise AI Support Migration & Demo',
            'message': 'We are looking to migrate 400 support agents and 200,000 monthly tickets to R Corporation AI Platform.',
            'is_demo_request': True,
            'status': 'Qualified'
        },
        {
            'name': 'Marcus Vance',
            'email': 'marcus.v@apexglobal.com',
            'phone': '+1-212-884-9102',
            'company': 'Apex Global Logistics',
            'subject': 'Custom Vector Database Integration Request',
            'message': 'Can the RAG architecture integrate directly with our internal on-premise Pinecone and PostgreSQL instances?',
            'is_demo_request': True,
            'status': 'New'
        }
    ]

    for inq in inquiries:
        ci, _ = ContactInquiry.objects.get_or_create(
            email=inq['email'],
            defaults=inq
        )
        print(f"  [+] Contact Inquiry: {ci.name} ({ci.company})")

    print("\n[SUCCESS] Database seeding completed successfully!")

if __name__ == '__main__':
    seed_database()
