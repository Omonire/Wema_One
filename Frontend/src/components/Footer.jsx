import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0C2D57] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#0C2D57] font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold">WemaOne</span>
            </div>
            <p className="text-blue-200 text-sm">One Customer Journey. One Connected Banking Ecosystem.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <div className="space-y-2">
              <Link to="/services" className="block text-blue-200 hover:text-white text-sm">Services</Link>
              <Link to="/branches" className="block text-blue-200 hover:text-white text-sm">Branches</Link>
              <Link to="/login" className="block text-blue-200 hover:text-white text-sm">Login</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Modules</h4>
            <div className="space-y-2 text-blue-200 text-sm">
              <p>SmartQueue</p>
              <p>TrustVerify AI</p>
              <p>WemaPay</p>
              <p>SocialPulse</p>
              <p>BranchConnect</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-blue-200 text-sm">
              <p>support@wemaone.com</p>
              <p>+234 800 WEMAONE</p>
              <p>Lagos, Nigeria</p>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300 text-sm">
          © 2026 WemaOne. Connected Banking Intelligence Platform.
        </div>
      </div>
    </footer>
  );
}
