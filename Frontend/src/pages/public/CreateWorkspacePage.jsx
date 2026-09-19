import SvgIcon from '../../components/ui/SvgIcon';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Reveal from '../../components/ScrollReveal';
import { Field, Input, Alert } from '../../components/ui/Elements';

const ORG_TYPES = ['BANK', 'HOSPITAL', 'GOVERNMENT', 'TELECOM', 'INSURANCE', 'OTHER'];

export default function CreateWorkspacePage() {
  const [form, setForm] = useState({
    name: '', type: 'BANK',
    email: '', password: '',
    first_name: '', last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { createWorkspace } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await createWorkspace(form);
      navigate(res.data?.organization?.type === 'BANK' ? '/admin' : '/'); 
    } catch (err) {
      setError(err.message || 'Could not create workspace');
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-primary/10 via-primary-container/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

      <div className="w-full max-w-2xl">
        <Reveal direction="zoom">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_4px_14px_rgba(0,82,255,0.3)]">
              <SvgIcon name="building2" className="text-white text-[22px]" />
            </div>
            <h1 className="font-headline-md text-2xl font-bold text-on-surface tracking-tight">Create your workspace</h1>
            <p className="text-on-surface-variant text-sm mt-1">Spin up a Luma workspace for your organization in under a minute</p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={120} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-xl">
          {error && <Alert kind="error" className="mb-4">{error}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Organization Name">
                <Input type="text" placeholder="e.g. Skyline Bank" value={form.name} onChange={e => update('name', e.target.value)} required />
              </Field>
              <Field label="Industry">
                <select value={form.type} onChange={e => update('type', e.target.value)}
                  className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none">
                  {ORG_TYPES.map(t => <option key={t} value={t}>{t[0] + t.slice(1).toLowerCase()}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Workspace Admin First Name">
                <Input type="text" value={form.first_name} onChange={e => update('first_name', e.target.value)} required />
              </Field>
              <Field label="Workspace Admin Last Name">
                <Input type="text" value={form.last_name} onChange={e => update('last_name', e.target.value)} required />
              </Field>
            </div>
            <Field label="Admin Email">
              <Input type="email" placeholder="you@yourbank.com" value={form.email} onChange={e => update('email', e.target.value)} required />
            </Field>
            <Field label="Password">
              <Input type="password" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} />
            </Field>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-container hover:bg-primary text-white py-2.5 rounded-lg font-semibold text-sm transition-all shadow-[0_2px_8px_rgba(0,82,255,0.25)] disabled:opacity-50 inline-flex items-center justify-center gap-2">
              {loading ? 'Creating workspace...' : 'Create Workspace'}
              {!loading && <SvgIcon name="arrow_forward" className="text-[16px]" />}
            </button>
          </form>
          <div className="mt-4 text-center space-x-3">
            <Link to="/login" className="text-sm text-primary hover:underline font-medium">Sign in</Link>
            <span className="text-on-surface-variant text-sm">·</span>
            <Link to="/register" className="text-sm text-primary hover:underline font-medium">Join as a customer</Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}