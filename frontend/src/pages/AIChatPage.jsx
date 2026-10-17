import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/domainServices';
import { EmotionBadge } from '../components/EmotionBadge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Loader, EmptyState } from '../components/ui/Feedback';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Download,
  AlertTriangle,
  Star,
  Plus,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  BookOpen,
  FileText,
  Clock,
  CheckCircle2,
  Paperclip,
  Mic,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';

export const AIChatPage = () => {
  const { user, isAgent, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSessionUuid = searchParams.get('session');

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showInternalAnalysis, setShowInternalAnalysis] = useState(true);
  const [csatScore, setCsatScore] = useState(null);
  const [showCsatModal, setShowCsatModal] = useState(false);
  const [escalationNotice, setEscalationNotice] = useState(null);
  const [isSessionDrawerOpen, setIsSessionDrawerOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load all sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await chatService.getSessions();
        setSessions(data);
        if (data.length > 0 && !currentSessionUuid) {
          setSearchParams({ session: data[0].session_uuid });
        } else if (data.length === 0 && !currentSessionUuid) {
          handleNewConversation();
        }
      } catch (err) {
        console.error('Failed to load chat sessions:', err);
      }
    };
    fetchSessions();
  }, []);

  // Load specific session messages when currentSessionUuid changes
  useEffect(() => {
    if (!currentSessionUuid) return;

    const loadSessionDetail = async () => {
      try {
        setLoading(true);
        const data = await chatService.getSessionDetail(currentSessionUuid);
        setActiveSession(data);
        setMessages(data.messages || []);
        if (data.satisfaction_score) {
          setCsatScore(data.satisfaction_score);
        }
      } catch (err) {
        console.error('Failed to load session messages:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSessionDetail();
  }, [currentSessionUuid]);

  const handleNewConversation = async () => {
    try {
      setLoading(true);
      const newSession = await chatService.createSession(`Inquiry #${Math.floor(Math.random() * 9000 + 1000)}`);
      setSessions((prev) => [newSession, ...prev]);
      setSearchParams({ session: newSession.session_uuid });
      setActiveSession(newSession);
      setMessages(newSession.messages || []);
      setEscalationNotice(null);
      setIsSessionDrawerOpen(false);
    } catch (err) {
      console.error('Failed to create new conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !activeSession || isTyping) return;

    setInputMessage('');
    const tempCustomerMsg = {
      id: `temp_${Date.now()}`,
      sender: 'customer',
      message: text,
      emotion: 'Neutral',
      sentiment: 'Neutral',
      confidence_score: 90,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempCustomerMsg]);
    setIsTyping(true);

    try {
      const data = await chatService.sendMessage(activeSession.session_uuid, text);

      // Replace temp with backend validated message and append AI response
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempCustomerMsg.id);
        return [...filtered, data.customer_message, data.ai_message];
      });

      if (data.session_status === 'escalated') {
        setActiveSession((prev) => ({ ...prev, status: 'escalated' }));
        if (data.created_ticket_number) {
          setEscalationNotice(`Ticket ${data.created_ticket_number} has been automatically opened for your issue.`);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai_assistant',
          message: "I encountered a connectivity issue. Please try resending or click 'Escalate to Human Agent' below.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEscalate = async () => {
    if (!activeSession) return;
    try {
      const res = await chatService.escalateSession(activeSession.session_uuid);
      setActiveSession((prev) => ({ ...prev, status: 'escalated' }));
      if (res.system_message) {
        setMessages((prev) => [...prev, res.system_message]);
      }
      if (res.ticket_number) {
        setEscalationNotice(`Ticket ${res.ticket_number} created and assigned to Tier 2 Support.`);
      }
    } catch (err) {
      console.error('Escalation failed:', err);
    }
  };

  const handleCsatRating = async (rating) => {
    if (!activeSession) return;
    try {
      await chatService.submitCSAT(activeSession.session_uuid, rating);
      setCsatScore(rating);
      setShowCsatModal(false);
    } catch (err) {
      console.error('CSAT submission failed:', err);
    }
  };

  const suggestedPrompts = [
    'I have called 3 times already and nobody has fixed my internet issue.',
    'What is your fiber downtime refund policy?',
    'How do I setup Two-Factor Authentication (2FA)?',
    'I need to speak to a human supervisor right now.',
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="h-[calc(100vh-3.5rem)] lg:h-screen flex overflow-hidden w-full relative bg-slate-50 dark:bg-[#0B0F19] transition-colors"
      aria-label="AI Support Chat Workspace"
    >
      {/* ----------------- MOBILE BACKDROP FOR SESSIONS DRAWER ----------------- */}
      <AnimatePresence>
        {isSessionDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSessionDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 dark:bg-black/75 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ----------------- LEFT SESSIONS DRAWER / SIDEBAR ----------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-[#070A11] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto shrink-0 h-full ${
          isSessionDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Support History Sidebar"
      >
        {/* Drawer Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Support History</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleNewConversation}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              aria-label="Create new support chat"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>New Chat</span>
            </button>
            {/* Close button on mobile/tablet */}
            <button
              onClick={() => setIsSessionDrawerOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              aria-label="Close history drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-1.5">
          {sessions.length === 0 ? (
            <div className="text-center py-10 px-4 text-xs text-slate-500">
              No previous conversations
            </div>
          ) : (
            sessions.map((sess) => {
              const isSelected = sess.session_uuid === currentSessionUuid;
              const statusColors = {
                active: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
                escalated: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20',
                resolved: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20',
                closed: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
              };

              return (
                <button
                  key={sess.id}
                  onClick={() => {
                    setSearchParams({ session: sess.session_uuid });
                    setIsSessionDrawerOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 border cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/40 text-slate-900 dark:text-white shadow-sm'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  aria-current={isSelected ? 'true' : 'false'}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span
                      className={`px-2 py-0.5 rounded-full uppercase font-semibold ${
                        statusColors[sess.status] || statusColors.active
                      }`}
                    >
                      {sess.status}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono">
                      {new Date(sess.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{sess.title}</h5>
                  {sess.last_message && (
                    <p className="text-[11px] text-slate-500 truncate">{sess.last_message.message}</p>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Drawer Bottom Controls */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] sm:text-xs">R Corp AI Online</span>
          </div>
          <button
            type="button"
            onClick={() => setShowInternalAnalysis(!showInternalAnalysis)}
            title="Toggle Emotion Intelligence Inspector"
            aria-label="Toggle Emotion Intelligence Inspector"
            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1 cursor-pointer"
          >
            {showInternalAnalysis ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-mono">Telemetry</span>
          </button>
        </div>
      </aside>

      {/* ----------------- MAIN CHAT CONVERSATION WINDOW ----------------- */}
      <main className="flex-1 flex flex-col justify-between h-full bg-slate-100/40 dark:bg-[#0B0F19] relative min-w-0 overflow-hidden transition-colors">
        {/* Chat Header Bar */}
        <header className="px-3 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-xl flex items-center justify-between z-10 shrink-0 gap-2 sm:gap-4 transition-colors">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile/Tablet drawer toggle button */}
            <button
              type="button"
              onClick={() => setIsSessionDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0 cursor-pointer"
              aria-label="Open support chat history"
              title="Chat History"
            >
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  <span className="sm:hidden">AI Support</span>
                  <span className="hidden sm:inline">R Corporation Support Assistant</span>
                </h1>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold border border-indigo-200 dark:border-indigo-500/25 shrink-0">
                  RAG Grounded
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Session: <span className="font-mono text-slate-700 dark:text-slate-300">{activeSession?.session_uuid ? `${activeSession.session_uuid.slice(0, 16)}...` : 'Connecting...'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Escalation Button */}
            {activeSession?.status !== 'escalated' ? (
              <button
                type="button"
                onClick={handleEscalate}
                aria-label="Escalate to Human Agent"
                title="Escalate to Human Agent"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Escalate</span>
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Escalated</span>
              </span>
            )}

            {/* Export History */}
            {activeSession && (
              <a
                href={chatService.getExportUrl(activeSession.session_uuid)}
                title="Download Chat Transcript"
                aria-label="Download Chat Transcript"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            {/* CSAT Trigger */}
            <button
              type="button"
              onClick={() => setShowCsatModal(true)}
              className="p-2 rounded-xl text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 border border-slate-200 dark:border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              title="Rate this resolution"
              aria-label="Rate this resolution"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </button>
          </div>
        </header>

        {/* Escalation Notification Banner */}
        {escalationNotice && (
          <div className="bg-amber-50 dark:bg-amber-500/15 border-b border-amber-200 dark:border-amber-500/30 px-3 sm:px-6 py-2.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200 shrink-0 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <span className="truncate">{escalationNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setEscalationNotice(null)}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline shrink-0 text-xs focus:outline-none cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 lg:p-6 space-y-4 max-w-full">
          {loading && messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Loader message="Loading conversation..." />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <EmptyState
                icon={MessageSquare}
                title="Start a conversation"
                description="Ask questions about internet connectivity, billing, 2FA, or refund policies."
              />
            </div>
          ) : (
            messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-3 px-2">
                    <div className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 max-w-full shadow-sm">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                      <span className="truncate">{msg.message}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 sm:gap-3.5 max-w-full ${
                    isCustomer ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* AI Avatar */}
                  {!isCustomer && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-xl md:max-w-2xl space-y-1.5 min-w-0 ${
                      isCustomer ? 'items-end' : 'items-start'
                    }`}
                  >
                    {/* Emotion Inspector for Customer Messages */}
                    {isCustomer && showInternalAnalysis && (msg.emotion || msg.sentiment) && (
                      <div className="flex justify-end">
                        <EmotionBadge
                          emotion={msg.emotion}
                          sentiment={msg.sentiment}
                          confidence={msg.confidence_score}
                          size="sm"
                        />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm dark:shadow-lg break-words overflow-hidden ${
                        isCustomer
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-800/80'
                      }`}
                    >
                      <p className="whitespace-pre-line break-words">{msg.message}</p>

                      {/* Policy Citations */}
                      {!isCustomer && msg.retrieved_doc_sources && msg.retrieved_doc_sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 max-w-full">
                          <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 shrink-0">
                            <BookOpen className="w-3 h-3" />
                            Sources:
                          </span>
                          {msg.retrieved_doc_sources.map((src, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 max-w-full truncate inline-block"
                              title={src}
                            >
                              {src}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className={`text-[10px] text-slate-400 dark:text-slate-500 px-1 ${isCustomer ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Customer Avatar */}
                  {isCustomer && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700 shadow mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-2 sm:gap-3.5 justify-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl rounded-tl-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 max-w-[85%] sm:max-w-xl shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">Formulating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Inquiries / Prompts */}
        {messages.length <= 3 && !isTyping && (
          <div className="border-t border-slate-200 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/30 overflow-x-auto py-2 px-3 sm:px-6 flex gap-2 no-scrollbar shrink-0 items-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">Try Asking:</span>
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-500/25 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shrink-0 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <footer className="p-2.5 sm:p-4 border-t border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-xl shrink-0 transition-colors">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 sm:gap-3 max-w-5xl mx-auto w-full"
          >
            <div className="flex-1 relative flex items-center min-w-0">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message in English..."
                disabled={isTyping}
                aria-label="Type your message"
                className="w-full pl-3.5 sm:pl-4 pr-16 sm:pr-20 py-2.5 sm:py-3 min-h-[44px] rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              />
              <div className="absolute right-2 sm:right-3 flex items-center gap-1">
                <button
                  type="button"
                  title="Attach diagnostic file"
                  aria-label="Attach file"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Voice input"
                  aria-label="Voice input"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="px-3.5 sm:px-5 py-2.5 sm:py-3 min-h-[44px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              aria-label="Send message"
            >
              <span className="hidden sm:inline">Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </footer>
      </main>

      {/* ----------------- CSAT MODAL ----------------- */}
      <Modal
        isOpen={showCsatModal}
        onClose={() => setShowCsatModal(false)}
        title="Rate Your Experience"
        subtitle="How satisfied are you with this AI support interaction?"
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col items-center text-center space-y-4 py-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-inner">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleCsatRating(star)}
                className={`p-2 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  (csatScore || 0) >= star ? 'text-amber-400 scale-110' : 'text-slate-600 hover:text-amber-300'
                }`}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star className="w-7 h-7 fill-current" />
              </button>
            ))}
          </div>

          {csatScore && (
            <p className="text-xs text-emerald-400 font-medium">
              Thank you! Rating saved: {csatScore} / 5 stars.
            </p>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCsatModal(false)}
            className="mt-2 w-full text-slate-400 hover:text-white"
          >
            Close
          </Button>
        </div>
      </Modal>
    </motion.section>
  );
};
