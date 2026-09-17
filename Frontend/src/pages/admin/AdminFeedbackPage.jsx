import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/Elements';

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const params = filter ? `?sentiment=${filter}` : '';
    Promise.all([
      api.get(`/feedback/${params}`),
      api.get('/feedback/analysis')
    ]).then(([f, a]) => {
      setFeedbacks(f.data);
      setAnalysis(a.data);
    }).finally(() => setLoading(false));
  }, [filter]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feedback Intelligence</h1>

      {/* Analysis Summary */}
      {analysis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{analysis.total_feedback}</div>
            <div className="text-xs text-gray-500">Total Feedback</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{analysis.sentiment_breakdown?.Positive || 0}</div>
            <div className="text-xs text-gray-500">Positive</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{analysis.sentiment_breakdown?.Negative || 0}</div>
            <div className="text-xs text-gray-500">Negative</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{analysis.sentiment_breakdown?.Neutral || 0}</div>
            <div className="text-xs text-gray-500">Neutral</div>
          </div>
        </div>
      )}

      {/* Top Topics */}
      {analysis && analysis.top_topics?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Top Topics</h3>
          {analysis.top_topics.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-900">{t.topic}</span>
              <span className="text-sm font-medium text-gray-600">{t.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        {['', 'Positive', 'Neutral', 'Negative'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === f ? 'bg-[#0C2D57] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f || 'All'}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {feedbacks.map(f => (
          <div key={f.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={f.type} />
                {f.analysis && (
                  <span className={`text-xs font-medium ${f.analysis.sentiment === 'Positive' ? 'text-green-600' : f.analysis.sentiment === 'Negative' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {f.analysis.sentiment}
                  </span>
                )}
                {f.analysis?.priority && <StatusBadge status={f.analysis.priority} />}
              </div>
              <span className="text-xs text-gray-500">{new Date(f.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-gray-700 mb-1">{f.content}</p>
            {f.analysis && (
              <div className="text-xs text-gray-500">Topic: {f.analysis.topic} • Category: {f.analysis.category}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
