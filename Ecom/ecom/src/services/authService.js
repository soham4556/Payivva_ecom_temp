import api from './api';

const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login/', { email, password });
    return data;
  },

  async register(userData) {
    const { data } = await api.post('/auth/register/', userData);
    return data;
  },

  async getProfile() {
    const { data } = await api.get('/auth/profile/');
    return data;
  },

  async updateProfile(userData) {
    const { data } = await api.patch('/auth/profile/', userData);
    return data;
  },

  async refreshToken(refreshToken) {
    const { data } = await api.post('/auth/token/refresh/', { refresh: refreshToken });
    return data;
  },
};

export default authService;
