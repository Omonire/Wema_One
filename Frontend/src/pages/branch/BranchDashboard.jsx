import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/Elements';

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

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Branch Dashboard</h1>
        <p className="text-gray-500 text-sm">Manage queue, appointments, and customer service</p>
      </div>

      {/* Queue Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-yellow-600">{queue.total_waiting}</div>
          <div className="text-sm text-gray-500">Waiting</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-purple-600">{queue.called?.length || 0}</div>
          <div className="text-sm text-gray-500">Called</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-600">{queue.in_service?.length || 0}</div>
          <div className="text-sm text-gray-500">In Service</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-[#0C2D57]">{appointments.filter(a => a.status === 'SCHEDULED').length}</div>
          <div className="text-sm text-gray-500">Today's Appointments</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Live Queue</h3>
          {queue.waiting?.length === 0 && queue.called?.length === 0 && queue.in_service?.length === 0 ? (
            <p className="text-sm text-gray-500">No customers in queue</p>
          ) : (
            <div className="space-y-3">
              {[...(queue.called || []), ...(queue.in_service || []), ...(queue.waiting || [])].map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-mono font-bold text-[#0C2D57] w-20">{t.ticket_number}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{t.service?.name}</div>
                      <div className="text-xs text-gray-500">Pos: {t.position} • Est: {t.estimated_service_time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.status} />
                    {t.status === 'WAITING' && (
                      <button onClick={() => callNext(t.id)} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">Call</button>
                    )}
                    {t.status === 'CALLED' && (
                      <button onClick={() => serveTicket(t.id)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Serve</button>
                    )}
                    {t.status === 'IN_SERVICE' && (
                      <button onClick={() => completeTicket(t.id)} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Complete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-sm text-gray-500">No appointments</p>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 8).map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{a.service?.name}</div>
                    <div className="text-xs text-gray-500">{a.appointment_date} at {a.appointment_time}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
