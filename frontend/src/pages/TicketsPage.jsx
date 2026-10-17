import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ticketService } from '../services/domainServices';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
  Send,
  X,
  ShieldCheck,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { Loader, EmptyState } from '../components/ui/Feedback';

export const TicketsPage = () => {
  const { user, isAgent, isAdmin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // New Ticket Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
  });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (search) params.search = search;
      const data = await ticketService.getTickets(params);
      setTickets(data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, search]);

  const handleSelectTicket = async (ticketNumber) => {
    try {
      const data = await ticketService.getTicketDetail(ticketNumber);
      setSelectedTicket(data);
    } catch (err) {
      console.error('Failed to load ticket details:', err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket || !isAgent) return;
    try {
      const updated = await ticketService.updateTicket(selectedTicket.ticket_number, {
        status: newStatus,
      });
      setSelectedTicket(updated);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket) return;

    setCommentLoading(true);
    try {
      await ticketService.addComment(selectedTicket.ticket_number, newComment, isInternalNote);
      setNewComment('');
      // Refresh detailed ticket
      const refreshed = await ticketService.getTicketDetail(selectedTicket.ticket_number);
      setSelectedTicket(refreshed);
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const created = await ticketService.createTicket(createFormData);
      setShowCreateModal(false);
      setCreateFormData({ title: '', description: '', priority: 'Medium' });
      fetchTickets();
      setSelectedTicket(created);
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const priorityStyles = {
    Urgent: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    Low: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  };

  const statusStyles = {
    Open: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
    'In Progress': 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    Closed: 'bg-slate-700/40 text-slate-400 border-slate-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6"
    >
      {/* Page Header */}
      <PageHeader
        title="Support Ticketing System"
        subtitle={
          isAgent
            ? 'Triage, assign, and resolve customer escalations under SLA matrix standards.'
            : 'Submit and track formal technical and billing escalations.'
        }
        badge="Help Desk & SLA"
        badgeIcon={Ticket}
        action={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto shadow-indigo-600/20"
          >
            Create New Ticket
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <section aria-label="Search and filter tickets" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xl shadow-sm dark:shadow-none">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 w-full min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets by title, number (e.g. RCORP-892104)..."
              aria-label="Search tickets"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="flex-1 sm:flex-initial px-3 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
              className="flex-1 sm:flex-initial px-3 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Grid: Ticket List + Selected Ticket Drawer */}
      <section aria-label="Support tickets list and details" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tickets List Column */}
        <div className={`w-full ${selectedTicket ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader message="Loading support tickets..." size="md" />
            </div>
          ) : tickets.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No tickets found"
              description={
                search || statusFilter || priorityFilter
                  ? 'No support tickets match the current search filters.'
                  : 'No tickets created yet. Submit a new support ticket to get started.'
              }
              actionLabel={!search && !statusFilter && !priorityFilter ? 'Create New Ticket' : undefined}
              onAction={!search && !statusFilter && !priorityFilter ? () => setShowCreateModal(true) : undefined}
            />
          ) : (
            tickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => handleSelectTicket(ticket.ticket_number)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/60 shadow-md dark:shadow-lg dark:shadow-indigo-950/30'
                      : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-900/80 shadow-sm dark:shadow-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{ticket.ticket_number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityStyles[ticket.priority] || priorityStyles.Medium}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${statusStyles[ticket.status] || statusStyles.Open}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate mb-1">{ticket.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{ticket.description}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 gap-2">
                    <span className="truncate">
                      From: <strong className="text-slate-700 dark:text-slate-300 font-medium">{ticket.created_by_name || 'Customer'}</strong>
                    </span>
                    <span className="shrink-0">{new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Ticket Drawer / Detail Panel */}
        {selectedTicket && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto lg:static lg:z-auto lg:p-0 lg:bg-transparent lg:overflow-visible lg:col-span-7"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTicket(null);
            }}
          >
            <div className="w-full max-w-2xl max-h-[90vh] lg:max-h-none overflow-y-auto lg:overflow-visible rounded-2xl sm:rounded-3xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-slate-900/95 lg:bg-white dark:lg:bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 space-y-5 lg:sticky lg:top-20 shadow-xl dark:shadow-2xl lg:shadow-none">
              {/* Drawer Top Navigation & Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="inline-flex lg:hidden items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium"
                      aria-label="Back to ticket list"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{selectedTicket.ticket_number}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight break-words">{selectedTicket.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors shrink-0"
                  aria-label="Close ticket details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Priority Controls */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                  {isAgent ? (
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      aria-label="Change ticket status"
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full font-semibold border ${statusStyles[selectedTicket.status] || statusStyles.Open}`}>
                      {selectedTicket.status}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Priority:</span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold border ${priorityStyles[selectedTicket.priority] || priorityStyles.Medium}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">Issue Description:</span>
                <p className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line break-words">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Comments Thread */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Conversation Updates ({selectedTicket.comments?.length || 0})
                </span>

                <div className="max-h-60 sm:max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {selectedTicket.comments?.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No notes added to this ticket yet.</p>
                  ) : (
                    selectedTicket.comments.map((c) => (
                      <div
                        key={c.id}
                        className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                          c.is_internal_note
                            ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/20 text-amber-800 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white truncate">
                            {c.author_name} {c.is_internal_note && '(Internal Note)'}
                          </span>
                          <span className="shrink-0">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="break-words">{c.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Input */}
                <form onSubmit={handleAddComment} className="pt-2 space-y-2.5">
                  <textarea
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Post an update or reply..."
                    aria-label="Add comment to ticket"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-colors"
                  />

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    {isAgent ? (
                      <label className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isInternalNote}
                          onChange={(e) => setIsInternalNote(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                        />
                        <span>Internal staff note</span>
                      </label>
                    ) : <div />}

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      loading={commentLoading}
                      disabled={commentLoading || !newComment.trim()}
                      icon={Send}
                      iconPosition="right"
                      className="w-full sm:w-auto"
                    >
                      Post Update
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Support Ticket"
        subtitle="Submit a technical or billing escalation to the customer support team."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">Ticket Title / Issue Summary *</label>
            <input
              type="text"
              required
              value={createFormData.title}
              onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
              placeholder="e.g. Critical ONT Terminal Fiber Dropouts"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">Priority Level *</label>
            <select
              value={createFormData.priority}
              onChange={(e) => setCreateFormData({ ...createFormData, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="Low">Low - General inquiry</option>
              <option value="Medium">Medium - Standard account/service question</option>
              <option value="High">High - Degraded performance</option>
              <option value="Urgent">Urgent - Full service outage / critical disruption</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={createFormData.description}
              onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
              placeholder="Describe the steps you took, error codes, and equipment indicator lights..."
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-colors"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setShowCreateModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={createLoading}
              className="w-full sm:w-auto"
            >
              Submit Support Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};
