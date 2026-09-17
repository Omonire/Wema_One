import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <div className="text-sm text-gray-500 mb-1">{label}</div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/dashboard'),
      api.get('/analytics/insights')
    ]).then(([d, i]) => {
      setDashboard(d.data);
      setInsights(i.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!dashboard) return <div className="text-center py-20 text-gray-500">Failed to load dashboard</div>;

  const { customer_metrics: cm, document_metrics: dm, payment_metrics: pm, feedback_metrics: fm, branch_intelligence: bi } = dashboard;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">WemaOne Intelligence Dashboard</h1>
        <p className="text-gray-500 text-sm">Platform-wide analytics and operational insights</p>
      </div>

      {/* Customer Metrics */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Customers" value={cm.total_customers} />
        <StatCard label="Appointments" value={cm.total_appointments} sub={`${cm.active_appointments} active`} />
        <StatCard label="Queue Tickets" value={cm.total_queue_tickets} sub={`${cm.active_queue} in queue`} />
        <StatCard label="Branches" value={cm.total_branches} />
      </div>

      {/* Document & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Document Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Documents" value={dm.total_documents} />
            <StatCard label="Verified" value={dm.verified} sub={`${dm.verification_rate}% success rate`} />
            <StatCard label="Action Required" value={dm.action_required} />
            <StatCard label="Verification Rate" value={`${dm.verification_rate}%`} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Payments" value={pm.total_payments} />
            <StatCard label="Successful" value={pm.successful} />
            <StatCard label="Total Revenue" value={`₦${pm.total_revenue.toLocaleString()}`} />
          </div>
        </div>
      </div>

      {/* Feedback Intelligence */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Customer Intelligence (SocialPulse)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard label="Total Feedback" value={fm.total_feedback} />
          <StatCard label="Positive" value={fm.positive} sub="Sentiment" />
          <StatCard label="Negative" value={fm.negative} sub="Sentiment" />
          <StatCard label="Avg Rating" value={fm.avg_rating ? `${fm.avg_rating}/5` : 'N/A'} />
        </div>
        {fm.category_breakdown && Object.keys(fm.category_breakdown).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Top Categories</h4>
            <div className="space-y-2">
              {Object.entries(fm.category_breakdown).map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-gray-600">{cat}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className="bg-[#0C2D57] h-3 rounded-full" style={{width: `${(count / fm.total_feedback * 100)}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Branch Intelligence */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">BranchConnect Intelligence</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <StatCard label="Shared Posts" value={bi.total_posts} />
          <StatCard label="Solutions" value={bi.total_solutions} />
          <StatCard label="Adoptions" value={bi.total_adoptions} />
        </div>
      </div>

      {/* Insights */}
      {insights && insights.insights && insights.insights.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Operational Insights</h3>
          <div className="space-y-4">
            {insights.insights.map((insight, i) => (
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

      {/* Top Complaints */}
      {insights && insights.top_complaints && insights.top_complaints.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Customer Issues</h3>
          {insights.top_complaints.map((c, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-6">{i + 1}.</span>
                <span className="text-sm text-gray-900">{c.topic}</span>
              </div>
              <span className="text-sm font-medium text-red-600">{c.count} complaints</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
