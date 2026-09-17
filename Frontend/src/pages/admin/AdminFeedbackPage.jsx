import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { StatusBadge, LoadingPage, PageHeader, Card, CardTitle } from '../../components/ui/Elements';

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

  if (loading) return <LoadingPage />;

  const sentimentStats = analysis ? [
    { label: 'Total Feedback', value: analysis.total_feedback, color: 'text-on-surface' },
    { label: 'Positive', value: analysis.sentiment_breakdown?.Positive || 0, color: 'text-tertiary' },
    { label: 'Negative', value: analysis.sentiment_breakdown?.Negative || 0, color: 'text-error' },
    { label: 'Neutral', value: analysis.sentiment_breakdown?.Neutral || 0, color: 'text-primary' },
  ] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="SocialPulse AI"
        title="Feedback Intelligence"
        subtitle="Every question and complaint, categorized and ready to act on."
      />

      {/* Analysis Summary */}
      {analysis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {sentimentStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 text-center shadow-sm">
              <div className={`text-2xl font-bold font-data-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-on-surface-variant">{s.label}</div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Top Topics */}
      {analysis && analysis.top_topics?.length > 0 && (
        <Card className="mb-6" delay={100}>
          <CardTitle icon="tag">Top Topics</CardTitle>
          {analysis.top_topics.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
              <span className="text-sm text-on-surface">{t.topic}</span>
              <span className="text-sm font-semibold text-on-surface-variant font-data-mono">{t.count}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Filter */}
      <Reveal direction="down" delay={120} className="flex flex-wrap gap-2 mb-6">
        {['', 'Positive', 'Neutral', 'Negative'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-primary-container text-white shadow-[0_2px_8px_rgba(0,82,255,0.25)]' : 'bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'}`}>
            {f || 'All'}
          </button>
        ))}
      </Reveal>

      {/* Feedback List */}
      <div className="space-y-3">
        {feedbacks.map((f, i) => (
          <Reveal key={f.id} delay={Math.min(i * 60, 300)} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={f.type} />
                {f.analysis && (
                  <span className={`text-xs font-semibold ${f.analysis.sentiment === 'Positive' ? 'text-tertiary' : f.analysis.sentiment === 'Negative' ? 'text-error' : 'text-primary'}`}>
                    {f.analysis.sentiment}
                  </span>
                )}
                {f.analysis?.priority && <StatusBadge status={f.analysis.priority} />}
              </div>
              <span className="text-xs text-on-surface-variant font-data-mono-xs">{new Date(f.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-on-surface mb-1">{f.content}</p>
            {f.analysis && (
              <div className="text-xs text-on-surface-variant">Topic: {f.analysis.topic} • Category: {f.analysis.category}</div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
