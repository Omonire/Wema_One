import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/insights').then(res => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Failed to load</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Insights</h1>

      {/* Top Complaints */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Top Customer Issues</h3>
        {data.top_complaints?.length === 0 ? (
          <p className="text-sm text-gray-500">No complaints data</p>
        ) : data.top_complaints?.map((c, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-400 w-6">{i + 1}.</span>
              <span className="text-sm text-gray-900">{c.topic}</span>
            </div>
            <span className="text-sm font-medium text-red-600">{c.count} complaints</span>
          </div>
        ))}
      </div>

      {/* Branch Performance */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Branch Performance</h3>
        {data.branch_performance?.length === 0 ? (
          <p className="text-sm text-gray-500">No data</p>
        ) : (
          <div className="space-y-3">
            {data.branch_performance?.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-40 text-sm text-gray-600">{b.branch}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div className="bg-[#0C2D57] h-3 rounded-full" style={{width: `${Math.min(b.appointments * 10, 100)}%`}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">{b.appointments} appts</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      {data.insights?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">AI Insights</h3>
          <div className="space-y-4">
            {data.insights.map((insight, i) => (
              <div key={i} className={`p-4 rounded-lg border-l-4 ${insight.severity === 'HIGH' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${insight.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{insight.type}</span>
                  <span className="text-sm font-semibold text-gray-900">{insight.title}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{insight.description}</p>
                <p className="text-xs text-gray-500">Recommended: {insight.recommended_action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
