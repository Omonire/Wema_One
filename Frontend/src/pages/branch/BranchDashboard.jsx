import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Reveal from '../../components/ScrollReveal';
import { StatusBadge, LoadingPage, Card, CardTitle } from '../../components/ui/Elements';

export default function BranchDashboard() {
  const { user } = useAuth();
  const [queue, setQueue] = useState({ waiting: [], called: [], in_service: [], total_waiting: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const branchId = user?.branch_id;

  useEffect(() => {
    if (!branchId) { setLoading(false); return; }
    Promise.all([
      api.get(`/branches/${branchId}/queue`),
      api.get(`/appointments/branch/${branchId}`)
    ]).then(([q, a]) => {
      setQueue(q.data);
      setAppointments(a.data);
    }).finally(() => setLoading(false));
  }, [branchId]);

  const callNext = async (ticketId) => {
    await api.post(`/queues/${ticketId}/call`);
    const res = await api.get(`/branches/${branchId}/queue`);
    setQueue(res.data);
  };

  const serveTicket = async (ticketId) => {
    await api.post(`/queues/${ticketId}/serve`);
    const res = await api.get(`/branches/${branchId}/queue`);
    setQueue(res.data);
  };

  const completeTicket = async (ticketId) => {
    await api.post(`/queues/${ticketId}/complete`);
    const res = await api.get(`/branches/${branchId}/queue`);
    setQueue(res.data);
  };

  if (loading) return <LoadingPage />;

  const stats = [
    { label: 'Waiting', value: queue.total_waiting, color: 'text-primary', icon: 'hourglass_top' },
    { label: 'Called', value: queue.called?.length || 0, color: 'text-primary-container', icon: 'campaign' },
    { label: 'In Service', value: queue.in_service?.length || 0, color: 'text-tertiary', icon: 'support_agent' },
    { label: "Today's Appointments", value: appointments.filter(a => a.status === 'SCHEDULED').length, color: 'text-on-surface', icon: 'event_available' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Reveal direction="down" className="mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="font-data-mono-xs text-xs uppercase text-primary font-semibold tracking-wider">Branch operations</span>
          <h1 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Branch Dashboard</h1>
          <p className="text-on-surface-variant text-sm">Manage queue, appointments, and customer service</p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed/40 text-tertiary font-data-mono-xs text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span> Live queue active
        </span>
      </Reveal>

      {/* Queue Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="material-symbols-outlined text-outline-variant text-[20px]">{s.icon}</span>
              <div className={`text-3xl font-bold ${s.color} font-data-mono`}>{s.value}</div>
            </div>
            <div className="text-sm text-on-surface-variant">{s.label}</div>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue */}
        <Card delay={100}>
          <CardTitle icon="confirmation_number">Live Queue</CardTitle>
          {queue.waiting?.length === 0 && queue.called?.length === 0 && queue.in_service?.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No customers in queue</p>
          ) : (
            <div className="space-y-3">
              {[...(queue.called || []), ...(queue.in_service || []), ...(queue.waiting || [])].map((t, i) => (
                <Reveal key={t.id} delay={Math.min(i * 50, 250)}
                  className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <div className="font-data-mono font-bold text-primary w-20">{t.ticket_number}</div>
                    <div>
                      <div className="text-sm font-medium text-on-surface">{t.service?.name}</div>
                      <div className="text-xs text-on-surface-variant">Pos: {t.position} • Est: {t.estimated_service_time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.status} />
                    {t.status === 'WAITING' && (
                      <button onClick={() => callNext(t.id)} className="text-xs bg-primary-fixed text-primary px-2.5 py-1 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">Call</button>
                    )}
                    {t.status === 'CALLED' && (
                      <button onClick={() => serveTicket(t.id)} className="text-xs bg-primary-fixed text-primary px-2.5 py-1 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">Serve</button>
                    )}
                    {t.status === 'IN_SERVICE' && (
                      <button onClick={() => completeTicket(t.id)} className="text-xs bg-tertiary-fixed text-tertiary px-2.5 py-1 rounded-lg font-medium hover:bg-tertiary hover:text-white transition-colors">Complete</button>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Card>

        {/* Appointments */}
        <Card delay={180}>
          <CardTitle icon="event_note">Appointments</CardTitle>
          {appointments.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No appointments</p>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 8).map((a, i) => (
                <Reveal key={a.id} delay={Math.min(i * 50, 250)}
                  className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <div>
                    <div className="text-sm font-medium text-on-surface">{a.service?.name}</div>
                    <div className="text-xs text-on-surface-variant">{a.appointment_date} at {a.appointment_time}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </Reveal>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
