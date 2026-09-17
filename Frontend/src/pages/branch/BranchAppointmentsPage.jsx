import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Reveal from '../../components/ScrollReveal';
import { StatusBadge, LoadingPage, PageHeader } from '../../components/ui/Elements';

export default function BranchAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user?.branch_id) { setLoading(false); return; }
    const params = filter ? `?status=${filter}` : '';
    api.get(`/appointments/branch/${user.branch_id}${params}`).then(res => setAppointments(res.data)).finally(() => setLoading(false));
  }, [user, filter]);

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Scheduled visits"
        title="Branch Appointments"
        subtitle="Every booked customer, with their papers pre-checked before arrival."
      />

      <Reveal direction="down" delay={80} className="flex flex-wrap gap-2 mb-6">
        {['', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-primary-container text-white shadow-[0_2px_8px_rgba(0,82,255,0.25)]' : 'bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'}`}>
            {f ? f.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : 'All'}
          </button>
        ))}
      </Reveal>

      <Reveal delay={140} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
        {appointments.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-10">No appointments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Service</th>
                  <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Time</th>
                  <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, i) => (
                  <tr key={a.id} className="border-t border-outline-variant/15 hover:bg-surface-container-low/60 transition-colors">
                    <td className="px-4 py-3 text-on-surface">{a.customer_id ? `Customer #${a.customer_id}` : '-'}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{a.service?.name || '-'}</td>
                    <td className="px-4 py-3 text-on-surface-variant font-data-mono-xs">{a.appointment_date}</td>
                    <td className="px-4 py-3 text-on-surface-variant font-data-mono-xs">{a.appointment_time}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Reveal>
    </div>
  );
}
