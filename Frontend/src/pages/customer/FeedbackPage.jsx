import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, PageHeader, Card, CardTitle, PrimaryButton, Field, Select, Textarea, Alert } from '../../components/ui/Elements';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ content: '', type: 'FEEDBACK', branch_id: '', rating: 5 });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/feedback/my-feedback'),
      api.get('/branches/')
    ]).then(([f, b]) => {
      setFeedbacks(f.data);
      setBranches(b.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!form.content.trim()) return;
    setSubmitting(true);
    try {
      const data = { ...form, branch_id: form.branch_id ? parseInt(form.branch_id) : undefined };
      const res = await api.post('/feedback/', data);
      setFeedbacks([res.data, ...feedbacks]);
      setForm({ content: '', type: 'FEEDBACK', branch_id: '', rating: 5 });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Your voice matters"
        title="Customer Feedback"
        subtitle="Tell us how it went — every note helps teams fix what's slow."
      />

      {/* Submit */}
      <Card className="mb-6">
        <CardTitle icon="rate_review">Share Your Experience</CardTitle>
        {success && <Alert kind="success" className="mb-4">Feedback submitted and analyzed successfully!</Alert>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Field label="Type">
            <Select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="FEEDBACK">Feedback</option>
              <option value="COMPLAINT">Complaint</option>
              <option value="QUESTION">Question</option>
            </Select>
          </Field>
          <Field label="Branch (Optional)">
            <Select value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})}>
              <option value="">Select branch</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </Field>
        </div>
        <div className="mb-4">
          <Field label="Your Experience">
            <Textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
              rows={4} placeholder="Tell us about your experience..." />
          </Field>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-on-surface-variant mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setForm({...form, rating: n})} aria-label={`Rate ${n}`}
                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${form.rating >= n ? 'bg-primary-container text-white shadow-[0_2px_8px_rgba(0,82,255,0.25)]' : 'bg-surface-container text-outline hover:bg-surface-container-high'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <PrimaryButton onClick={handleSubmit} disabled={!form.content.trim() || submitting}>
          {submitting ? 'Submitting...' : 'Submit Feedback'}
          <span className="material-symbols-outlined text-[16px]">send</span>
        </PrimaryButton>
      </Card>

      {/* History */}
      <Card delay={120}>
        <CardTitle icon="history">Your Feedback History</CardTitle>
        {feedbacks.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No feedback submitted yet</p>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((f, i) => (
              <Reveal key={f.id} delay={i * 60} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${f.type === 'COMPLAINT' ? 'bg-error-container text-on-error-container' : f.type === 'QUESTION' ? 'bg-primary-fixed text-primary' : 'bg-tertiary-fixed text-tertiary'}`}>
                    {f.type}
                  </span>
                  <span className="text-xs text-on-surface-variant font-data-mono-xs">{new Date(f.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-on-surface mb-2">{f.content}</p>
                {f.analysis && (
                  <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant">
                    <span>Sentiment: <span className={`font-semibold ${f.analysis.sentiment === 'Positive' ? 'text-tertiary' : f.analysis.sentiment === 'Negative' ? 'text-error' : 'text-primary'}`}>{f.analysis.sentiment}</span></span>
                    <span>Topic: {f.analysis.topic}</span>
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
