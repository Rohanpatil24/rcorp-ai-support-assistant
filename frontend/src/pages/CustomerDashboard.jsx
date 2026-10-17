import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { chatService, ticketService } from '../services/domainServices';
import { StatsCard } from '../components/StatsCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader, EmptyState } from '../components/ui/Feedback';
import {
  MessageSquare,
  Ticket as TicketIcon,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bot,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessData, ticketData] = await Promise.all([
          chatService.getSessions(),
          ticketService.getTickets(),
        ]);
        setSessions(sessData);
        setTickets(ticketData);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openTicketsCount = tickets.filter((t) => ['Open', 'In Progress'].includes(t.status)).length;
  const resolvedTicketsCount = tickets.filter((t) => ['Resolved', 'Closed'].includes(t.status)).length;

  const handleStartNewChat = async () => {
    try {
      const newSession = await chatService.createSession(`Support Inquiry - ${new Date().toLocaleDateString()}`);
      navigate(`/chat?session=${newSession.session_uuid}`);
    } catch (err) {
      console.error(err);
      navigate('/chat');
    }
  };

  const sessionStatusStyles = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    escalated: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    resolved: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    closed: 'bg-slate-700/30 text-slate-400 border-slate-700',
  };

  const ticketPriorityStyles = {
    Urgent: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
    High: 'text-orange-400 bg-orange-500/10 border-orange-500/25',
    Medium: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
    Low: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
  };

  const ticketStatusStyles = {
    Open: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    'In Progress': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Closed: 'bg-slate-700/30 text-slate-400 border-slate-700/60',
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8"
      role="main"
      aria-label="Customer Support Dashboard"
    >
      {/* Welcome Banner Card */}
      <section aria-label="Welcome Overview">
        <div className="glass-panel p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl border border-indigo-200 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50 via-purple-50/50 to-white dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900/50 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 shadow-sm dark:shadow-xl backdrop-blur-xl">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />
              <span className="truncate">R Corporation Priority Customer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome, {user?.fullname || 'Customer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {user?.profile?.company_name ? (
                <span className="font-semibold text-indigo-600 dark:text-indigo-300">
                  Organization: {user.profile.company_name} •{' '}
                </span>
              ) : null}
              Your AI assistant is connected, monitoring sentiment telemetry, and ready to resolve queries with verified knowledge base citations.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={Bot}
            onClick={handleStartNewChat}
            className="w-full sm:w-auto shrink-0 justify-center group"
            aria-label="Start New AI Support Session"
          >
            <span>Start New AI Support Session</span>
            <ArrowRight className="w-4 h-4 ml-1.5 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* KPI Cards Row */}
      <section aria-label="Customer Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatsCard
          title="Total Conversations"
          value={sessions.length.toString()}
          change="+2 this week"
          isPositive={true}
          icon={MessageSquare}
          subtitle="All active and archived sessions"
        />
        <StatsCard
          title="Satisfaction Score"
          value="4.9 / 5"
          change="98% Positive"
          isPositive={true}
          icon={Star}
          subtitle="Based on recent CSAT ratings"
        />
        <StatsCard
          title="Open Tickets"
          value={openTicketsCount.toString()}
          change={openTicketsCount > 0 ? "Under Review" : "All Clear"}
          isPositive={openTicketsCount === 0}
          icon={Clock}
          subtitle="Awaiting resolution or triage"
        />
        <StatsCard
          title="Resolved Tickets"
          value={resolvedTicketsCount.toString()}
          change="SLA 100%"
          isPositive={true}
          icon={CheckCircle2}
          subtitle="Successfully closed tickets"
        />
      </section>

      {/* Grid: Recent Support Conversations & Active Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Conversations */}
        <section aria-label="Recent Support Conversations" className="lg:col-span-7">
          <Card padding="none" className="p-5 sm:p-6 lg:p-7 space-y-5">
            <header className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Recent Support Conversations
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Jump back into your recent interactions with R Corp AI
                </p>
              </div>
              <Link
                to="/chat"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 shrink-0 focus:outline-none focus:underline"
                aria-label="Open full chat interface"
              >
                <span>Open Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </header>

            {loading ? (
              <Loader message="Loading conversation history..." size="md" />
            ) : sessions.length === 0 ? (
              <EmptyState
                icon={Bot}
                title="No active conversations found"
                description="Start an interactive session with our AI assistant to get instant answers."
                actionLabel="Initiate First Support Chat"
                onAction={handleStartNewChat}
              />
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 5).map((sess) => (
                  <article
                    key={sess.id || sess.session_uuid}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 w-full sm:w-auto sm:flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                            sessionStatusStyles[sess.status] || sessionStatusStyles.active
                          }`}
                        >
                          {sess.status || 'Active'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(sess.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                        {sess.title || 'Support Session'}
                      </h3>
                      {sess.last_message && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-1">
                          <span className="text-slate-400 dark:text-slate-500 font-medium">
                            {sess.last_message.sender === 'customer' ? 'You: ' : 'AI: '}
                          </span>
                          {sess.last_message.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t border-slate-200 dark:border-slate-800/60 sm:border-t-0">
                      <a
                        href={chatService.getExportUrl(sess.session_uuid)}
                        title="Download Chat Transcript"
                        aria-label={`Download transcript for ${sess.title || 'conversation'}`}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <Link
                        to={`/chat?session=${sess.session_uuid}`}
                        aria-label={`Resume conversation ${sess.title || ''}`}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-600/30 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                      >
                        Resume
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* Right Column: Support Tickets */}
        <section aria-label="Support Tickets" className="lg:col-span-5">
          <Card padding="none" className="p-5 sm:p-6 lg:p-7 space-y-5">
            <header className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Support Tickets
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Status of your formal escalations
                </p>
              </div>
              <Link
                to="/tickets"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 shrink-0 focus:outline-none focus:underline"
                aria-label="View all support tickets"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </header>

            {loading ? (
              <Loader message="Loading tickets..." size="md" />
            ) : tickets.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="All systems nominal"
                description="No open support tickets. Everything is running smoothly!"
              />
            ) : (
              <div className="space-y-3">
                {tickets.slice(0, 4).map((ticket) => (
                  <article
                    key={ticket.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300 truncate">
                        {ticket.ticket_number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                          ticketPriorityStyles[ticket.priority] || 'text-slate-500 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                      {ticket.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/40">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="shrink-0 text-slate-500 dark:text-slate-400">Status:</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border truncate ${
                            ticketStatusStyles[ticket.status] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <span className="font-mono text-slate-500 shrink-0">
                        {new Date(ticket.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </motion.main>
  );
};
