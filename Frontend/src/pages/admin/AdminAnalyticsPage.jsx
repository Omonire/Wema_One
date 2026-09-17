import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, PageHeader, Card, CardTitle } from '../../components/ui/Elements';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/insights').then(res => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;
  if (!data) return <div className="text-center py-20 text-on-surface-variant">Failed to load</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Live insights"
        title="Analytics & Insights"
        subtitle="See what's slowing people down and fix it before lines get long."
      />

      {/* Top Complaints */}
      <Card className="mb-6">
        <CardTitle icon="report">Top Customer Issues</CardTitle>
        {data.top_complaints?.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No complaints data</p>
        ) : data.top_complaints?.map((c, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-outline w-6 font-data-mono">{i + 1}.</span>
              <span className="text-sm text-on-surface">{c.topic}</span>
            </div>
            <span className="text-sm font-semibold text-error">{c.count} complaints</span>
          </div>
        ))}
      </Card>

      {/* Branch Performance */}
      <Card className="mb-6" delay={100}>
        <CardTitle icon="leaderboard">Branch Performance</CardTitle>
        {data.branch_performance?.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No data</p>
        ) : (
          <div className="space-y-3">
            {data.branch_performance?.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-40 text-sm text-on-surface-variant">{b.branch}</div>
                <div className="flex-1 bg-surface-container-high rounded-full h-3 overflow-hidden">
                  <div className="bg-primary-container h-3 rounded-full transition-all duration-700" style={{width: `${Math.min(b.appointments * 10, 100)}%`}}></div>
                </div>
                <span className="text-sm font-semibold text-on-surface w-20 text-right font-data-mono">{b.appointments} appts</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Insights */}
      {data.insights?.length > 0 && (
        <Card delay={160}>
          <CardTitle icon="tips_and_updates">AI Insights</CardTitle>
          <div className="space-y-4">
            {data.insights.map((insight, i) => (
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
    </div>
  );
}
