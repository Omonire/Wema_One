import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/branches', label: 'Branches' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0C2D57] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold text-[#0C2D57]">WemaOne</span>
            </Link>
            <div className="hidden md:flex gap-6">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`text-sm font-medium transition-colors ${location.pathname === link.to ? 'text-[#0C2D57]' : 'text-gray-600 hover:text-[#0C2D57]'}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to={user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '/admin' : user.role === 'BRANCH_OFFICER' || user.role === 'BRANCH_MANAGER' ? '/branch' : '/dashboard'}
                  className="text-sm font-medium text-gray-600 hover:text-[#0C2D57]">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0C2D57] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{user.first_name?.[0]}{user.last_name?.[0]}</span>
                  </div>
                  <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#0C2D57]">Login</Link>
                <Link to="/register" className="text-sm font-medium bg-[#0C2D57] text-white px-4 py-2 rounded-lg hover:bg-[#0A2445]">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
