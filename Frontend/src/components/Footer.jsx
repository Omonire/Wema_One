import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-outline-variant/30">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary-container flex items-center justify-center">
                <span className="text-white font-bold text-sm font-mono">L</span>
              </div>
              <span className="font-headline-md text-xl font-bold tracking-tight text-on-surface">NQB</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-data-mono-xs text-xs font-semibold uppercase">Easy Service</span>
            </div>
            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Non_queue_Bank makes getting help simple, fast, and stress-free for everyday people and businesses.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-data-mono-xs text-xs font-medium border border-outline-variant/30">Verified Safe</span>
              <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-data-mono-xs text-xs font-medium border border-outline-variant/30">Bank-Level Safety</span>
              <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-data-mono-xs text-xs font-medium border border-outline-variant/30">100% Privacy</span>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-label-caps text-xs uppercase text-on-surface-variant font-semibold tracking-wider">Features</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><a href="/#features" className="hover:text-on-surface transition-colors">Chat Support</a></li>
              <li><a href="/#features" className="hover:text-on-surface transition-colors">Line Saver</a></li>
              <li><a href="/#features" className="hover:text-on-surface transition-colors">Paperwork Check</a></li>
              <li><a href="/#features" className="hover:text-on-surface transition-colors">Easy Payments</a></li>
              <li><a href="/#features" className="hover:text-on-surface transition-colors">Staff Help Desk</a></li>
              <li><a href="/#features" className="hover:text-on-surface transition-colors">Live Insights</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-label-caps text-xs uppercase text-on-surface-variant font-semibold tracking-wider">Who We Help</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><a href="/#solutions" className="hover:text-on-surface transition-colors">Banks</a></li>
              <li><a href="/#solutions" className="hover:text-on-surface transition-colors">Hospitals &amp; Clinics</a></li>
              <li><a href="/#solutions" className="hover:text-on-surface transition-colors">Government Offices</a></li>
              <li><a href="/#solutions" className="hover:text-on-surface transition-colors">Phone Companies</a></li>
              <li><a href="/#solutions" className="hover:text-on-surface transition-colors">Online Apps</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-label-caps text-xs uppercase text-on-surface-variant font-semibold tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link to="/about" className="hover:text-on-surface transition-colors">About Us</Link></li>
              <li><a href="/#security" className="hover:text-on-surface transition-colors">Security &amp; Trust</a></li>
              <li><a href="#" className="hover:text-on-surface transition-colors">Privacy Policy</a></li>
              <li><a href="/help" className="hover:text-on-surface transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>&copy; 2026 Non_queue_Bank Technologies. All rights reserved.</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-container-low border border-outline-variant/30 font-data-mono-xs text-xs text-tertiary font-semibold">
            <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
            <span>All Systems Running Smoothly &middot; 99.9% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
