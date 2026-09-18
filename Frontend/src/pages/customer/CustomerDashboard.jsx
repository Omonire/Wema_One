import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Reveal from '../../components/ScrollReveal';
import { StatusBadge, LoadingPage, Card, CardTitle } from '../../components/ui/Elements';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/appointments/'),
      api.get('/queues/my-tickets'),
      api.get('/feedback/my-feedback')
    ]).then(([a, t, f]) => {
      setAppointments(a.data);
      setTickets(t.data);
      setFeedbacks(f.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const activeAppts = appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED');
  const activeTickets = tickets.filter(t => ['WAITING', 'CALLED', 'IN_SERVICE', 'CHECKED_IN'].includes(t.status));

  const quickActions = [
    { to: '/services', icon: 'search', label: 'Discover Services', bg: 'bg-primary-fixed/40', color: 'text-primary' },
    { to: '/customer/queue', icon: 'confirmation_number', label: 'Join Queue', bg: 'bg-primary-fixed/40', color: 'text-primary' },
    { to: '/customer/documents', icon: 'upload_file', label: 'Upload Docs', bg: 'bg-tertiary-fixed/40', color: 'text-tertiary' },
    { to: '/customer/payments', icon: 'payments', label: 'Payments', bg: 'bg-tertiary-fixed/40', color: 'text-tertiary' },
    { to: '/customer/feedback', icon: 'forum', label: 'Give Feedback', bg: 'bg-primary-fixed/40', color: 'text-primary' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Reveal direction="down" className="mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="font-data-mono-xs text-xs uppercase text-primary font-semibold tracking-wider">Your dashboard</span>
          <h1 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Welcome, {user?.first_name}</h1>
          <p className="text-on-surface-variant text-sm">Everything for your visit, in one place.</p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed/40 text-tertiary font-data-mono-xs text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span> All systems ready
        </span>
      </Reveal>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {quickActions.map((action, i) => (
          <Reveal key={action.to} delay={i * 70}>
            <Link to={action.to} className="block bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
              <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center mx-auto mb-2`}>
                <SvgIcon name={action.icon} size={20} className={action.color} />
              </div>
              <span className="text-sm font-medium text-on-surface">{action.label}</span>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Queue */}
        <Card delay={100}>
          <CardTitle icon="confirmation_number">Active Queue</CardTitle>
          {activeTickets.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No active queue tickets</p>
          ) : activeTickets.map(t => (
            <div key={t.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl mb-2">
              <div>
                <div className="font-data-mono font-bold text-primary">{t.ticket_number}</div>
                <div className="text-xs text-on-surface-variant">{t.service?.name}</div>
              </div>
              <div className="text-right">
                <StatusBadge status={t.status} />
                <div className="text-xs text-on-surface-variant mt-1">Position: {t.position}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Upcoming Appointments */}
        <Card delay={180}>
          <CardTitle icon="event_available">Upcoming Appointments</CardTitle>
          {activeAppts.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No upcoming appointments</p>
          ) : activeAppts.slice(0, 3).map(a => (
            <div key={a.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl mb-2">
              <div>
                <div className="text-sm font-medium text-on-surface">{a.service?.name}</div>
                <div className="text-xs text-on-surface-variant">{a.branch?.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-on-surface">{a.appointment_date}</div>
                <div className="text-xs text-on-surface-variant">{a.appointment_time}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Recent Feedback */}
        <Card delay={240} className="lg:col-span-2">
          <CardTitle icon="forum">Recent Feedback</CardTitle>
          {feedbacks.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No feedback submitted yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-outline-variant/20">
                  <th className="text-left py-2 font-medium text-on-surface-variant">Type</th>
                  <th className="text-left py-2 font-medium text-on-surface-variant">Content</th>
                  <th className="text-left py-2 font-medium text-on-surface-variant">Sentiment</th>
                  <th className="text-left py-2 font-medium text-on-surface-variant">Status</th>
                </tr></thead>
                <tbody>
                  {feedbacks.slice(0, 5).map(f => (
                    <tr key={f.id} className="border-b border-outline-variant/10">
                      <td className="py-2"><StatusBadge status={f.type} /></td>
                      <td className="py-2 text-on-surface-variant max-w-xs truncate">{f.content}</td>
                      <td className="py-2">
                        {f.analysis && <span className={`font-medium ${f.analysis.sentiment === 'Positive' ? 'text-tertiary' : f.analysis.sentiment === 'Negative' ? 'text-error' : 'text-primary'}`}>{f.analysis.sentiment}</span>}
                      </td>
                      <td className="py-2"><StatusBadge status={f.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
