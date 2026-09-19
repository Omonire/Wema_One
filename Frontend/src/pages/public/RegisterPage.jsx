import SvgIcon from '../../components/ui/SvgIcon';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Reveal from '../../components/ScrollReveal';
import { Field, Input, Alert } from '../../components/ui/Elements';
import { api } from '../../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', organization_slug: '' });
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/organizations/').then(res => {
      setOrganizations(res.data || []);
    }).catch(() => setOrganizations([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient backlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-primary/10 via-primary-container/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

      <div className="w-full max-w-md">
        <Reveal direction="zoom">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_4px_14px_rgba(0,82,255,0.3)]">
              <span className="text-white font-bold text-lg font-headline-md">L</span>
            </div>
            <h1 className="font-headline-md text-2xl font-bold text-on-surface tracking-tight">Create your account</h1>
            <p className="text-on-surface-variant text-sm mt-1">Join Non_queue_Bank for a connected service experience</p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={120} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-xl">
          {error && <Alert kind="error" className="mb-4">{error}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name">
                <Input type="text" value={form.first_name} onChange={e => update('first_name', e.target.value)} required />
              </Field>
              <Field label="Last Name">
                <Input type="text" value={form.last_name} onChange={e => update('last_name', e.target.value)} required />
              </Field>
            </div>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} required />
            </Field>
            <Field label="Phone">
              <Input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </Field>
            {organizations.length > 0 && (
              <Field label="Organization">
                <select value={form.organization_slug} onChange={e => update('organization_slug', e.target.value)}
                  className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none">
                  <option value="">First available workspace</option>
                  {organizations.map(o => <option key={o.slug} value={o.slug}>{o.name} ({o.type})</option>)}
                </select>
              </Field>
            )}
            <Field label="Password">
              <Input type="password" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} />
            </Field>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-container hover:bg-primary text-white py-2.5 rounded-lg font-semibold text-sm transition-all shadow-[0_2px_8px_rgba(0,82,255,0.25)] disabled:opacity-50 inline-flex items-center justify-center gap-2">
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <SvgIcon name="arrow_forward" className="text-[16px]" />}
            </button>
          </form>
          <div className="mt-4 text-center space-x-3">
            <Link to="/login" className="text-sm text-primary hover:underline font-medium">Sign in</Link>
            <span className="text-on-surface-variant text-sm">·</span>
            <Link to="/workspace" className="text-sm text-primary hover:underline font-medium">Create a workspace</Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
