import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About WemaOne</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          One Customer Journey. One Connected Banking Ecosystem. One Intelligence Layer Powering Better Decisions.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h2>
          <p className="text-gray-600">
            WemaOne is a connected digital banking experience and intelligence platform designed around the complete customer journey.
            The core insight: customers experience banking problems as ONE journey, even though banks often handle them as separate problems.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">The Problem</h2>
          <p className="text-gray-600 mb-3">
            A customer needs a business account. They search for requirements, ask questions, visit a branch, get a queue ticket, wait,
            discover missing documentation, leave frustrated, and complain online. Each step is handled in isolation.
          </p>
          <p className="text-gray-600">
            WemaOne connects that entire journey into one seamless experience.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Platform Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">SmartQueue</h3>
              <p className="text-sm text-gray-600">Digital queue and appointment management</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">TrustVerify AI</h3>
              <p className="text-sm text-gray-600">AI-powered document verification</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">WemaPay</h3>
              <p className="text-sm text-gray-600">Integrated payment processing</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">SocialPulse</h3>
              <p className="text-sm text-gray-600">AI feedback intelligence and sentiment analysis</p>
            </div>
            <div className="p-4 bg-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">BranchConnect</h3>
              <p className="text-sm text-gray-600">Internal branch knowledge sharing</p>
            </div>
            <div className="p-4 bg-rose-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">WemaOne Intelligence</h3>
              <p className="text-sm text-gray-600">Executive analytics dashboard</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/services" className="bg-[#0C2D57] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0A2445] transition inline-block">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
