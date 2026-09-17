import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1a] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                <span className="text-[#0F172A] font-bold text-sm">W</span>
              </div>
              <span className="text-lg font-bold text-white">WemaOne</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">One Customer Journey. One Connected Banking Ecosystem. One Intelligence Layer.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Platform</h4>
            <div className="space-y-2.5">
              <Link to="/services" className="block text-slate-500 hover:text-white text-sm transition-colors">Services</Link>
              <Link to="/branches" className="block text-slate-500 hover:text-white text-sm transition-colors">Branches</Link>
              <Link to="/about" className="block text-slate-500 hover:text-white text-sm transition-colors">About</Link>
              <Link to="/login" className="block text-slate-500 hover:text-white text-sm transition-colors">Login</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Modules</h4>
            <div className="space-y-2.5 text-slate-500 text-sm">
              <p>SmartQueue</p>
              <p>TrustVerify AI</p>
              <p>WemaPay</p>
              <p>SocialPulse</p>
              <p>BranchConnect</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Contact</h4>
            <div className="space-y-2.5 text-slate-500 text-sm">
              <p>support@wemaone.com</p>
              <p>+234 800 WEMAONE</p>
              <p>Lagos, Nigeria</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">&copy; 2026 WemaOne. Connected Banking Intelligence Platform.</p>
          <div className="flex gap-6 text-slate-600 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
