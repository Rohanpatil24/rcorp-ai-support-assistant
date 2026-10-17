import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { analyticsService, contactService } from '../services/domainServices';
import { authService } from '../services/authService';
import { StatsCard } from '../components/StatsCard';
import { Loader, EmptyState } from '../components/ui/Feedback';
import {
  Users,
  MessageSquare,
  Ticket,
  Star,
  Inbox,
  TrendingUp,
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Edit2,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const AdminDashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [contactLeads, setContactLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [analyticsData, usersData, leadsData] = await Promise.all([
        analyticsService.getDashboardAnalytics(),
        authService.getUsers(),
        contactService.getInquiries(),
      ]);
      setAnalytics(analyticsData);
      setUsersList(usersData);
      setContactLeads(leadsData);
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await authService.updateUserRole(userId, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Failed to change user role:", err);
    }
  };

  const handleLeadStatusChange = async (leadId, newStatus) => {
    try {
      await contactService.updateInquiryStatus(leadId, newStatus);
      setContactLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
      );
    } catch (err) {
      console.error("Failed to update lead status:", err);
    }
  };

  const kpis = analytics?.kpis || {
    total_users: 142,
    active_users: 89,
    total_chats: 1240,
    active_chats: 14,
    escalated_chats: 8,
    total_tickets: 64,
    open_tickets: 7,
    resolution_rate: 94.2,
    csat_score: 4.9,
    contact_requests: 18,
    demo_requests: 6,
  };

  const emotionData = analytics?.emotion_breakdown || [
    { name: 'Happy', count: 48 },
    { name: 'Satisfied', count: 32 },
    { name: 'Neutral', count: 65 },
    { name: 'Confused', count: 24 },
    { name: 'Frustrated', count: 18 },
    { name: 'Angry', count: 9 },
    { name: 'Urgent', count: 12 },
  ];

  const sentimentData = analytics?.sentiment_breakdown || [
    { name: 'Positive', value: 80, color: '#22C55E' },
    { name: 'Neutral', value: 65, color: '#06B6D4' },
    { name: 'Negative', value: 39, color: '#EF4444' },
  ];

  const dailyTrend = analytics?.daily_trend || [
    { day: 'Mon', chats: 42, tickets: 4 },
    { day: 'Tue', chats: 58, tickets: 7 },
    { day: 'Wed', chats: 62, tickets: 5 },
    { day: 'Thu', chats: 74, tickets: 9 },
    { day: 'Fri', chats: 68, tickets: 6 },
    { day: 'Sat', chats: 35, tickets: 3 },
    { day: 'Sun', chats: 29, tickets: 2 },
  ];

  if (loading && !analytics && usersList.length === 0 && contactLeads.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader message="Loading executive control center data..." size="lg" />
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8"
    >
      {/* Header & Tab Switcher */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Executive Operations Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin & Analytics Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Real-time telemetry on customer emotion dynamics, SLA ticket resolution, and lead management.
          </p>
        </div>

        {/* Tab switcher */}
        <nav
          aria-label="Dashboard sections"
          className="flex flex-wrap sm:flex-nowrap overflow-x-auto gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-full sm:w-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap text-xs font-semibold text-center ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Analytics & KPIs
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap text-xs font-semibold text-center ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Users & Roles ({usersList.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'leads'}
            onClick={() => setActiveTab('leads')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap text-xs font-semibold text-center ${
              activeTab === 'leads'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Contact Leads ({contactLeads.length})
          </button>
        </nav>
      </header>

      {/* KPI Cards Row */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <StatsCard
            title="Total Users"
            value={kpis.total_users.toString()}
            change={`${kpis.active_users} active`}
            isPositive={true}
            icon={Users}
            subtitle="Registered workspace accounts"
          />
        </motion.div>
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <StatsCard
            title="Active AI Chats"
            value={kpis.active_chats.toString()}
            change={`${kpis.escalated_chats} escalated`}
            isPositive={kpis.escalated_chats === 0}
            icon={MessageSquare}
            subtitle="Real-time support sessions"
          />
        </motion.div>
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <StatsCard
            title="Resolution Rate"
            value={`${kpis.resolution_rate}%`}
            change="SLA Standard 90%"
            isPositive={kpis.resolution_rate >= 90}
            icon={CheckCircle2}
            subtitle="Closed within guaranteed SLA"
          />
        </motion.div>
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <StatsCard
            title="Average CSAT"
            value={`${kpis.csat_score} / 5`}
            change="98.2% Positive"
            isPositive={true}
            icon={Star}
            subtitle="Calculated over last 30 days"
          />
        </motion.div>
      </section>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && (
        <motion.div
          key="tab-analytics"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Daily Volume Trend (Area Chart) */}
            <article className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Daily AI Chat Volume & Ticket Influx
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                  Past 7 Days
                </span>
              </div>

              <div className="h-64 sm:h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chatColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="ticketColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                        color: '#FFFFFF',
                      }}
                      itemStyle={{ color: '#E2E8F0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
                    <Area
                      type="monotone"
                      dataKey="chats"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#chatColor)"
                      name="AI Chats"
                    />
                    <Area
                      type="monotone"
                      dataKey="tickets"
                      stroke="#7C3AED"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#ticketColor)"
                      name="Tickets Escalated"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* Sentiment Breakdown (Donut Chart) */}
            <article className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Customer Sentiment</h2>
                </div>
              </div>

              <div className="h-52 sm:h-60 w-full min-w-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={72}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                        color: '#FFFFFF',
                      }}
                      itemStyle={{ color: '#E2E8F0', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-around gap-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                {sentimentData.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span>{s.name} ({s.value})</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Emotion Distribution (Bar Chart) */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400 shrink-0" />
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Multi-Dimensional Emotion Classification
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-mono bg-slate-800/60 px-2 py-0.5 rounded-md">
                Real-time Model Telemetry
              </span>
            </div>

            <div className="h-60 sm:h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                      color: '#FFFFFF',
                    }}
                    itemStyle={{ color: '#E2E8F0', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Inquiries Detected" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </motion.div>
      )}

      {/* TAB 2: USER MANAGEMENT & RBAC */}
      {activeTab === 'users' && (
        <motion.section
          key="tab-users"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          aria-label="Workspace User Accounts & Role Permissions"
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6 space-y-4 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Workspace User Accounts & Role Permissions
              </h2>
              <p className="text-xs text-slate-400">Configure role-based access control and workspace capabilities</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 w-fit">
              Total: {usersList.length}
            </span>
          </div>

          {usersList.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description="There are currently no registered workspace accounts."
            />
          ) : (
            <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300 min-w-[640px]">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase text-[10px] sm:text-[11px] font-semibold tracking-wider sticky top-0 backdrop-blur z-10">
                  <tr>
                    <th scope="col" className="py-3.5 px-4">User</th>
                    <th scope="col" className="py-3.5 px-4">Email</th>
                    <th scope="col" className="py-3.5 px-4">Current Role</th>
                    <th scope="col" className="py-3.5 px-4">Status</th>
                    <th scope="col" className="py-3.5 px-4">Joined Date</th>
                    <th scope="col" className="py-3.5 px-4 text-right">Role Elevation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-indigo-600/[0.04] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {u.fullname?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="truncate max-w-[140px] sm:max-w-none">{u.fullname}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-xs truncate max-w-[180px] sm:max-w-none">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 uppercase tracking-wide">
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-emerald-400 flex items-center gap-1.5 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          aria-label={`Change role for ${u.fullname}`}
                          className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                        >
                          <option value="customer">Customer</option>
                          <option value="support_agent">Support Agent</option>
                          <option value="admin">Admin</option>
                          {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      )}

      {/* TAB 3: CONTACT LEADS & DEMO TRIAGE */}
      {activeTab === 'leads' && (
        <motion.section
          key="tab-leads"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          aria-label="Inbound Enterprise Leads & Demo Requests"
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6 space-y-4 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Inbound Enterprise Leads & Demo Requests
              </h2>
              <p className="text-xs text-slate-400">Captured via the Contact Us and Demo Request modules</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 w-fit">
              Total: {contactLeads.length}
            </span>
          </div>

          {contactLeads.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No contact leads yet"
              description="Incoming enterprise inquiries and demo requests will appear here."
            />
          ) : (
            <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300 min-w-[700px]">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase text-[10px] sm:text-[11px] font-semibold tracking-wider sticky top-0 backdrop-blur z-10">
                  <tr>
                    <th scope="col" className="py-3.5 px-4">Contact</th>
                    <th scope="col" className="py-3.5 px-4">Company</th>
                    <th scope="col" className="py-3.5 px-4">Subject</th>
                    <th scope="col" className="py-3.5 px-4">Type</th>
                    <th scope="col" className="py-3.5 px-4">Lead Status</th>
                    <th scope="col" className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {contactLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-indigo-600/[0.04] transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-white truncate max-w-[150px] sm:max-w-none">{lead.name}</p>
                        <p className="text-slate-400 font-mono text-[11px] truncate max-w-[180px] sm:max-w-none">{lead.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">{lead.company || 'N/A'}</td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate" title={lead.message || lead.subject}>
                        {lead.subject}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {lead.is_demo_request ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            Demo Request
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            General
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          lead.status === 'Qualified'
                            ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                            : lead.status === 'Contacted'
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                            : lead.status === 'Closed'
                            ? 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                          aria-label={`Update status for lead ${lead.name}`}
                          className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      )}
    </motion.main>
  );
};
