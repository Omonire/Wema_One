import { useState, useEffect } from 'react';
import { api } from '../../services/api';

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

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Feedback</h1>

      {/* Submit */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Share Your Experience</h2>
        {success && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">Feedback submitted and analyzed successfully!</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="FEEDBACK">Feedback</option>
              <option value="COMPLAINT">Complaint</option>
              <option value="QUESTION">Question</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch (Optional)</label>
            <select value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Select branch</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Experience</label>
          <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
            rows={4} placeholder="Tell us about your experience..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2D57]" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setForm({...form, rating: n})}
                className={`w-10 h-10 rounded-lg font-medium text-sm ${form.rating >= n ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!form.content.trim() || submitting}
          className="bg-[#0C2D57] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#0A2445] disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>

      {/* History */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Your Feedback History</h2>
        {feedbacks.length === 0 ? (
          <p className="text-sm text-gray-500">No feedback submitted yet</p>
        ) : (
          <div className="space-y-3">
            {feedbacks.map(f => (
              <div key={f.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${f.type === 'COMPLAINT' ? 'bg-red-100 text-red-700' : f.type === 'QUESTION' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {f.type}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(f.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{f.content}</p>
                {f.analysis && (
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Sentiment: <span className={`font-medium ${f.analysis.sentiment === 'Positive' ? 'text-green-600' : f.analysis.sentiment === 'Negative' ? 'text-red-600' : 'text-yellow-600'}`}>{f.analysis.sentiment}</span></span>
                    <span>Topic: {f.analysis.topic}</span>
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
