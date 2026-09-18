import SvgIcon from '../../components/ui/SvgIcon';
import { Link } from 'react-router-dom';
import Reveal from '../../components/ScrollReveal';
import { PageHeader } from '../../components/ui/Elements';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        eyebrow="About Luma"
        title="One journey. One connected experience."
        subtitle="Great customer service, with zero waiting and zero confusion — that's what we're building."
      />

      <div className="space-y-8">
        <Reveal direction="right" className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <SvgIcon name="visibility" className="text-primary-container text-[22px]" />
            <h2 className="text-xl font-bold text-on-surface">Our Vision</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            Luma is a connected service experience platform designed around the complete customer journey.
            The core insight: customers experience problems as ONE journey, even though organizations often handle them as separate problems.
          </p>
        </Reveal>

        <Reveal direction="left" className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <SvgIcon name="report_problem" className="text-error text-[22px]" />
            <h2 className="text-xl font-bold text-on-surface">The Problem</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed mb-3">
            A customer needs a business account. They search for requirements, ask questions, visit a branch, get a queue ticket, wait,
            discover missing documentation, leave frustrated, and complain online. Each step is handled in isolation.
          </p>
          <p className="text-on-surface font-semibold">
            Luma connects that entire journey into one seamless experience.
          </p>
        </Reveal>

        <Reveal direction="up" className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <SvgIcon name="grid_view" className="text-primary-container text-[22px]" />
            <h2 className="text-xl font-bold text-on-surface">Platform Modules</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: 'confirmation_number', name: 'SmartQueue', desc: 'Digital queue and appointment management', bg: 'bg-primary-fixed/40', color: 'text-primary' },
              { icon: 'verified_user', name: 'TrustVerify AI', desc: 'AI-powered document verification', bg: 'bg-tertiary-fixed/40', color: 'text-tertiary' },
              { icon: 'payments', name: 'Easy Pay', desc: 'Integrated payment processing', bg: 'bg-primary-fixed/40', color: 'text-primary' },
              { icon: 'forum', name: 'SocialPulse', desc: 'AI feedback intelligence and sentiment analysis', bg: 'bg-tertiary-fixed/40', color: 'text-tertiary' },
              { icon: 'hub', name: 'BranchConnect', desc: 'Internal branch knowledge sharing', bg: 'bg-primary-fixed/40', color: 'text-primary' },
              { icon: 'insights', name: 'Luma Intelligence', desc: 'Executive analytics dashboard', bg: 'bg-tertiary-fixed/40', color: 'text-tertiary' },
            ].map((m, i) => (
              <Reveal key={m.name} delay={i * 70} className={`p-4 rounded-xl ${m.bg} flex items-start gap-3`}>
                <SvgIcon name={m.icon} size={22} className={m.color} />
                <div>
                  <h3 className="font-semibold text-on-surface">{m.name}</h3>
                  <p className="text-sm text-on-surface-variant">{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal direction="zoom" className="text-center pt-4">
          <Link to="/services" className="inline-flex items-center gap-2 h-12 px-8 rounded-lg bg-primary-container hover:bg-primary text-white text-base font-semibold transition-all shadow-[0_4px_14px_rgba(0,82,255,0.3)] hover:-translate-y-0.5">
            Get Started Free
            <SvgIcon name="arrow_forward" className="text-[18px]" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
