import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Zap, Users, BarChart3, FileCheck, CreditCard, MessageSquare, GitBranch, ChevronRight, CircleDot } from 'lucide-react';

const journeySteps = [
  { icon: CircleDot, label: 'Discover', desc: 'Find services & requirements' },
  { icon: CheckCircle2, label: 'Book', desc: 'Schedule appointments' },
  { icon: FileCheck, label: 'Verify', desc: 'Upload & verify documents' },
  { icon: CreditCard, label: 'Pay', desc: 'Secure payments via WemaPay' },
  { icon: Users, label: 'Visit', desc: 'Arrive prepared at branch' },
  { icon: Zap, label: 'Serve', desc: 'Get served efficiently' },
  { icon: MessageSquare, label: 'Feedback', desc: 'Share your experience' },
  { icon: BarChart3, label: 'Intelligence', desc: 'Drive operational improvement' },
];

const modules = [
  { icon: Zap, name: 'SmartQueue', desc: 'Digital queue and appointment management. Book ahead, skip the wait.' },
  { icon: Shield, name: 'TrustVerify AI', desc: 'AI-powered document verification. Know your status before you visit.' },
  { icon: CreditCard, name: 'WemaPay', desc: 'Integrated payment processing. Pay service fees securely.' },
  { icon: BarChart3, name: 'SocialPulse', desc: 'AI feedback intelligence. Understand customer sentiment in real time.' },
  { icon: GitBranch, name: 'BranchConnect', desc: 'Internal knowledge sharing. Solutions that scale across branches.' },
  { icon: FileCheck, name: 'WemaOne Intelligence', desc: 'Executive analytics dashboard. Data-driven decisions.' },
];

const stats = [
  { value: '5', label: 'Branches Connected' },
  { value: '6', label: 'Services Available' },
  { value: '99.9%', label: 'Platform Uptime' },
  { value: '< 2min', label: 'Avg. Verification' },
];

export default function LandingPage() {
  return (
    <div className="bg-[#0F172A] text-white min-h-screen">
      {/* Navigation is handled by Navbar component */}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1a2540] to-[#0F172A]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#F59E0B]/5 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
              <span className="text-[#F59E0B] text-xs font-medium tracking-wide">CONNECTED BANKING INTELLIGENCE</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
              One Customer Journey.<br />
              <span className="text-[#F59E0B]">One Connected Ecosystem.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
              WemaOne connects customers, branches, payments, documents and intelligence into one seamless banking experience.
              One intelligence layer powering better decisions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services" className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] px-7 py-3.5 rounded-lg font-semibold hover:bg-[#D97706] transition-all duration-200 text-sm">
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 border border-slate-600 text-white px-7 py-3.5 rounded-lg font-medium hover:border-slate-400 hover:bg-white/5 transition-all duration-200 text-sm">
                Explore How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-slate-800 bg-[#0c1322]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className={`py-8 px-6 text-center ${i < 3 ? 'border-r border-slate-800' : ''}`}>
                <div className="text-2xl md:text-3xl font-bold text-[#F59E0B] mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Connected Journey</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Every step is connected. Every touchpoint generates intelligence. Every insight drives improvement.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {journeySteps.map((step, i) => (
              <div key={i} className="group relative bg-[#151d2e] border border-slate-800 rounded-xl p-6 hover:border-[#F59E0B]/30 transition-all duration-300">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#0F172A] border border-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-slate-500 font-medium">{i + 1}</span>
                </div>
                <step.icon className="w-6 h-6 text-[#F59E0B] mb-4" strokeWidth={1.5} />
                <h3 className="font-semibold text-white mb-1 text-sm">{step.label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                {i < journeySteps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-4 w-4 h-4 text-slate-700 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 md:py-28 bg-[#0c1322]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Modules</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Each module is powerful alone. Together, they form one intelligent banking ecosystem.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m, i) => (
              <div key={i} className="group bg-[#151d2e] border border-slate-800 rounded-xl p-7 hover:border-[#F59E0B]/30 transition-all duration-300">
                <div className="w-11 h-11 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center mb-5">
                  <m.icon className="w-5 h-5 text-[#F59E0B]" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-white mb-2">{m.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="relative">
              <div className="w-12 h-12 bg-[#F59E0B] rounded-xl flex items-center justify-center mb-5">
                <span className="text-[#0F172A] font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Plan Ahead</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Check requirements, book appointments, and upload documents before visiting the branch. No surprises.</p>
              <div className="hidden md:block absolute top-6 right-0 w-16 h-px bg-slate-800"></div>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-[#F59E0B] rounded-xl flex items-center justify-center mb-5">
                <span className="text-[#0F172A] font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Arrive Prepared</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Your documents are pre-verified. Your queue position is secured. Your fee is paid. Walk in with confidence.</p>
              <div className="hidden md:block absolute top-6 right-0 w-16 h-px bg-slate-800"></div>
            </div>
            <div>
              <div className="w-12 h-12 bg-[#F59E0B] rounded-xl flex items-center justify-center mb-5">
                <span className="text-[#0F172A] font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Get Served Faster</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Walk in, get served, and leave feedback. Every interaction improves the experience for the next customer.</p>
            </div>
          </div>
          <div className="text-center mt-14">
            <Link to="/register" className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] px-8 py-3.5 rounded-lg font-semibold hover:bg-[#D97706] transition-all duration-200 text-sm">
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 md:py-28 bg-[#0c1322] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">"Customers frequently arrived without required documents."</div>
              <p className="text-slate-500 text-sm mt-4">BranchConnect Solution</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">"Fewer incomplete applications. Higher satisfaction."</div>
              <p className="text-slate-500 text-sm mt-4"> measurable Results</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">"8 branches now share solutions seamlessly."</div>
              <p className="text-slate-500 text-sm mt-4">Network Effect</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#1a2540] to-[#151d2e] border border-slate-800 rounded-2xl p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your banking experience?</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 text-lg">Join WemaOne and experience the future of connected banking intelligence.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#0F172A] px-8 py-3.5 rounded-lg font-semibold hover:bg-[#D97706] transition-all duration-200 text-sm">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 border border-slate-600 text-white px-8 py-3.5 rounded-lg font-medium hover:border-slate-400 hover:bg-white/5 transition-all duration-200 text-sm">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
