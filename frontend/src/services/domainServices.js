import api from './api';

export const chatService = {
  async getSessions(guestId = null) {
    const params = guestId ? { guest_id: guestId } : {};
    const res = await api.get('/chat/sessions/', { params });
    return res.data;
  },

  async createSession(title = 'New Customer Support Request', guestId = null) {
    const res = await api.post('/chat/sessions/', { title, guest_id: guestId });
    return res.data;
  },

  async getSessionDetail(sessionUuid) {
    const res = await api.get(`/chat/sessions/${sessionUuid}/`);
    return res.data;
  },

  async sendMessage(sessionUuid, message) {
    const res = await api.post(`/chat/sessions/${sessionUuid}/messages/`, { message });
    return res.data;
  },

  async escalateSession(sessionUuid) {
    const res = await api.post(`/chat/sessions/${sessionUuid}/escalate/`);
    return res.data;
  },

  async submitCSAT(sessionUuid, score) {
    const res = await api.post(`/chat/sessions/${sessionUuid}/csat/`, { score });
    return res.data;
  },

  getExportUrl(sessionUuid) {
    return `${api.defaults.baseURL}/chat/sessions/${sessionUuid}/export/`;
  },
};

export const ticketService = {
  async getTickets(params = {}) {
    const res = await api.get('/tickets/', { params });
    return res.data;
  },

  async createTicket(data) {
    const res = await api.post('/tickets/', data);
    return res.data;
  },

  async getTicketDetail(ticketNumber) {
    const res = await api.get(`/tickets/${ticketNumber}/`);
    return res.data;
  },

  async updateTicket(ticketNumber, data) {
    const res = await api.patch(`/tickets/${ticketNumber}/`, data);
    return res.data;
  },

  async addComment(ticketNumber, comment, isInternal = false) {
    const res = await api.post(`/tickets/${ticketNumber}/comments/`, {
      comment,
      is_internal_note: isInternal,
    });
    return res.data;
  },
};

export const kbService = {
  async getDocuments(params = {}) {
    const res = await api.get('/knowledge/documents/', { params });
    return res.data;
  },

  async uploadDocument(data) {
    const res = await api.post('/knowledge/documents/', data);
    return res.data;
  },

  async updateDocument(id, data) {
    const res = await api.patch(`/knowledge/documents/${id}/`, data);
    return res.data;
  },

  async deleteDocument(id) {
    const res = await api.delete(`/knowledge/documents/${id}/`);
    return res.data;
  },

  async semanticSearch(query) {
    const res = await api.post('/knowledge/search/', { query });
    return res.data;
  },
};

export const contactService = {
  async submitInquiry(data) {
    const res = await api.post('/contact/', data);
    return res.data;
  },

  async getInquiries(params = {}) {
    const res = await api.get('/contact/list/', { params });
    return res.data;
  },

  async updateInquiryStatus(id, status) {
    const res = await api.patch(`/contact/${id}/`, { status });
    return res.data;
  },
};

export const analyticsService = {
  async getDashboardAnalytics() {
    const res = await api.get('/analytics/dashboard/');
    return res.data;
  },
};
