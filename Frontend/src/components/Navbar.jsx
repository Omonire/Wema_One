import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/branches', label: 'Branches' },
  { to: '/about', label: 'About' },
];

const customerLinks = [
  { to: '/customer', label: 'Dashboard' },
  { to: '/customer/queue', label: 'Queue' },
  { to: '/customer/documents', label: 'Documents' },
  { to: '/customer/payments', label: 'Payments' },
  { to: '/customer/feedback', label: 'Feedback' },
];

const branchLinks = [
  { to: '/branch', label: 'Dashboard' },
  { to: '/branch/appointments', label: 'Appointments' },
  { to: '/branch/documents', label: 'Doc Review' },
  { to: '/branch/feedback', label: 'Feedback' },
  { to: '/branch/connect', label: 'BranchConnect' },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/branches', label: 'Branches' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/feedback', label: 'Feedback' },
  { to: '/admin/documents', label: 'Documents' },
  { to: '/admin/branch-connect', label: 'BranchConnect' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getLinks = () => {
    if (!user) return publicLinks;
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return adminLinks;
    if (user.role === 'BRANCH_OFFICER' || user.role === 'BRANCH_MANAGER') return branchLinks;
    return customerLinks;
  };

  const links = getLinks();
  const isLanding = location.pathname === '/';

  return (
    <nav className={`${isLanding ? 'bg-[#0F172A]/80 backdrop-blur-xl border-slate-800/50' : 'bg-white border-gray-200'} border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                <span className="text-[#0F172A] font-bold text-sm">W</span>
              </div>
              <span className={`text-xl font-bold ${isLanding ? 'text-white' : 'text-[#0F172A]'}`}>WemaOne</span>
            </Link>
            <div className="hidden lg:flex gap-1">
              {links.map(link => (
                <Link key={link.to} to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? isLanding ? 'bg-white/10 text-[#F59E0B]' : 'bg-[#0F172A]/5 text-[#0F172A]'
                      : isLanding ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-[#0F172A] hover:bg-gray-50'
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center">
                    <span className="text-[#0F172A] text-xs font-bold">{user.first_name?.[0]}{user.last_name?.[0]}</span>
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${isLanding ? 'text-white' : 'text-gray-900'}`}>{user.first_name}</div>
                    <div className={`text-[11px] ${isLanding ? 'text-slate-500' : 'text-gray-400'}`}>{user.role.replace(/_/g, ' ')}</div>
                  </div>
                </div>
                <button onClick={logout} className={`text-sm px-3 py-1.5 rounded-lg border transition-all duration-200 ${isLanding ? 'text-slate-400 border-slate-700 hover:text-white hover:border-slate-500' : 'text-gray-500 border-gray-200 hover:text-red-600 hover:border-red-200'}`}>
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${isLanding ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-[#0F172A]'}`}>
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium bg-[#F59E0B] text-[#0F172A] px-5 py-2 rounded-lg hover:bg-[#D97706] transition-all duration-200">
                  Register
                </Link>
              </div>
            )}
          </div>
          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden p-2 rounded-lg ${isLanding ? 'text-white' : 'text-gray-900'}`}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {/* Mobile menu */}
        {mobileOpen && (
          <div className={`lg:hidden pb-4 border-t ${isLanding ? 'border-slate-800' : 'border-gray-100'}`}>
            <div className="flex flex-col gap-1 pt-3">
              {links.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === link.to
                      ? isLanding ? 'bg-white/10 text-[#F59E0B]' : 'bg-gray-100 text-[#0F172A]'
                      : isLanding ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="flex gap-3 mt-2 px-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className={`text-sm font-medium ${isLanding ? 'text-slate-300' : 'text-gray-600'}`}>Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm font-medium bg-[#F59E0B] text-[#0F172A] px-4 py-1.5 rounded-lg">Register</Link>
                </div>
              )}
              {user && (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-red-500 px-3 py-2 text-left">Logout</button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
