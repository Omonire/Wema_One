import SvgIcon from '../../components/ui/SvgIcon';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Reveal from '../../components/ScrollReveal';
import { Field, Input, Alert } from '../../components/ui/Elements';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Customer', email: 'david@test.com' },
    { label: 'Officer', email: 'officer1@nqb.app' },
    { label: 'Manager', email: 'manager1@nqb.app' },
    { label: 'Admin', email: 'admin@nqb.app' },
  ];

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
            <h1 className="font-headline-md text-2xl font-bold text-on-surface tracking-tight">Welcome back</h1>
            <p className="text-on-surface-variant text-sm mt-1">Sign in to your Non_queue_Bank account</p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={120} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-xl">
          {error && <Alert kind="error" className="mb-4">{error}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email">
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </Field>
            <Field label="Password">
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </Field>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-container hover:bg-primary text-white py-2.5 rounded-lg font-semibold text-sm transition-all shadow-[0_2px_8px_rgba(0,82,255,0.25)] disabled:opacity-50 inline-flex items-center justify-center gap-2">
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <SvgIcon name="arrow_forward" className="text-[16px]" />}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/register" className="text-sm text-primary hover:underline font-medium">Create an account</Link>
          </div>
          <div className="mt-4 pt-4 border-t border-outline-variant/20">
            <p className="text-xs text-on-surface-variant text-center mb-2 font-data-mono-xs uppercase tracking-wider">Demo accounts</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {demoAccounts.map(acc => (
                <button key={acc.email} onClick={() => { setEmail(acc.email); setPassword('password123'); }}
                  className="text-left p-2 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface">
                  <span className="font-semibold text-primary">{acc.label}:</span> {acc.email}
                </button>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant text-center mt-2 font-data-mono-xs">Password: password123</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
