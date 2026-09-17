import { Link } from 'react-router-dom';

const journeySteps = [
  { step: 'DISCOVER', desc: 'Find services & requirements' },
  { step: 'BOOK', desc: 'Schedule appointments' },
  { step: 'VERIFY', desc: 'Upload & verify documents' },
  { step: 'PAY', desc: 'Secure payments via WemaPay' },
  { step: 'VISIT', desc: 'Arrive prepared at branch' },
  { step: 'SERVE', desc: 'Get served efficiently' },
  { step: 'FEEDBACK', desc: 'Share your experience' },
  { step: 'INTELLIGENCE', desc: 'Drive operational improvement' },
];

const modules = [
  { name: 'SmartQueue', desc: 'Digital queue and appointment management. Book ahead, skip the wait.', color: 'bg-blue-50 border-blue-200' },
  { name: 'TrustVerify AI', desc: 'AI-powered document verification. Know your status before you visit.', color: 'bg-green-50 border-green-200' },
  { name: 'WemaPay', desc: 'Integrated payment processing. Pay service fees securely.', color: 'bg-purple-50 border-purple-200' },
  { name: 'SocialPulse', desc: 'AI feedback intelligence. Understand customer sentiment.', color: 'bg-orange-50 border-orange-200' },
  { name: 'BranchConnect', desc: 'Internal knowledge sharing. Solutions that scale across branches.', color: 'bg-cyan-50 border-cyan-200' },
  { name: 'WemaOne Intelligence', desc: 'Executive analytics dashboard. Data-driven decisions.', color: 'bg-rose-50 border-rose-200' },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0C2D57] to-[#1a4080] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-medium text-sm mb-4 tracking-wide uppercase">Connected Banking Intelligence Platform</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              One Customer Journey.<br />One Connected Banking Ecosystem.
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl">
              WemaOne connects customers, branches, payments, documents and intelligence into one seamless banking experience. One intelligence layer powering better decisions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services" className="bg-white text-[#0C2D57] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                Start Your Journey
              </Link>
              <Link to="/register" className="border border-blue-300 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">The Connected Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Every step is connected. Every touchpoint generates intelligence. Every insight drives improvement.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {journeySteps.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 text-center relative">
                <div className="text-xs text-gray-400 mb-2">Step {i + 1}</div>
                <div className="text-lg font-bold text-[#0C2D57] mb-1">{s.step}</div>
                <div className="text-sm text-gray-500">{s.desc}</div>
                {i < journeySteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-gray-300 text-lg">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Platform Modules</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Each module is powerful alone. Together, they form one intelligent banking ecosystem.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((m, i) => (
              <div key={i} className={`${m.color} border rounded-xl p-6 hover:shadow-md transition`}>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{m.name}</h3>
                <p className="text-gray-600 text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0C2D57] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Plan Ahead</h3>
              <p className="text-gray-600 text-sm">Check requirements, book appointments, and upload documents before visiting the branch.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0C2D57] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Arrive Prepared</h3>
              <p className="text-gray-600 text-sm">Your documents are pre-verified. Your queue position is secured. Your fee is paid.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0C2D57] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Get Served Faster</h3>
              <p className="text-gray-600 text-sm">Walk in, get served, and leave feedback. Every interaction improves the experience.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="bg-[#0C2D57] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0A2445] transition inline-block">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
