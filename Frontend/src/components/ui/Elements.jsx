export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-red-600 text-xl">!</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-500 text-sm mb-4">{message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <button onClick={onRetry} className="bg-[#0C2D57] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0A2445]">
          Try Again
        </button>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const colors = {
    SCHEDULED: 'bg-blue-100 text-blue-700', CONFIRMED: 'bg-green-100 text-green-700',
    WAITING: 'bg-yellow-100 text-yellow-700', CHECKED_IN: 'bg-blue-100 text-blue-700',
    CALLED: 'bg-purple-100 text-purple-700', IN_SERVICE: 'bg-indigo-100 text-indigo-700',
    COMPLETED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
    PENDING: 'bg-yellow-100 text-yellow-700', SUCCESSFUL: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700', VERIFIED: 'bg-green-100 text-green-700',
    ACTION_REQUIRED: 'bg-red-100 text-red-700', PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
    UPLOADED: 'bg-gray-100 text-gray-700', SUBMITTED: 'bg-blue-100 text-blue-700',
    ANALYZED: 'bg-purple-100 text-purple-700'
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}
