import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function QueuePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [form, setForm] = useState({ branch_id: '', service_id: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/branches/'),
      api.get('/services/'),
      api.get('/queues/active')
    ]).then(([b, s, t]) => {
      setBranches(b.data);
      setServices(s.data);
      setMyTickets(t.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleJoin = async () => {
    if (!form.branch_id || !form.service_id) return;
    setSubmitting(true);
    try {
      await api.post('/queues/', { branch_id: parseInt(form.branch_id), service_id: parseInt(form.service_id) });
      const res = await api.get('/queues/active');
      setMyTickets(res.data);
    } catch (err) {
      alert(err.message || 'Failed to join queue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">SmartQueue</h1>

      {/* Active Tickets */}
      {myTickets.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Your Active Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTickets.map(t => (
              <div key={t.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-[#0C2D57] mb-2">{t.ticket_number}</div>
                  <div className="text-sm text-gray-600 mb-1">{t.service?.name}</div>
                  <div className="text-xs text-gray-500 mb-3">
                    Position: <span className="font-bold text-lg">{t.position}</span>
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2
                    ${t.status === 'WAITING' ? 'bg-yellow-100 text-yellow-700' :
                      t.status === 'CALLED' ? 'bg-purple-100 text-purple-700' :
                      t.status === 'IN_SERVICE' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}">
                    {t.status}
                  </div>
                  <div className="text-xs text-gray-500">Est. service: {t.estimated_service_time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Join Queue */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Join Queue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Select branch</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select value={form.service_id} onChange={e => setForm({...form, service_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Select service</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleJoin} disabled={!form.branch_id || !form.service_id || submitting}
          className="bg-[#0C2D57] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#0A2445] disabled:opacity-50">
          {submitting ? 'Joining...' : 'Join Queue'}
        </button>
      </div>
    </div>
  );
}
