export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    approved: 'bg-green-100 text-green-800',
    delivered: 'bg-green-100 text-green-800',
    confirmed: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    inactive: 'bg-gray-100 text-gray-800',
    placed: 'bg-yellow-100 text-yellow-800',
    packed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-blue-100 text-blue-800',
    out_for_delivery: 'bg-blue-100 text-blue-800',
    disabled: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return statusColors[status?.toLowerCase()] || 'bg-yellow-100 text-yellow-800';
};

export const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};