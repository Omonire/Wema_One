import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/services/${id}`),
      api.get('/branches/')
    ]).then(([svcRes, brRes]) => {
      setService(svcRes.data);
      setBranches(brRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (selectedBranch && selectedDate && id) {
      api.get(`/appointments/slots?branch_id=${selectedBranch}&service_id=${id}&date=${selectedDate}`)
        .then(res => setSlots(res.data));
    }
  }, [selectedBranch, selectedDate, id]);

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedBranch || !selectedDate || !selectedSlot) return;
    setBooking(true);
    try {
      await api.post('/appointments/', {
        branch_id: parseInt(selectedBranch),
        service_id: parseInt(id),
        appointment_date: selectedDate,
        appointment_time: selectedSlot
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!service) return <div className="text-center py-20 text-gray-500">Service not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
            <p className="text-gray-600 mt-1">{service.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#0C2D57]">{service.fee > 0 ? `₦${service.fee.toLocaleString()}` : 'Free'}</div>
            <div className="text-sm text-gray-500">~{service.estimated_time_minutes} min</div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Required Documents</h3>
          {service.requirements?.map((req, i) => (
            <div key={i} className="flex items-start gap-3 mb-2">
              <span className={`mt-0.5 ${req.is_mandatory ? 'text-green-600' : 'text-gray-400'}`}>
                {req.is_mandatory ? '✓' : '○'}
              </span>
              <div>
                <span className="text-sm font-medium text-gray-900">{req.name}</span>
                {req.description && <p className="text-xs text-gray-500">{req.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Book Appointment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Select branch</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <select value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Select time</option>
              {slots.filter(s => s.available).map(s => <option key={s.time} value={s.time}>{s.time}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleBook} disabled={!selectedBranch || !selectedDate || !selectedSlot || booking}
          className="bg-[#0C2D57] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#0A2445] disabled:opacity-50">
          {booking ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </div>
  );
}
