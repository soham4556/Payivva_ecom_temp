import api from './api';

const orderService = {
  async createOrder(orderData) {
    const { data } = await api.post('/orders/create/', orderData);
    return data;
  },

  async getOrders() {
    const { data } = await api.get('/orders/');
    return data;
  },

  async getOrder(id) {
    const { data } = await api.get(`/orders/${id}/`);
    return data;
  },

  cancelOrder: (id) => api.post(`/orders/${id}/cancel/`),
  replaceOrder: (id) => api.post(`/orders/${id}/replace/`),
  getOrderTracking: (id) => api.get(`/orders/${id}/tracking/`).then((res) => res.data),

  // Vendor endpoints
  async getVendorOrders() {
    const { data } = await api.get('/orders/vendor/');
    return data;
  },

  async updateOrderStatus(id, status, note = '') {
    const { data } = await api.put(`/orders/vendor/${id}/status/`, { status, note });
    return data;
  },

  async getVendorStats() {
    const { data } = await api.get('/orders/vendor/stats/');
    return data;
  },

  // Admin endpoints
  async getAdminOrders() {
    const { data } = await api.get('/orders/admin/');
    return data;
  },

  async getAdminStats() {
    const { data } = await api.get('/orders/admin/stats/');
    return data;
  },
};

export default orderService;
