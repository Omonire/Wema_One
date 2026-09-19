import SvgIcon from './ui/SvgIcon';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const publicLinks = [
  { to: '#features', label: 'Features' },
  { to: '#how-it-works', label: 'How It Works' },
  { to: '#helpdesk', label: 'Helpdesk' },
  { to: '#security', label: 'Security' },
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
  const [scrolled, setScrolled] = useState(false);

  const isLanding = location.pathname === '/';

  useEffect(() => {
    if (!isLanding) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLanding]);

  const overHero = isLanding && !scrolled;

  const getLinks = () => {
    if (!user) return publicLinks;
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return adminLinks;
    if (user.role === 'BRANCH_OFFICER' || user.role === 'BRANCH_MANAGER') return branchLinks;
    return customerLinks;
  };

  const links = getLinks();

  // On the landing page, hash links scroll in-place; from other pages, route home first.
  const resolveHref = (to) => (to.startsWith('#') && !isLanding ? `/${to}` : to);

  const navBg = overHero
    ? 'bg-transparent border-transparent'
    : isLanding
      ? 'bg-surface-container-lowest/85 backdrop-blur-md border-outline-variant/30'
      : 'bg-white border-gray-200';

  const brandText = overHero ? 'text-primary-fixed-dim' : isLanding ? 'text-primary' : 'text-[#0F172A]';
  const bodyText = overHero ? 'text-primary-fixed-dim hover:text-white' : isLanding ? 'text-primary hover:text-primary-container' : 'text-gray-600 hover:text-gray-900';
  const custName = overHero ? 'text-primary-fixed-dim' : isLanding ? 'text-primary' : 'text-gray-900';
  const custRole = overHero ? 'text-white/60' : isLanding ? 'text-on-surface-variant' : 'text-gray-400';
  const menuBtn = overHero ? 'text-primary-fixed-dim' : isLanding ? 'text-primary' : 'text-gray-900';
  const badge = overHero
    ? 'bg-primary-fixed-dim/15 text-primary-fixed-dim border border-primary-fixed-dim/30'
    : 'bg-surface-container text-primary';

  return (
    <nav className={`${navBg} border-b sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">L</span>
            </div>
            <span className={`text-xl font-bold tracking-tight font-headline-md ${brandText}`}>NQB</span>
          </Link>
          <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-md font-data-mono-xs text-xs font-semibold uppercase tracking-wider ${badge}`}>Enterprise</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map(link => (
            <a key={link.to} href={resolveHref(link.to)}
              className={`transition-colors ${bodyText}`}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user.first_name?.[0]}{user.last_name?.[0]}</span>
                </div>
                <div>
                  <div className={`text-sm font-medium ${custName}`}>{user.first_name}</div>
                  <div className={`text-[11px] ${custRole}`}>{user.role.replace(/_/g, ' ')}</div>
                </div>
              </div>
              <button onClick={logout} className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${
                overHero ? 'text-primary-fixed-dim border-primary-fixed-dim/30 hover:text-white' : isLanding ? 'text-primary border-outline-variant/60 hover:text-primary-container' : 'text-gray-500 border-gray-200 hover:text-red-600'
              }`}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`hidden sm:inline-flex items-center text-sm font-medium px-3 py-1.5 transition-colors ${overHero ? 'text-primary-fixed-dim hover:text-white' : bodyText}`}>Sign In</Link>
              <Link to="/workspace" className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-lg bg-primary-container hover:bg-primary text-white text-sm font-semibold transition-all shadow-[0_2px_8px_rgba(0,82,255,0.25)]">
                <span>Get Started Free</span>
                <SvgIcon name="arrow_forward" className="text-[16px]" />
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 rounded-lg ${menuBtn}`}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className={`md:hidden pb-4 border-t bg-surface-container-lowest ${isLanding ? 'border-outline-variant/30' : 'border-gray-100'}`}>
          <div className="flex flex-col gap-1 pt-3 px-6">
            {links.map(link => (
              <a key={link.to} href={resolveHref(link.to)} onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface">
                {link.label}
              </a>
            ))}
            {!user && (
              <div className="flex gap-3 mt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-on-surface-variant">Sign In</Link>
                <Link to="/workspace" onClick={() => setMobileOpen(false)} className="text-sm font-semibold bg-primary-container text-white px-4 py-1.5 rounded-lg">Get Started Free</Link>
              </div>
            )}
            {user && (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-error px-3 py-2 text-left">Logout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}