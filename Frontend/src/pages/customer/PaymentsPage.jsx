import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/Elements';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/payments/'),
      api.get('/services/')
    ]).then(([p, s]) => {
      setPayments(p.data);
      setServices(s.data);
    }).finally(() => setLoading(false));
  }, []);

  const handlePay = async () => {
    const svc = services.find(s => s.id === parseInt(selectedService));
    if (!svc || svc.fee === 0) return;
    setPaying(true);
    try {
      await api.post('/payments/', {
        service_id: svc.id,
        amount: svc.fee,
        payment_method: 'WemaPay'
      });
      const res = await api.get('/payments/');
      setPayments(res.data);
    } catch (err) {
      alert(err.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">WemaPay</h1>

      {/* Pay */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Make a Payment</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
          <select value={selectedService} onChange={e => setSelectedService(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Select a service to pay for</option>
            {services.filter(s => s.fee > 0).map(s => (
              <option key={s.id} value={s.id}>{s.name} - ₦{s.fee.toLocaleString()}</option>
            ))}
          </select>
        </div>
        {selectedService && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Service Fee</span>
              <span className="text-xl font-bold text-[#0C2D57]">
                ₦{services.find(s => s.id === parseInt(selectedService))?.fee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Payment Method</span>
              <span className="text-sm font-medium text-gray-900">WemaPay</span>
            </div>
          </div>
        )}
        <button onClick={handlePay} disabled={!selectedService || paying}
          className="bg-[#0C2D57] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#0A2445] disabled:opacity-50">
          {paying ? 'Processing...' : 'Pay Now'}
        </button>
      </div>

      {/* Payment History */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-gray-500">No payments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-2 font-medium text-gray-500">Reference</th>
                <th className="text-left py-2 font-medium text-gray-500">Amount</th>
                <th className="text-left py-2 font-medium text-gray-500">Method</th>
                <th className="text-left py-2 font-medium text-gray-500">Status</th>
                <th className="text-left py-2 font-medium text-gray-500">Date</th>
              </tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-2 font-mono text-xs">{p.transaction_ref}</td>
                    <td className="py-2 font-medium">₦{p.amount.toLocaleString()}</td>
                    <td className="py-2 text-gray-600">{p.payment_method}</td>
                    <td className="py-2"><StatusBadge status={p.status} /></td>
                    <td className="py-2 text-gray-500">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
