import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/Elements';

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

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Branch Appointments</h1>

      <div className="flex gap-3 mb-6">
        {['', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === f ? 'bg-[#0C2D57] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {appointments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-10">No appointments found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Service</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Time</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{a.customer_id ? `Customer #${a.customer_id}` : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{a.service?.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{a.appointment_date}</td>
                  <td className="px-4 py-3 text-gray-600">{a.appointment_time}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
