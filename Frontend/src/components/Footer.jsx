import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-on-primary font-bold text-sm font-mono">W</span>
              </div>
              <span className="text-lg font-bold text-on-surface font-headline">WemaOne</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">One Customer Journey. One Connected Banking Ecosystem. One Intelligence Layer.</p>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface text-sm mb-4">Platform</h4>
            <div className="space-y-2.5">
              <Link to="/services" className="block text-on-surface-variant hover:text-primary text-sm transition-colors">Services</Link>
              <Link to="/branches" className="block text-on-surface-variant hover:text-primary text-sm transition-colors">Branches</Link>
              <Link to="/about" className="block text-on-surface-variant hover:text-primary text-sm transition-colors">About</Link>
              <Link to="/login" className="block text-on-surface-variant hover:text-primary text-sm transition-colors">Login</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface text-sm mb-4">Modules</h4>
            <div className="space-y-2.5 text-on-surface-variant text-sm">
              <p>SmartQueue</p>
              <p>TrustVerify AI</p>
              <p>WemaPay</p>
              <p>SocialPulse</p>
              <p>BranchConnect</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface text-sm mb-4">Contact</h4>
            <div className="space-y-2.5 text-on-surface-variant text-sm">
              <p>support@wemaone.com</p>
              <p>+234 800 WEMAONE</p>
              <p>Lagos, Nigeria</p>
            </div>
          </div>
        </div>
        <div className="border-t border-outline-variant/30 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-sm">&copy; 2026 WemaOne. Connected Banking Intelligence Platform.</p>
          <div className="flex gap-6 text-on-surface-variant text-sm">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
