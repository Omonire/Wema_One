export default function HelpPage() {
  const faqs = [
    { q: 'How do I book an appointment?', a: 'Go to Services, select a service, choose a branch and date, then pick an available time slot.' },
    { q: 'What documents do I need?', a: 'Each service has specific requirements listed. Check the service page before visiting a branch.' },
    { q: 'How does TrustVerify work?', a: 'Upload your documents through the platform. Our AI analyzes them and tells you if they meet requirements before you visit the branch.' },
    { q: 'What is SmartQueue?', a: 'SmartQueue lets you join a digital queue remotely. You get a ticket number, estimated wait time, and can track your position.' },
    { q: 'How do I make a payment?', a: 'Go to Payments, select a service, and pay through WemaPay sandbox. Your payment is linked to your appointment and queue ticket.' },
    { q: 'Can I give feedback?', a: 'Yes, go to Feedback and share your experience. Our SocialPulse AI analyzes sentiment and categorizes your feedback automatically.' },
    { q: 'What is BranchConnect?', a: 'BranchConnect is an internal knowledge sharing platform where branches share solutions, lessons learned, and customer trends.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-gray-600">Find answers to common questions about WemaOne.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
            <p className="text-sm text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8 text-center">
        <h3 className="font-semibold text-gray-900 mb-2">Still need help?</h3>
        <p className="text-sm text-gray-600 mb-3">Contact our support team</p>
        <p className="text-sm font-medium text-[#0C2D57]">support@wemaone.com • +234 800 WEMAONE</p>
      </div>
    </div>
  );
}
