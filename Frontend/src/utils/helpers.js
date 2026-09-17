export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function getStatusColor(status) {
  const colors = {
    SCHEDULED: 'bg-blue-100 text-blue-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    WAITING: 'bg-yellow-100 text-yellow-700',
    CHECKED_IN: 'bg-blue-100 text-blue-700',
    CALLED: 'bg-purple-100 text-purple-700',
    IN_SERVICE: 'bg-indigo-100 text-indigo-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    SUCCESSFUL: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
    VERIFIED: 'bg-green-100 text-green-700',
    ACTION_REQUIRED: 'bg-red-100 text-red-700',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
    UPLOADED: 'bg-gray-100 text-gray-700',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    ANALYZED: 'bg-purple-100 text-purple-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getSentimentColor(sentiment) {
  const colors = { Positive: 'text-green-600', Negative: 'text-red-600', Neutral: 'text-yellow-600' };
  return colors[sentiment] || 'text-gray-600';
}
