import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#0C2D57] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your WemaOne account</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2D57] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2D57] focus:border-transparent" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#0C2D57] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#0A2445] disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/register" className="text-sm text-[#0C2D57] hover:underline">Create an account</Link>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-2">Demo accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <button onClick={() => { setEmail('david@test.com'); setPassword('password123'); }} className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100">Customer: david@test.com</button>
              <button onClick={() => { setEmail('officer1@wemaone.com'); setPassword('password123'); }} className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100">Officer: officer1@wemaone.com</button>
              <button onClick={() => { setEmail('manager1@wemaone.com'); setPassword('password123'); }} className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100">Manager: manager1@wemaone.com</button>
              <button onClick={() => { setEmail('admin@wemaone.com'); setPassword('password123'); }} className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100">Admin: admin@wemaone.com</button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-1">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
