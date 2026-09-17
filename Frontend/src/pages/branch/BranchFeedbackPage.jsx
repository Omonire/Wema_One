import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, PageHeader, Card } from '../../components/ui/Elements';

export default function BranchFeedbackPage() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = user?.branch_id ? `?branch_id=${user.branch_id}` : '';
    api.get(`/feedback/${params}`).then(res => setFeedbacks(res.data)).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Customer voices"
        title="Customer Feedback"
        subtitle="What customers are saying about your branch, analyzed by AI."
      />

      <Card delay={100}>
        {feedbacks.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-10">No feedback yet</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((f, i) => (
              <Reveal key={f.id} delay={Math.min(i * 60, 300)} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${f.type === 'COMPLAINT' ? 'bg-error-container text-on-error-container' : f.type === 'QUESTION' ? 'bg-primary-fixed text-primary' : 'bg-tertiary-fixed text-tertiary'}`}>
                      {f.type}
                    </span>
                    {f.analysis && (
                      <span className={`text-xs font-semibold ${f.analysis.sentiment === 'Positive' ? 'text-tertiary' : f.analysis.sentiment === 'Negative' ? 'text-error' : 'text-primary'}`}>
                        {f.analysis.sentiment}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-on-surface-variant font-data-mono-xs">{new Date(f.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-on-surface mb-2">{f.content}</p>
                {f.analysis && (
                  <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant">
                    <span>Topic: {f.analysis.topic}</span>
                    <span>Category: {f.analysis.category}</span>
                    <span>Priority: {f.analysis.priority}</span>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
