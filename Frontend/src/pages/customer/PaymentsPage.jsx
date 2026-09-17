import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { StatusBadge, LoadingPage, PageHeader, Card, CardTitle, PrimaryButton, Field, Select, Alert } from '../../components/ui/Elements';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('');
  const [consentPayment, setConsentPayment] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const refresh = () => api.get('/payments/').then(r => setPayments(r.data));

  useEffect(() => {
    Promise.all([api.get('/payments/'), api.get('/services/')])
      .then(([p, s]) => { setPayments(p.data); setServices(s.data); })
      .finally(() => setLoading(false));
  }, []);

  const handlePay = async () => {
    const svc = services.find(s => s.id === parseInt(selectedService));
    if (!svc || svc.fee === 0) return;
    setError('');
    setConsentPayment(null);
    setPaying(true);
    try {
      const res = await api.post('/payments/', {
        service_id: svc.id,
        amount: svc.fee,
        narration: `${svc.name} — service fee`
      });
      if (res.data.consent_required) {
        setConsentPayment(res.data.data);
      }
      refresh();
    } catch (err) {
      setError(err.message || 'Payment could not be initiated.');
      refresh();
    } finally {
      setPaying(false);
    }
  };

  const handleVerify = async (pay) => {
    setError('');
    try {
      await api.post(`/payments/${pay.id}/verify`);
      refresh();
    } catch (err) {
      setError(err.message || 'Verification failed.');
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Fast & transparent"
        title="Payments"
        subtitle="Pay fees directly with instant receipts and no hidden charges."
        action={<span className="px-3 py-1 rounded-md bg-primary-fixed text-primary font-data-mono-xs text-xs font-semibold">ALAT AUTHENTICATOR</span>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Make a Payment */}
        <Card>
          <CardTitle icon="payments">Make a Payment</CardTitle>
          <div className="mb-4">
            <Field label="Select Service">
              <Select value={selectedService} onChange={e => setSelectedService(e.target.value)}>
                <option value="">Select a service to pay for</option>
                {services.filter(s => s.fee > 0).map(s => (
                  <option key={s.id} value={s.id}>{s.name} - ₦{s.fee.toLocaleString()}</option>
                ))}
              </Select>
            </Field>
          </div>

          {selectedService && (
            <Reveal direction="down" className="bg-surface-container-low rounded-xl p-4 mb-4 border border-outline-variant/30">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Service Fee</span>
                <span className="text-xl font-bold text-primary font-data-mono">
                  ₦{services.find(s => s.id === parseInt(selectedService))?.fee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-on-surface-variant">Payment Method</span>
                <span className="text-sm font-medium text-on-surface">ALAT Authenticator</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-2">You will be asked to approve the debit in your ALAT app.</p>
            </Reveal>
          )}

          {error && <Alert kind="error" className="mb-4">{error}</Alert>}

          <PrimaryButton onClick={handlePay} disabled={!selectedService || paying}>
            {paying ? 'Processing...' : 'Pay Now'}
            <span className="material-symbols-outlined text-[16px]">lock</span>
          </PrimaryButton>
        </Card>

        {/* Payment status panel */}
        <div className="space-y-6">
          {consentPayment && (
            <Reveal direction="left" className="rounded-2xl p-6 bg-primary-fixed/40 border border-primary/30">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">approval</span>
                <div>
                  <h3 className="font-semibold text-on-surface">Approval Required</h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Payment <span className="font-data-mono font-semibold">{consentPayment.transaction_ref}</span> for ₦{consentPayment.amount.toLocaleString()}
                    {' '}has been initiated. Open your <strong>ALAT app</strong> and approve the debit request to complete the payment.
                  </p>
                  <PrimaryButton onClick={() => handleVerify(consentPayment)} className="mt-3">
                    I've approved — Refresh Status
                  </PrimaryButton>
                </div>
              </div>
            </Reveal>
          )}
          {!consentPayment && (
            <Card delay={100} direction="right" className="bg-surface-container-low">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-tertiary text-[22px]">verified_user</span>
                <h3 className="font-semibold text-on-surface">Bank-Level Protection</h3>
              </div>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-tertiary text-[16px]">check_circle</span> Every payment is encrypted and receipted instantly.</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-tertiary text-[16px]">check_circle</span> Approve debits from your own banking app.</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-tertiary text-[16px]">check_circle</span> Receipts are attached to your visit automatically.</li>
              </ul>
            </Card>
          )}
        </div>
      </div>

      {/* History */}
      <Card delay={160}>
        <CardTitle icon="receipt_long">Payment History</CardTitle>
        {payments.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No payments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-outline-variant/20">
                <th className="text-left py-2 font-medium text-on-surface-variant">Reference</th>
                <th className="text-left py-2 font-medium text-on-surface-variant">Amount</th>
                <th className="text-left py-2 font-medium text-on-surface-variant">Method</th>
                <th className="text-left py-2 font-medium text-on-surface-variant">Status</th>
                <th className="text-left py-2 font-medium text-on-surface-variant">Date</th>
              </tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-b border-outline-variant/10">
                    <td className="py-2 font-data-mono text-xs text-on-surface">{p.transaction_ref}</td>
                    <td className="py-2 font-semibold text-on-surface font-data-mono">₦{p.amount.toLocaleString()}</td>
                    <td className="py-2 text-on-surface-variant">{p.payment_method}</td>
                    <td className="py-2"><StatusBadge status={p.status} /></td>
                    <td className="py-2 text-on-surface-variant">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
