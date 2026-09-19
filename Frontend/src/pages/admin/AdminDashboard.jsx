import SvgIcon from '../../components/ui/SvgIcon';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, Card, CardTitle } from '../../components/ui/Elements';

function StatCard({ label, value, sub, delay = 0 }) {
  return (
    <Reveal delay={delay} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 shadow-sm">
      <div className="text-sm text-on-surface-variant mb-1">{label}</div>
      <div className="text-2xl font-bold text-on-surface font-data-mono">{value}</div>
      {sub && <div className="text-xs text-outline mt-1">{sub}</div>}
    </Reveal>
  );
}

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

  if (loading) return <LoadingPage />;
  if (!dashboard) return <div className="text-center py-20 text-on-surface-variant">Failed to load dashboard</div>;

  const { customer_metrics: cm, document_metrics: dm, payment_metrics: pm, feedback_metrics: fm, branch_intelligence: bi } = dashboard;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Reveal direction="down" className="mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="font-data-mono-xs text-xs uppercase text-primary font-semibold tracking-wider">Executive oversight</span>
          <h1 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface tracking-tight">NQB Intelligence</h1>
          <p className="text-on-surface-variant text-sm">Platform-wide analytics and operational insights</p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed/40 text-tertiary font-data-mono-xs text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span> All offices running on schedule
        </span>
      </Reveal>

      {/* Customer Metrics */}
      <Reveal direction="left">
        <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
          <SvgIcon name="group" className="text-primary-container text-[20px]" />Customer Metrics
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Customers" value={cm.total_customers} delay={0} />
        <StatCard label="Appointments" value={cm.total_appointments} sub={`${cm.active_appointments} active`} delay={70} />
        <StatCard label="Queue Tickets" value={cm.total_queue_tickets} sub={`${cm.active_queue} in queue`} delay={140} />
        <StatCard label="Branches" value={cm.total_branches} delay={210} />
      </div>

      {/* Document & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card delay={80}>
          <CardTitle icon="folder_open">Document Metrics</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Documents" value={dm.total_documents} />
            <StatCard label="Verified" value={dm.verified} sub={`${dm.verification_rate}% success rate`} delay={60} />
            <StatCard label="Action Required" value={dm.action_required} delay={120} />
            <StatCard label="Verification Rate" value={`${dm.verification_rate}%`} delay={180} />
          </div>
        </Card>
        <Card delay={160}>
          <CardTitle icon="payments">Payment Metrics</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Payments" value={pm.total_payments} />
            <StatCard label="Successful" value={pm.successful} delay={60} />
            <StatCard label="Total Revenue" value={`₦${pm.total_revenue.toLocaleString()}`} delay={120} />
          </div>
        </Card>
      </div>

      {/* Feedback Intelligence */}
      <Card className="mb-8" delay={100}>
        <CardTitle icon="psychology">Customer Intelligence (SocialPulse)</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard label="Total Feedback" value={fm.total_feedback} />
          <StatCard label="Positive" value={fm.positive} sub="Sentiment" delay={60} />
          <StatCard label="Negative" value={fm.negative} sub="Sentiment" delay={120} />
          <StatCard label="Avg Rating" value={fm.avg_rating ? `${fm.avg_rating}/5` : 'N/A'} delay={180} />
        </div>
        {fm.category_breakdown && Object.keys(fm.category_breakdown).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-on-surface-variant mb-2">Top Categories</h4>
            <div className="space-y-2">
              {Object.entries(fm.category_breakdown).map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-on-surface-variant">{cat}</div>
                  <div className="flex-1 bg-surface-container-high rounded-full h-3 overflow-hidden">
                    <div className="bg-primary-container h-3 rounded-full transition-all duration-700" style={{width: `${(count / fm.total_feedback * 100)}%`}}></div>
                  </div>
                  <span className="text-sm font-semibold text-on-surface w-8 text-right font-data-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Branch Intelligence */}
      <Card className="mb-8" delay={140}>
        <CardTitle icon="hub">BranchConnect Intelligence</CardTitle>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Shared Posts" value={bi.total_posts} />
          <StatCard label="Solutions" value={bi.total_solutions} delay={60} />
          <StatCard label="Adoptions" value={bi.total_adoptions} delay={120} />
        </div>
      </Card>

      {/* Insights */}
      {insights && insights.insights && insights.insights.length > 0 && (
        <Card delay={180}>
          <CardTitle icon="tips_and_updates">Operational Insights</CardTitle>
          <div className="space-y-4">
            {insights.insights.map((insight, i) => (
              <Reveal key={i} delay={i * 90} className={`p-4 rounded-xl border-l-4 ${insight.severity === 'HIGH' ? 'bg-error-container/40 border-error' : 'bg-surface-container-highest/60 border-primary'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${insight.severity === 'HIGH' ? 'bg-error-container text-on-error-container' : 'bg-primary-fixed text-primary'}`}>{insight.type}</span>
                  <span className="text-sm font-semibold text-on-surface">{insight.title}</span>
                </div>
                <p className="text-sm text-on-surface-variant mb-1">{insight.description}</p>
                <p className="text-xs text-outline">Recommended: {insight.recommended_action}</p>
              </Reveal>
            ))}
          </div>
        </Card>
      )}

      {/* Top Complaints */}
      {insights && insights.top_complaints && insights.top_complaints.length > 0 && (
        <Card delay={220} className="mt-6">
          <CardTitle icon="report">Top Customer Issues</CardTitle>
          {insights.top_complaints.map((c, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-outline w-6 font-data-mono">{i + 1}.</span>
                <span className="text-sm text-on-surface">{c.topic}</span>
              </div>
              <span className="text-sm font-semibold text-error">{c.count} complaints</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
