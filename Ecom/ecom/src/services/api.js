import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:5001/api' : '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  try {
    const rawTokens = localStorage.getItem('tokens');
    const tokens = (rawTokens && rawTokens !== 'undefined') ? JSON.parse(rawTokens) : null;
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
  } catch (err) {
    console.warn("API: Error parsing tokens from localStorage", err);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const rawTokens = localStorage.getItem('tokens');
        const tokens = (rawTokens && rawTokens !== 'undefined') ? JSON.parse(rawTokens) : null;
        
        if (tokens?.refresh) {
          const refreshUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://127.0.0.1:5001/api/auth/token/refresh/' 
            : '/api/auth/token/refresh/';
          const { data } = await axios.post(refreshUrl, {
            refresh: tokens.refresh,
          });
          localStorage.setItem(
            'tokens',
            JSON.stringify({ access: data.access, refresh: data.refresh || tokens.refresh })
          );
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        console.error("API: Refresh failed", refreshErr);
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
