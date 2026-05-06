export const API_BASE_URL = '/api';

export const ORDER_STATUSES = [
  { key: 'placed', label: 'Order Placed', icon: '📦' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'packed', label: 'Packed', icon: '📋' },
  { key: 'shipped', label: 'Shipped', icon: '🚚' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🏍️' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

export const PRODUCT_STATUSES = [
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'pending', label: 'Pending' },
];

export const VENDOR_STATUSES = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'disabled', label: 'Disabled' },
];
