import api from './api';

const productService = {
  async getProducts(params = {}) {
    const { data } = await api.get('/products/', { params });
    return data;
  },

  async getProduct(slug) {
    const { data } = await api.get(`/products/detail/${slug}/`);
    return data;
  },

  async getCategories() {
    const { data } = await api.get('/categories');
    return data;
  },

  // Vendor endpoints
  async getVendorProducts() {
    const { data } = await api.get('/products/vendor/');
    return data;
  },

  async createProduct(formData) {
    const { data } = await api.post('/products/vendor/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async updateProduct(id, formData) {
    const { data } = await api.patch(`/products/vendor/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async deleteProduct(id) {
    await api.delete(`/products/vendor/${id}/`);
  },

  // Admin endpoints
  async getAdminProducts(params = {}) {
    const { data } = await api.get('/products/admin/list/', { params });
    return data;
  },

  async adminUpdateProduct(id, productData) {
    const { data } = await api.patch(`/products/admin/${id}/`, productData);
    return data;
  },

  async adminDeleteProduct(id) {
    await api.delete(`/products/admin/${id}/delete/`);
  },
};

export default productService;
