import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register/', data);
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login/', { email, password });
    return res.data;
  },

  async googleLogin(payload) {
    const res = await api.post('/auth/google-login/', payload);
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/auth/profile/');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.patch('/auth/profile/', data);
    return res.data;
  },

  async forgotPassword(email) {
    const res = await api.post('/auth/forgot-password/', { email });
    return res.data;
  },

  async resetPassword(data) {
    const res = await api.post('/auth/reset-password/', data);
    return res.data;
  },

  async getUsers() {
    const res = await api.get('/auth/users/');
    return res.data;
  },

  async updateUserRole(userId, role) {
    const res = await api.patch(`/auth/users/${userId}/`, { role });
    return res.data;
  },
};
