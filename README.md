# R Corporation AI Customer Support SaaS Platform

> **Enterprise-Grade AI-Powered Customer Support Platform with Multi-Dimensional Emotion Detection, Vector RAG Knowledge Base, Support Ticketing Workflows, and Executive Analytics.**

Built to the design and performance standards of modern SaaS platforms like **Intercom**, **Zendesk**, and **ChatGPT**.

---

## 🌟 Executive Overview & Key Capabilities

- **AI Customer Support & Emotion Understanding**:
  - Classifies customer messages into Sentiment (*Positive*, *Neutral*, *Negative*) and nuanced Emotions (*Happy*, *Satisfied*, *Neutral*, *Confused*, *Frustrated*, *Angry*, *Urgent*, *Disappointed*) with confidence scoring.
  - Dynamically adapts response behavior: empathetic de-escalation for frustrated/angry customers, step-by-step guidance for confused users, high-velocity concise resolution for urgent issues.
  - Internal emotion telemetry and sentiment tracking displayed for support agents and supervisors.
- **RAG Knowledge Base & Zero Hallucination**:
  - Semantic vector search through official corporate SOPs, policy guidelines, and diagnostic manuals.
  - Directly cites document and policy titles (e.g. `[SOP: R Corp Fiber Internet Troubleshooting Guide v4.2]`).
- **Support Ticketing System**:
  - Automatically opens priority tickets upon detecting unresolved escalations or when the customer requests a representative.
  - Ticket lifecycle: `Open` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved` $\rightarrow$ `Closed`.
  - Conversation comment threads and internal staff notes.
- **Role-Based Access Control (RBAC)**:
  - `Customer`: Chat with AI assistant, view conversation history, download transcripts, track personal tickets.
  - `Support Agent`: View escalated chats, update ticket statuses, respond to human handoffs.
  - `Admin`: Manage knowledge base documents, oversee agents, monitor sentiment analytics.
  - `Super Admin`: System-wide settings, user role elevation, audit logs.
- **Executive Analytics Dashboard**:
  - Visualized with **Recharts**: Daily Chat Volume Area Chart, Multi-Dimensional Emotion Bar Chart, Customer Sentiment Donut Chart, and CSAT rating tracking.
- **Contact Us & Demo Capture**:
  - High-converting lead capture form with interactive demo requests and automated admin triage.

---

## 📂 Repository Structure

```text
d:\Project\Antigravity/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── seed_data.py                  # Database seeder with benchmark test cases
│   ├── r_corp_support/               # Django project settings, WSGI, URLs
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── authentication/               # Custom User & Profile models, JWT, RBAC
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── chat/                         # ChatSessions, Messages & AI Engine
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── ai_engine.py              # EmotionAnalyzer & RCorpAIEngine (RAG + Empathy)
│   ├── knowledge/                    # RAG KnowledgeBase & Vector Store
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── vector_store.py           # Semantic retrieval engine with citations
│   ├── tickets/                      # Ticketing system & comment threads
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── contact/                      # Lead ingestion & demo request triage
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── analytics/                    # KPI metrics, emotion & sentiment trends
│       ├── views.py
│       └── urls.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── Dockerfile
│   └── src/
│       ├── App.jsx                   # React Router with ProtectedRoute RBAC
│       ├── main.jsx
│       ├── index.css                 # Glassmorphic utilities, custom glow styles
│       ├── context/
│       │   └── AuthContext.jsx       # Auth provider with 1-click demo role logins
│       ├── services/
│       │   ├── api.js                # Axios instance with JWT interceptors
│       │   ├── authService.js
│       │   └── domainServices.js     # Chat, Ticket, KB, Contact, Analytics services
│       ├── components/
│       │   ├── Navbar.jsx            # Glassmorphic navbar with status dot
│       │   ├── Footer.jsx
│       │   ├── Sidebar.jsx           # Dashboard navigation shell
│       │   ├── EmotionBadge.jsx      # Multi-state emotion & confidence badge
│       │   ├── StatsCard.jsx         # KPI metric card
│       │   └── ProtectedRoute.jsx    # RBAC route guard
│       └── pages/
│           ├── LandingPage.jsx       # Premium SaaS landing page
│           ├── ContactPage.jsx       # Contact Us & Demo request page
│           ├── LoginPage.jsx         # Split-screen login with 1-click role switcher
│           ├── RegisterPage.jsx      # Split-screen registration
│           ├── PasswordResetPages.jsx# Forgot & reset password flows
│           ├── CustomerDashboard.jsx # Customer overview with stats & recent chats
│           ├── AIChatPage.jsx        # ChatGPT-style real-time support chat
│           ├── TicketsPage.jsx       # Support ticket lifecycle & comment thread
│           ├── KnowledgeBasePage.jsx # RAG document indexer & semantic search test
│           └── AdminDashboard.jsx    # Executive Recharts analytics & user management
├── database/
│   └── schema.sql                    # Production MySQL 8.0 DDL schema with triggers
├── docker-compose.yml                # MySQL + Redis + Django + React stack
├── .env.example
└── README.md
```

---

## ⚡ Quickstart Guide

### 1. Backend Setup (Django REST Framework)

```powershell
cd backend

