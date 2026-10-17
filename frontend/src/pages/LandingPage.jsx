import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot,
  Sparkles,
  HeartHandshake,
  Database,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Users,
  ChevronDown,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmotionBadge } from '../components/EmotionBadge';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const features = [
    {
      title: 'AI Customer Support',
      desc: '24/7 intelligent conversational support powered by advanced language models that resolve up to 80% of customer issues autonomously.',
      icon: Bot,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Multi-Dimensional Emotion Detection',
      desc: 'Real-time classification of customer sentiment and nuanced emotions (Happy, Frustrated, Confused, Angry, Urgent) to tailor tone and empathy.',
      icon: HeartHandshake,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'RAG Knowledge Base Search',
      desc: 'Vector embeddings search through your corporate SOPs, PDFs, and policy documents to deliver zero-hallucination, policy-cited answers.',
      icon: Database,
      color: 'from-cyan-500 to-teal-500',
    },
    {
      title: 'Executive Analytics Dashboard',
      desc: 'Live tracking of CSAT scores, daily chat volume, sentiment distribution, topic clusters, and automated SLA compliance metrics.',
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-500',
    },
    {
      title: 'Seamless Human Handoff',
      desc: 'Automatic routing of complex or highly sensitive interactions to human agents complete with context, sentiment telemetry, and pre-filled tickets.',
      icon: Users,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Real-Time Streaming Chat',
      desc: 'ChatGPT-quality interface featuring typing indicators, suggested quick prompts, voice transcription readiness, and transcript export.',
      icon: MessageSquare,
      color: 'from-rose-500 to-red-500',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Customer Submits Inquiry',
      desc: 'Customer sends a question or complaint via the responsive real-time web chat interface.',
      badge: 'Input Stream',
    },
    {
      step: '02',
      title: 'Emotion & Intent Analysis',
      desc: 'Our engine detects whether the user is Happy, Frustrated, Confused, or Urgent with 95%+ confidence.',
      badge: 'Sentiment AI',
    },
    {
      step: '03',
      title: 'Vector Knowledge Retrieval',
      desc: 'The RAG pipeline semantically searches enterprise policies, FAQs, and SOPs for verified truth.',
      badge: 'Vector DB',
    },
    {
      step: '04',
      title: 'Empathetic Adaptive Response',
      desc: 'The LLM synthesizes an empathetic, step-by-step resolution citing official R Corporation policies.',
      badge: 'Generation',
    },
    {
      step: '05',
      title: 'Escalation & Ticket Generation',
      desc: 'If customer remains unsatisfied or requests a manager, a priority support ticket is automatically opened.',
      badge: 'Resolution',
    },
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$49',
      period: '/mo',
      desc: 'Ideal for growing businesses needing 24/7 frontline AI triage.',
      features: [
        'Up to 2,500 AI conversations/mo',
        'Basic Sentiment & Emotion Detection',
        '10 Knowledge Base Documents',
        'Standard Ticketing Integration',
        'Email Support',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$199',
      period: '/mo',
      desc: 'Engineered for fast-scaling SaaS and customer-obsessed teams.',
      features: [
        'Up to 25,000 AI conversations/mo',
        'Full Emotion Detection + Churn Prediction',
        'Unlimited Knowledge Base Vectorization',
        'Automated Ticket Escalation & Routing',
        'Executive Analytics & CSAT Scoring',
        'Priority 24/7 SLA Support',
      ],
      cta: 'Get Started Pro',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'Dedicated infrastructure with custom on-premise vector stores.',
      features: [
        'Unlimited conversations & users',
        'Custom Fine-Tuned Domain LLMs',
        'Custom Vector DB (Pinecone/Milvus/Postgres)',
        'Dedicated Technical Account Manager',
        '99.99% Uptime Guarantee & SOC2 Compliance',
        'Full Custom SSO & RBAC Workflows',
      ],
      cta: 'Contact Enterprise Sales',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: 'How does the Emotion Detection Model improve customer experience?',
      a: 'Unlike generic chatbots, our emotion analyzer classifies the customer’s psychological state (Frustrated, Confused, Urgent, Happy) in real time. For angry users, it eliminates robotic formalities and prioritizes immediate human escalation; for confused users, it breaks technical details into clear, numbered steps.',
    },
    {
      q: 'How does R Corporation guarantee the AI does not hallucinate answers?',
      a: 'We strictly employ Retrieval-Augmented Generation (RAG). The LLM is constrained to the verified knowledge documents, SOPs, and policies uploaded to the vector database, citing the exact document name in each reply and politely escalating when information is not present.',
    },
    {
      q: 'Can human agents take over conversations in real time?',
      a: 'Yes. The system automatically creates a support ticket and marks the session as escalated whenever anger thresholds are crossed or a user requests human support. Agents can review the emotion telemetry and resume the conversation seamlessly.',
    },
    {
      q: 'Which database and tech stack does R Corporation AI support?',
      a: 'The platform is built on Django REST Framework with MySQL 8.0/SQLite, Redis caching, React.js with Tailwind CSS, and pluggable vector embeddings (FAISS, ChromaDB, or OpenAI embeddings).',
    },
  ];

  return (
    <main className="relative w-full overflow-x-hidden pt-20 sm:pt-24 pb-16 sm:pb-20">
      {/* Background Decorative Glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] sm:h-[650px] hero-glow pointer-events-none -z-10"
      />

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 sm:pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Release Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-6 sm:mb-8 backdrop-blur-md shadow-lg shadow-indigo-500/10 max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Next-Gen R Corporation Support Engine 2.0 Live</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.1] max-w-5xl mx-auto break-words">
            Intelligent{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered
            </span>{' '}
            Customer Support Platform
          </h1>

          {/* Subheading */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-2">
            Deliver exceptional customer experiences with AI-powered conversations, multi-dimensional emotion understanding, RAG vector retrieval, and automated ticket escalation.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Button
              size="lg"
              variant="primary"
              icon={Bot}
              onClick={() => navigate('/chat')}
              className="w-full sm:w-auto shadow-xl shadow-indigo-600/30"
              aria-label="Launch Live AI Chat"
            >
              Launch Live AI Chat
              <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto"
              aria-label="Request Enterprise Demo"
            >
              Request Enterprise Demo
            </Button>
          </div>
        </motion.div>

        {/* Simulated Interactive Chat Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-16 max-w-4xl w-full mx-auto glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-indigo-950/40 text-left border border-indigo-500/20 relative overflow-hidden"
        >
          {/* Preview Window Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-slate-400 truncate">
                rcorp-ai-stream://session-preview
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <EmotionBadge emotion="Frustrated" sentiment="Negative" confidence={94} size="sm" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 font-sans text-xs sm:text-sm">
            {/* Customer Message */}
            <div className="flex items-start gap-2.5 sm:gap-3 justify-end">
              <div className="bg-slate-800/95 text-slate-100 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl rounded-tr-none max-w-[90%] sm:max-w-lg border border-slate-700/60 shadow break-words">
                <p className="font-medium text-slate-400 text-[10px] sm:text-xs mb-1">Customer Inquiry</p>
                <p className="leading-relaxed">I have called 3 times already and nobody has fixed my internet issue.</p>
              </div>
            </div>

            {/* AI Assistant Message with Policy Citation */}
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-indigo-950/40 text-slate-200 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tl-none max-w-[90%] sm:max-w-2xl border border-indigo-500/30 shadow-lg space-y-2.5 break-words">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-indigo-300 text-xs flex items-center gap-1.5 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    R Corporation AI Assistant
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 break-words">
                    SOP Cited: Fiber Troubleshooting Guide v4.2
                  </span>
                </div>
                <p className="leading-relaxed text-slate-200">
                  I apologize for the inconvenience you&apos;ve experienced. I understand how frustrating it can be when an issue remains unresolved despite multiple follow-ups.
                </p>
                <p className="leading-relaxed text-slate-300">
                  Let me help you with this right away. Could you please share your ticket number or registered mobile number so I can check the current status and assist further?
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ----------------- FEATURES SECTION ----------------- */}
      <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 sm:mb-3">
            Enterprise Architecture
          </h2>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Precision, Empathy, and Scale
          </p>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base leading-relaxed px-2">
            Every layer of the platform is designed to resolve issues rapidly while maintaining strict adherence to enterprise governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Card
                  hoverEffect
                  glass
                  className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl group relative overflow-hidden h-full flex flex-col justify-between border-slate-800"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} p-[1px] mb-4 sm:mb-5 group-hover:scale-105 transition-transform shrink-0`}>
                      <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ----------------- OPERATIONAL PIPELINE (HOW IT WORKS) ----------------- */}
      <section
        id="how-it-works"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-slate-800/60"
      >
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 sm:mb-3">
            Operational Pipeline
          </h2>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            How The R Corporation Engine Works
          </p>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base leading-relaxed px-2">
            From raw input text to verified, empathetic resolution in under 300 milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 relative">
          {workflowSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className={idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}
            >
              <Card
                hoverEffect
                glass
                className="p-4 sm:p-5 rounded-2xl h-full flex flex-col justify-between border-slate-800/80"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-2xl font-black text-indigo-400/90 font-mono">
                      {step.step}
                    </span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      {step.badge}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ----------------- PRICING SECTION ----------------- */}
      <section
        id="pricing"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-slate-800/60"
      >
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 sm:mb-3">
            Predictable SaaS Pricing
          </h2>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Transparent Plans for Every Stage
          </p>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base leading-relaxed px-2">
            No surprise overages. Scale as your support volume accelerates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="flex"
            >
              <div
                className={`w-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl relative flex flex-col justify-between transition-all duration-300 ${
                  tier.highlighted
                    ? 'glass-panel border-2 border-indigo-500/80 shadow-2xl shadow-indigo-600/20 bg-slate-900/80'
                    : 'glass-card border border-slate-800 bg-[#111827]/60'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">{tier.name}</h3>
                  <p className="text-xs text-slate-400 min-h-[36px]">{tier.desc}</p>
                  <div className="my-5 sm:my-6">
                    <span className="text-3xl sm:text-4xl font-black text-white">{tier.price}</span>
                    <span className="text-slate-400 text-sm font-medium ml-1">{tier.period}</span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
                    {tier.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    size="md"
                    onClick={() => navigate(tier.name === 'Enterprise' ? '/contact' : '/register')}
                    className="w-full"
                    aria-label={`${tier.cta} for ${tier.name}`}
                  >
                    {tier.cta}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ----------------- FAQ SECTION ----------------- */}
      <section
        id="faq"
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-slate-800/60"
      >
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 sm:mb-3">
            Questions &amp; Answers
          </h2>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 transition-colors hover:border-slate-700"
              >
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-white font-medium hover:text-indigo-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
                >
                  <span className="text-sm sm:text-base font-semibold pr-2">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-btn-${idx}`}
                    className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- CTA BANNER ----------------- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-14 text-center border border-indigo-500/30 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/40">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed px-2">
            Deploy R Corporation’s Emotion Intelligence &amp; RAG engine in less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto shadow-xl shadow-indigo-600/30"
              aria-label="Get Started Free"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto"
              aria-label="Request Custom Demo"
            >
              Request Custom Demo
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
