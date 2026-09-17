import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, Card, CardTitle, PrimaryButton, Field, Select, Input, Alert } from '../../components/ui/Elements';

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

  if (loading) return <LoadingPage />;
  if (!service) return <div className="text-center py-20 text-on-surface-variant">Service not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Service card */}
      <Card className="mb-6" direction="down">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <span className="font-data-mono-xs text-xs uppercase text-primary font-semibold tracking-wider">{service.category}</span>
            <h1 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface tracking-tight mt-1">{service.name}</h1>
            <p className="text-on-surface-variant mt-1">{service.description}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-primary font-data-mono">{service.fee > 0 ? `₦${service.fee.toLocaleString()}` : 'Free'}</div>
            <div className="text-sm text-on-surface-variant">~{service.estimated_time_minutes} min</div>
          </div>
        </div>

        <div className="border-t border-outline-variant/20 pt-4">
          <CardTitle icon="fact_check">Required Documents</CardTitle>
          {service.requirements?.map((req, i) => (
            <div key={i} className="flex items-start gap-3 mb-2">
              <span className={`mt-0.5 font-bold ${req.is_mandatory ? 'text-tertiary' : 'text-outline-variant'}`}>
                {req.is_mandatory ? '✓' : '○'}
              </span>
              <div>
                <span className="text-sm font-medium text-on-surface">{req.name}</span>
                {req.description && <p className="text-xs text-on-surface-variant">{req.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Booking card */}
      <Card delay={120}>
        <CardTitle icon="event_available">Book Appointment</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Field label="Branch">
            <Select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}>
              <option value="">Select branch</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </Field>
          <Field label="Date">
            <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} />
          </Field>
          <Field label="Time">
            <Select value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}>
              <option value="">Select time</option>
              {slots.filter(s => s.available).map(s => <option key={s.time} value={s.time}>{s.time}</option>)}
            </Select>
          </Field>
        </div>
        <PrimaryButton onClick={handleBook} disabled={!selectedBranch || !selectedDate || !selectedSlot || booking}>
          {booking ? 'Booking...' : 'Book Appointment'}
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </PrimaryButton>
        {!user && (
          <Alert kind="info" className="mt-4">You'll be asked to sign in before booking.</Alert>
        )}
      </Card>
    </div>
  );
}