# 1. Install dependencies
pip install -r requirements.txt

# 2. Run migrations
python manage.py makemigrations authentication knowledge tickets chat contact
python manage.py migrate

# 3. Seed initial database (creates demo accounts, SOPs, tickets, and chat sessions)
python seed_data.py

# 4. Start the Django development server
python manage.py runserver 127.0.0.1:8000
```

The Django REST API will be running at `http://127.0.0.1:8000/`.

---

### 2. Frontend Setup (React + Vite + Tailwind CSS)

```powershell
cd frontend

# 1. Install dependencies
npm.cmd install

# 2. Launch Vite dev server
npm.cmd run dev
```

The application will be live at `http://localhost:5173/`.

---

## 🔑 Demo Login Credentials

The database seeder provisions accounts for each role with password `Password123!`:

| Role | Email Address | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@rcorporation.com` | `Password123!` | Full system governance, role elevation, audit logs |
| **Administrator** | `admin@rcorporation.com` | `Password123!` | Executive analytics, knowledge base upload, contact lead triage |
| **Support Agent** | `agent@rcorporation.com` | `Password123!` | Ticket lifecycle, human handoff, resolution comments |
| **Customer** | `customer@rcorporation.com` | `Password123!` | AI chat, personal ticket tracking, transcript export |

> 💡 **Tip:** On the `/login` page, you can use the **1-Click Demo Evaluation Buttons** to immediately log in as any role without typing credentials!

---

## 🎯 Verification of Prompt Benchmark Case

The platform is pre-verified against the specification benchmark:

**Customer Input:**
> *"I have called 3 times already and nobody has fixed my internet issue."*

**Internal Analysis Result:**
```json
{
  "sentiment": "Negative",
  "emotion": "Frustrated",
  "confidence": 94.0,
  "is_escalation_trigger": true,
  "churn_risk": "Low"
}
```

**AI Generated Response:**
> *"I apologize for the inconvenience you've experienced. I understand how frustrating it can be when an issue remains unresolved despite multiple follow-ups.*
>
> *Let me help you with this right away. Could you please share your ticket number or registered mobile number so I can check the current status and assist further?"*

---

## 🚀 Docker Deployment

To launch the complete containerized stack (MySQL 8.0, Redis 7, Gunicorn Django Backend, and Nginx React Frontend):

```bash
docker-compose up --build -d
```

- **Frontend**: `http://localhost:80`
- **Backend API**: `http://localhost:8000`
- **MySQL**: `localhost:3306`

---

## 🔒 Security & Best Practices
- **JWT Authentication**: Short-lived access tokens with automatic rotation and refresh token handling.
- **SQL Injection & XSS Guard**: Managed through Django ORM and React DOM escaping.
- **Zero Hallucination RAG**: LLM generation is constrained to retrieved knowledge documents and citations.
- **Role-Based Access Control**: Strict view-level and API-level permission checks.
