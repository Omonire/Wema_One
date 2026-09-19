import SvgIcon from '../../components/ui/SvgIcon';
import Reveal from '../../components/ScrollReveal';
import { PageHeader } from '../../components/ui/Elements';

export default function HelpPage() {
  const faqs = [
    { q: 'How do I book an appointment?', a: 'Go to Services, select a service, choose a branch and date, then pick an available time slot.' },
    { q: 'What documents do I need?', a: 'Each service has specific requirements listed. Check the service page before visiting a branch.' },
    { q: 'How does TrustVerify work?', a: 'Upload your documents through the platform. Our AI analyzes them and tells you if they meet requirements before you visit the branch.' },
    { q: 'What is SmartQueue?', a: 'SmartQueue lets you join a digital queue remotely. You get a ticket number, estimated wait time, and can track your position.' },
    { q: 'How do I make a payment?', a: 'Go to Payments, select a service, and pay securely. Your payment is linked to your appointment and queue ticket.' },
    { q: 'Can I give feedback?', a: 'Yes, go to Feedback and share your experience. Our SocialPulse AI analyzes sentiment and categorizes your feedback automatically.' },
    { q: 'What is BranchConnect?', a: 'BranchConnect is an internal knowledge sharing platform where branches share solutions, lessons learned, and customer trends.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        eyebrow="Support"
        title="Help Center"
        subtitle="Find answers to common questions about Non_queue_Bank."
      />

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <Reveal key={i} delay={i * 60} direction="right"
            className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-on-surface mb-2 flex items-center gap-2">
              <SvgIcon name="help" className="text-primary-container text-[18px]" />
              {faq.q}
            </h3>
            <p className="text-sm text-on-surface-variant pl-7">{faq.a}</p>
          </Reveal>
        ))}
      </div>

      <Reveal direction="zoom" delay={200}
        className="bg-surface-container rounded-2xl border border-outline-variant/40 p-6 mt-8 text-center shadow-sm">
        <h3 className="font-semibold text-on-surface mb-2">Still need help?</h3>
        <p className="text-sm text-on-surface-variant mb-3">Contact our support team</p>
        <p className="text-sm font-semibold text-primary font-data-mono">hello@nqb.app • +234 800 NQB-HELP</p>
      </Reveal>
    </div>
  );
}
