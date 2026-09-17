import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/Elements';

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

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  const activeAppts = appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED');
  const activeTickets = tickets.filter(t => ['WAITING', 'CALLED', 'IN_SERVICE', 'CHECKED_IN'].includes(t.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.first_name}</h1>
        <p className="text-gray-500 text-sm">Your connected banking dashboard</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/services" className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-blue-600 text-lg">🔍</span>
          </div>
          <span className="text-sm font-medium text-gray-900">Discover Services</span>
        </Link>
        <Link to="/customer/queue" className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition text-center">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-yellow-600 text-lg">📋</span>
          </div>
          <span className="text-sm font-medium text-gray-900">Join Queue</span>
        </Link>
        <Link to="/customer/documents" className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition text-center">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-green-600 text-lg">📄</span>
          </div>
          <span className="text-sm font-medium text-gray-900">Upload Docs</span>
        </Link>
        <Link to="/customer/payments" className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition text-center">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-emerald-600 text-lg">💳</span>
          </div>
          <span className="text-sm font-medium text-gray-900">Payments</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
        <Link to="/customer/feedback" className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-purple-600 text-lg">💬</span>
          </div>
          <span className="text-sm font-medium text-gray-900">Give Feedback</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Queue */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Active Queue</h3>
          {activeTickets.length === 0 ? (
            <p className="text-sm text-gray-500">No active queue tickets</p>
          ) : activeTickets.map(t => (
            <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div>
                <div className="font-mono font-bold text-[#0C2D57]">{t.ticket_number}</div>
                <div className="text-xs text-gray-500">{t.service?.name}</div>
              </div>
              <div className="text-right">
                <StatusBadge status={t.status} />
                <div className="text-xs text-gray-500 mt-1">Position: {t.position}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          {activeAppts.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming appointments</p>
          ) : activeAppts.slice(0, 3).map(a => (
            <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div>
                <div className="text-sm font-medium text-gray-900">{a.service?.name}</div>
                <div className="text-xs text-gray-500">{a.branch?.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{a.appointment_date}</div>
                <div className="text-xs text-gray-500">{a.appointment_time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Feedback */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Feedback</h3>
          {feedbacks.length === 0 ? (
            <p className="text-sm text-gray-500">No feedback submitted yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-500">Type</th>
                  <th className="text-left py-2 font-medium text-gray-500">Content</th>
                  <th className="text-left py-2 font-medium text-gray-500">Sentiment</th>
                  <th className="text-left py-2 font-medium text-gray-500">Status</th>
                </tr></thead>
                <tbody>
                  {feedbacks.slice(0, 5).map(f => (
                    <tr key={f.id} className="border-b border-gray-50">
                      <td className="py-2"><StatusBadge status={f.type} /></td>
                      <td className="py-2 text-gray-600 max-w-xs truncate">{f.content}</td>
                      <td className="py-2">
                        {f.analysis && <span className={`font-medium ${f.analysis.sentiment === 'Positive' ? 'text-green-600' : f.analysis.sentiment === 'Negative' ? 'text-red-600' : 'text-yellow-600'}`}>{f.analysis.sentiment}</span>}
                      </td>
                      <td className="py-2"><StatusBadge status={f.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
