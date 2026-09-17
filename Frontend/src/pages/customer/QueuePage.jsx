import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { StatusBadge, LoadingPage, PageHeader, Card, CardTitle, PrimaryButton, Field, Select } from '../../components/ui/Elements';

export default function QueuePage() {
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

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Save your spot from home"
        title="SmartQueue"
        subtitle="Join the digital queue and walk in right when it's your turn."
      />

      {/* Active Tickets */}
      {myTickets.length > 0 && (
        <Card className="mb-6" direction="down">
          <CardTitle icon="confirmation_number">Your Active Tickets</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTickets.map((t, i) => (
              <Reveal key={t.id} delay={i * 90} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30">
                <div className="text-center">
                  <div className="text-3xl font-data-mono font-bold text-primary mb-2">{t.ticket_number}</div>
                  <div className="text-sm text-on-surface-variant mb-1">{t.service?.name}</div>
                  <div className="text-xs text-on-surface-variant mb-3">
                    Position: <span className="font-bold text-lg text-on-surface">{t.position}</span>
                  </div>
                  <StatusBadge status={t.status} />
                  <div className="text-xs text-on-surface-variant mt-2">Est. service: {t.estimated_service_time}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Card>
      )}

      {/* Join Queue */}
      <Card delay={120}>
        <CardTitle icon="group_add">Join Queue</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Field label="Branch">
            <Select value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})}>
              <option value="">Select branch</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </Field>
          <Field label="Service">
            <Select value={form.service_id} onChange={e => setForm({...form, service_id: e.target.value})}>
              <option value="">Select service</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
        </div>
        <PrimaryButton onClick={handleJoin} disabled={!form.branch_id || !form.service_id || submitting}>
          {submitting ? 'Joining...' : 'Join Queue'}
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </PrimaryButton>
      </Card>
    </div>
  );
}
