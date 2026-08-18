import api from './axios';

export const authService = {
  async register(data) {
    const response = await api.post('auth/register/', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('auth/login/', credentials);
    return response.data;
  },

  async getMe() {
    const response = await api.get('auth/me/');
    return response.data;
  },
};

export const mediaService = {
  async getAll(params = {}) {
    const response = await api.get('media/', { params });
    return response.data;
  },

  async getStats() {
    const response = await api.get('media/stats/');
    return response.data;
  },

  async create(mediaData) {
    const response = await api.post('media/', mediaData);
    return response.data;
  },

  async update(id, mediaData) {
    const response = await api.patch(`media/${id}/`, mediaData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`media/${id}/`);
    return response.data;
  },

  // Specific 5-Star Rating action endpoint
  async rate(id, rating) {
    const response = await api.patch(`media/${id}/rate/`, { rating });
    return response.data;
  },

  // Toggle status between Watched & Unwatched
  async toggleStatus(id) {
    const response = await api.patch(`media/${id}/toggle-status/`);
    return response.data;
  },

  // Seed initial sample data for quick preview
  async seed() {
    const response = await api.post('seed/');
    return response.data;
  }
};
