import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/Elements';

export default function BranchFeedbackPage() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = user?.branch_id ? `?branch_id=${user.branch_id}` : '';
    api.get(`/feedback/${params}`).then(res => setFeedbacks(res.data)).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Feedback</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {feedbacks.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-10">No feedback yet</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map(f => (
              <div key={f.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${f.type === 'COMPLAINT' ? 'bg-red-100 text-red-700' : f.type === 'QUESTION' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {f.type}
                    </span>
                    {f.analysis && (
                      <span className={`text-xs font-medium ${f.analysis.sentiment === 'Positive' ? 'text-green-600' : f.analysis.sentiment === 'Negative' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {f.analysis.sentiment}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{new Date(f.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{f.content}</p>
                {f.analysis && (
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Topic: {f.analysis.topic}</span>
                    <span>Category: {f.analysis.category}</span>
                    <span>Priority: {f.analysis.priority}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
