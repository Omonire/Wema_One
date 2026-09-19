import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../../components/ScrollReveal';
import SvgIcon from '../../components/ui/SvgIcon';

const LIFECYCLE_STEPS = [
  { label: 'Start', icon: 'confirmation_number', caption: 'Ticket #WMA-2841 created — your spot is saved from home.' },
  { label: 'Choose Time', icon: 'schedule', caption: 'Arrival set for 10:30 AM — desk 4 is reserved for you.' },
  { label: 'Check Papers', icon: 'verified_user', caption: 'ID & documents pre-approved — nothing is missing.' },
  { label: 'Pay Fee', icon: 'payments', caption: '$45.00 paid instantly — receipt sent to your phone.' },
  { label: 'Walk In', icon: 'directions_walk', caption: "You're 3rd in line — about 6 minutes to your desk." },
  { label: 'Get Served', icon: 'support_agent', caption: 'Your officer already has your file open — zero re-explaining.' },
  { label: 'Done Happy', icon: 'sentiment_very_satisfied', caption: 'Visit complete in 14 minutes — feedback texted to you. ⭐' },
];

const FAQS = [
  {
    q: 'Do I still need to visit the office at all?',
    a: 'Only for the few minutes that truly need to be in person. Booking, paperwork checks, and payments all happen from your phone first — so your visit is short and everything is ready when you arrive.',
  },
  {
    q: 'How do I save my spot in the line?',
    a: 'Message us on WhatsApp or book online, and you get a digital ticket with your live position. Luma tells you when to leave home so you arrive right when your seat is ready.',
  },
  {
    q: 'What happens if I forget a document?',
    a: "You won't get turned away. Snap photos of your ID and forms before you travel — Luma checks them instantly and tells you exactly what's missing while you're still at home.",
  },
  {
    q: 'Is my personal information safe?',
    a: 'Yes. Your details are protected with bank-grade encryption, only the staff member helping you can see your file, and every record is stamped and tamper-proof.',
  },
  {
    q: 'Does using Luma cost anything?',
    a: 'Luma is free for customers. Any service fees are shown upfront before you pay — no hidden charges, and your receipt lands on your phone instantly.',
  },
  {
    q: 'Which organizations use Luma?',
    a: 'Banks, hospitals and clinics, government offices, phone companies, and online apps — anywhere people used to wait in lines to get served.',
  },
];

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const videoRef = useRef(null);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [videoOk, setVideoOk] = useState(true);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = videoSpeed;
  }, [videoSpeed]);

  // Auto-advance the lifecycle rail like a live demo (pauses longer on the final step).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ms = activeStep === LIFECYCLE_STEPS.length - 1 ? 2400 : 1500;
    const t = setTimeout(() => setActiveStep((s) => (s + 1) % LIFECYCLE_STEPS.length), ms);
    return () => clearTimeout(t);
  }, [activeStep]);

  const railProgress = activeStep / (LIFECYCLE_STEPS.length - 1);
  const currentStep = LIFECYCLE_STEPS[activeStep];

  return (
    <div className="bg-surface text-on-surface">
      {/* 1. HERO — FULL-BLEED VIDEO */}
      <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#0A0D14]">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={(e) => {
            setVideoOk(false);
            e.currentTarget.remove();
          }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          aria-hidden="true"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Hero video speed toggle */}
        {videoOk && (
          <div
            role="group"
            aria-label="Hero video playback speed"
            className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 p-1 backdrop-blur-sm"
          >
            <SvgIcon name="speed" size={16} className="px-1.5 text-white/60" />
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setVideoSpeed(s)}
                aria-pressed={videoSpeed === s}
                className={`h-7 min-w-9 rounded-md px-1.5 font-data-mono-xs text-[11px] font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white ${
                  videoSpeed === s ? 'bg-white text-[#0A0D14]' : 'text-white/70 hover:bg-white/15 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        )}

        {/* Overlays: flat tint + bottom-up gradient for legibility */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/55 to-transparent pointer-events-none" aria-hidden="true"></div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12 pb-24 pt-36">
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 font-data-mono-xs text-[11px] uppercase tracking-[0.3em] text-tertiary-fixed-dim sm:text-xs">
              <span className="inline-block size-1.5 rounded-full bg-tertiary-fixed-dim" aria-hidden="true"></span>
              Luma Enterprise · Customer Service for the Digital Economy
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="max-w-4xl font-display-lg text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight text-white">
              One connected experience.
              <br />
              <span className="bg-gradient-to-r from-primary-fixed-dim via-tertiary-fixed-dim to-primary-fixed-dim bg-clip-text text-transparent">
                Zero waiting games.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/70">
              Luma connects appointments, paperwork, payments, and live help behind one queue — so customers never wait
              twice and staff never repeat themselves.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-lg bg-primary-container hover:bg-primary text-white text-base font-semibold transition-all shadow-[0_4px_14px_rgba(0,82,255,0.4)] hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <SvgIcon name="arrow_forward" size={18} className="shrink-0" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-white/10 hover:bg-white/20 text-white text-base font-semibold border border-white/25 backdrop-blur-sm transition-all"
              >
                See How It Works
              </a>
            </div>
          </Reveal>

          {/* Trust strip */}
          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/15 pt-6">
              <span className="flex items-center gap-2">
                <span className="flex text-tertiary-fixed-dim" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </span>
                <span className="font-data-mono-xs text-xs uppercase tracking-widest text-white/60">4.9 rated · 42 offices</span>
              </span>
              <span className="font-data-mono-xs text-xs uppercase tracking-widest text-white/60">99.9% paperwork approved first time</span>
              <span className="font-data-mono-xs text-xs uppercase tracking-widest text-white/60">4 min average wait</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. TRUSTED SECTORS & SECURITY BAR */}
      <section className="w-full bg-surface-container-lowest py-10 border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Sectors Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-on-surface-variant text-sm font-medium">
              <span className="text-xs uppercase font-bold tracking-wider text-on-surface">Trusted by everyday services you use:</span>
              <span className="flex items-center gap-1.5"><SvgIcon name="account_balance" size={18} className="text-primary-container shrink-0" /> Banks</span>
              <span className="flex items-center gap-1.5"><SvgIcon name="local_hospital" size={18} className="text-primary-container shrink-0" /> Hospitals &amp; Clinics</span>
              <span className="flex items-center gap-1.5"><SvgIcon name="policy" size={18} className="text-primary-container shrink-0" /> Government Offices</span>
              <span className="flex items-center gap-1.5"><SvgIcon name="cell_tower" size={18} className="text-primary-container shrink-0" /> Phone Companies</span>
              <span className="flex items-center gap-1.5"><SvgIcon name="token" size={18} className="text-primary-container shrink-0" /> Online Apps</span>
            </div>
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <span className="px-3 py-1 rounded-md bg-surface-container-low border border-outline-variant/40 font-data-mono-xs text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <SvgIcon name="verified" size={16} className="text-tertiary-container shrink-0" /> Verified Safe &amp; Secure
              </span>
              <span className="px-3 py-1 rounded-md bg-surface-container-low border border-outline-variant/40 font-data-mono-xs text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <SvgIcon name="shield" size={16} className="text-tertiary-container shrink-0" /> Bank-Level Protection
              </span>
              <span className="px-3 py-1 rounded-md bg-surface-container-low border border-outline-variant/40 font-data-mono-xs text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <SvgIcon name="lock" size={16} className="text-tertiary-container shrink-0" /> 100% Privacy Guaranteed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 LIVE DEMO — ANIMATED LIFECYCLE RAIL */}
      <section className="w-full py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto" id="live-demo">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Reveal>
            <span className="font-label-caps text-xs uppercase text-primary-container font-semibold tracking-wider">A live look inside</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight">
              Watch a visit unfold — before it happens.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="font-body-lg text-lg text-on-surface-variant mt-3 leading-relaxed">
              Every step below runs automatically for every customer. Tap any step to jump around.
            </p>
          </Reveal>
        </div>

        <Reveal direction="up">
          <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 lg:p-8 shadow-xl max-w-5xl mx-auto">
            {/* Rail header */}
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-8">
              <div className="flex items-center gap-2">
                <SvgIcon name="alt_route" className="text-primary-container text-[20px]" />
                <span className="font-label-caps text-xs uppercase text-on-surface-variant font-semibold tracking-wider">How your visit works</span>
              </div>
              <span className="font-data-mono-xs text-xs text-tertiary font-semibold flex items-center gap-1.5 bg-tertiary-fixed/40 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
                Live &amp; Ready
              </span>
            </div>

            {/* The animated rail */}
            <div className="relative overflow-x-auto pb-3">
              <div className="min-w-[680px] flex items-start justify-between relative px-4 pt-1">
                {/* Tracks */}
                <div className="absolute left-8 right-8 top-3.5 h-0.5 bg-surface-container-high" aria-hidden="true"></div>
                <div
                  className="absolute left-8 top-3.5 h-0.5 bg-primary-container transition-all duration-700 ease-out"
                  style={{ width: `calc((100% - 4rem) * ${railProgress})` }}
                  aria-hidden="true"
                ></div>

                {LIFECYCLE_STEPS.map((step, i) => {
                  const state = i < activeStep ? 'done' : i === activeStep ? 'active' : 'todo';
                  return (
                    <button
                      key={step.label}
                      type="button"
                      onClick={() => setActiveStep(i)}
                      aria-label={`Show step ${i + 1}: ${step.label}`}
                      aria-current={state === 'active' ? 'step' : undefined}
                      className="flex flex-col items-center text-center z-10 w-20 cursor-pointer group"
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-data-mono-xs text-xs font-bold transition-all duration-300 ${
                          state === 'done'
                            ? 'bg-primary-container text-white shadow-sm'
                            : state === 'active'
                              ? 'bg-primary-container text-white ring-4 ring-primary-fixed scale-110 shadow-md'
                              : 'bg-surface-container-high text-on-surface-variant group-hover:bg-surface-container-highest'
                        }`}
                      >
                        {state === 'done' ? '✓' : String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`mt-1.5 text-xs transition-colors duration-300 ${
                          state === 'active' ? 'font-bold text-primary-container' : state === 'done' ? 'font-medium text-on-surface' : 'font-medium text-on-surface-variant'
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live status panel — follows the active step */}
            <div className="mt-5 pt-6 border-t border-outline-variant/30">
              <div key={activeStep} className="step-pop flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-3 shrink-0">
                  <span className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center">
                    <SvgIcon name={currentStep.icon} className="text-primary-container text-[24px]" />
                  </span>
                  <div>
                    <div className="font-data-mono-xs text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                      Step {activeStep + 1} of {LIFECYCLE_STEPS.length} · {currentStep.label}
                    </div>
                    <div className="font-bold text-on-surface text-sm sm:text-base">{currentStep.caption}</div>
                  </div>
                </div>
                <div className="sm:ml-auto flex items-center gap-1.5 shrink-0" aria-hidden="true">
                  {LIFECYCLE_STEPS.map((s, i) => (
                    <span
                      key={s.label}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === activeStep ? 'w-6 bg-primary-container' : i < activeStep ? 'w-1.5 bg-primary-fixed-dim' : 'w-1.5 bg-surface-container-high'}`}
                    ></span>
                  ))
                  }
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 3. THE CORE PROBLEM & PROMISE */}
      <section className="w-full py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto" id="solutions">
        <div className="max-w-3xl mb-16">
          <span className="font-label-caps text-xs uppercase text-primary-container font-semibold tracking-wider">The problem</span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight">
            You want one simple visit.<br />But organizations make you jump through six different hoops.
          </h2>
          <p className="font-body-lg text-lg text-on-surface-variant mt-3 leading-relaxed">
            When questions, long physical lines, paperwork checks, and payments don't talk to each other, you waste your whole day waiting — and staff are just as stressed.
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* The Old Painful Way */}
          <div className="bg-surface-container-lowest rounded-2xl border border-error/20 p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-error/15 mb-6">
                <div className="flex items-center gap-2">
                  <SvgIcon name="warning" className="text-error text-[22px]" />
                  <h3 className="text-lg font-bold text-on-surface">The Old Painful Way</h3>
                </div>
                <span className="font-data-mono-xs text-xs bg-error-container text-on-error-container px-2.5 py-1 rounded-md font-bold">FRUSTRATING</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border-l-4 border-error">
                  <SvgIcon name="hourglass_bottom" className="text-error text-[20px] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">Endless Waiting Lines</div>
                    <p className="text-xs text-on-surface-variant mt-0.5">Waiting on a plastic chair for over an hour with no idea when your number will be called.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border-l-4 border-error">
                  <SvgIcon name="assignment_late" className="text-error text-[20px] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">Turned Away at the Counter</div>
                    <p className="text-xs text-on-surface-variant mt-0.5">You wait forever only to find out you brought the wrong document and have to start over tomorrow.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border-l-4 border-error">
                  <SvgIcon name="sync_problem" className="text-error text-[20px] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">Explaining Yourself Over and Over</div>
                    <p className="text-xs text-on-surface-variant mt-0.5">Every new staff member you speak to asks the exact same questions from scratch.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-error/10 text-xs font-data-mono-xs text-error font-semibold">
              Result: Wasted hours, tired staff, and angry customers.
            </div>
          </div>

          {/* The Luma Easy Way */}
          <div className="bg-surface-container-lowest rounded-2xl border border-tertiary-container/30 p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-tertiary-container/20 mb-6">
                <div className="flex items-center gap-2">
                  <SvgIcon name="check_circle" className="text-tertiary text-[22px]" />
                  <h3 className="text-lg font-bold text-on-surface">The Luma Easy Way</h3>
                </div>
                <span className="font-data-mono-xs text-xs bg-tertiary-fixed text-tertiary px-2.5 py-1 rounded-md font-bold">SIMPLE &amp; FAST</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border-l-4 border-tertiary">
                  <SvgIcon name="schedule" className="text-tertiary text-[20px] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">Save Your Spot from Home</div>
                    <p className="text-xs text-on-surface-variant mt-0.5">Grab a digital ticket on your phone and arrive right when it's your turn.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border-l-4 border-tertiary">
                  <SvgIcon name="task_alt" className="text-tertiary text-[20px] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">Check Papers Before You Leave</div>
                    <p className="text-xs text-on-surface-variant mt-0.5">Snap a quick photo of your documents at home so you know they're approved before you travel.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border-l-4 border-tertiary">
                  <SvgIcon name="hub" className="text-tertiary text-[20px] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">Staff Already Know What You Need</div>
                    <p className="text-xs text-on-surface-variant mt-0.5">Whoever serves you sees your notes immediately, so you never repeat yourself.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-tertiary-container/15 text-xs font-data-mono-xs text-tertiary font-semibold">
              Result: Get in and out in minutes with zero stress.
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAPABILITIES GRID */}
      <section className="w-full py-24 lg:py-32 bg-surface-container-low border-y border-outline-variant/30" id="features">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="font-label-caps text-xs uppercase text-primary-container font-semibold tracking-wider">Everything you need</span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight">
                Simple tools built to make customer visits fast and friendly.
              </h2>
              <p className="font-body-lg text-lg text-on-surface-variant mt-3 leading-relaxed">
                Everything works together behind the scenes so customers and staff always stay on the same page.
              </p>
            </div>
            <span className="font-data-mono-xs text-xs text-on-surface-variant bg-surface-container-highest px-3 py-1.5 rounded-md font-semibold">ZERO COMPLICATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 01 Chat Support */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-data-mono-xs text-xs text-primary font-bold">01 / MESSAGING</span>
                  <SvgIcon name="forum" className="text-primary-container text-[20px]" />
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Chat Support</h3>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  Chat with us on WhatsApp, SMS, or online and get instant, helpful answers before you ever leave home.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs">
                  <span className="text-on-surface-variant font-medium">WhatsApp Help:</span>
                  <div className="font-semibold text-on-surface mt-0.5">"Can I register my shop without visiting the main office?"</div>
                  <div className="text-primary font-data-mono-xs text-[11px] mt-1">"Yes! Upload your paperwork right here on WhatsApp."</div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Instant Messaging</span>
                <SvgIcon name="arrow_forward" className="text-[16px]" />
              </div>
            </div>

            {/* 02 Line Saver */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-data-mono-xs text-xs text-primary font-bold">02 / WAIT TIME</span>
                  <SvgIcon name="confirmation_number" className="text-primary-container text-[20px]" />
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Line Saver</h3>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  Check how busy the branch is on your phone, pick your time, and show up just when your seat is ready.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-on-surface">University Road Branch</span>
                    <span className="text-primary font-data-mono">Ticket #LUM-2841</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant text-[11px] mt-1">
                    <span>3 people ahead</span>
                    <span className="font-bold text-on-surface">Ready in 10 mins</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Save Your Spot</span>
                <SvgIcon name="arrow_forward" className="text-[16px]" />
              </div>
            </div>

            {/* 03 Paperwork Check */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-data-mono-xs text-xs text-primary font-bold">03 / PAPERS</span>
                  <SvgIcon name="verified_user" className="text-primary-container text-[20px]" />
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Paperwork Check</h3>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  Take a picture of your ID and forms. We catch mistakes instantly so you're never turned away.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">ID Card</span>
                    <span className="text-tertiary font-semibold">Approved ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Tax Form</span>
                    <span className="text-tertiary font-semibold">Clear ✓</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Never Turned Away</span>
                <SvgIcon name="arrow_forward" className="text-[16px]" />
              </div>
            </div>

            {/* 04 Easy Payments */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-data-mono-xs text-xs text-primary font-bold">04 / PAYMENTS</span>
                  <SvgIcon name="payments" className="text-primary-container text-[20px]" />
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Easy Payments</h3>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  Pay fees directly on your phone or at the counter with instant receipts and no hidden charges.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-on-surface-variant">Service Fee</span>
                    <div className="font-data-mono font-bold text-on-surface text-sm">$45.00</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-tertiary font-data-mono-xs font-bold">Paid instantly ✓</span>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Fast &amp; Transparent</span>
                <SvgIcon name="arrow_forward" className="text-[16px]" />
              </div>
            </div>

            {/* 05 Staff Help Desk */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-data-mono-xs text-xs text-primary font-bold">05 / TEAM TOOLS</span>
                  <SvgIcon name="hub" className="text-primary-container text-[20px]" />
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Staff Help Desk</h3>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  When one branch learns a faster way to solve a problem, every other branch learns it too.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs">
                  <span className="text-on-surface font-semibold">Quick guide shared across 42 offices</span>
                  <div className="text-tertiary font-data-mono-xs text-[11px] mt-1">Cuts 15 mins off paperwork</div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Shared Best Practices</span>
                <SvgIcon name="arrow_forward" className="text-[16px]" />
              </div>
            </div>

            {/* 06 Live Insights */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-data-mono-xs text-xs text-primary font-bold">06 / OVERSIGHT</span>
                  <SvgIcon name="psychology" className="text-primary-container text-[20px]" />
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Live Insights</h3>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  Managers see live wait times and busy hours so they can open more counters before lines get long.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-on-surface-variant text-[11px]">Average wait time</span>
                    <div className="font-bold text-tertiary font-data-mono">4 minutes</div>
                  </div>
                  <div>
                    <span className="text-on-surface-variant text-[11px]">Happy customers</span>
                    <div className="font-bold text-primary font-data-mono">99.4%</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Zero Long Lines</span>
                <SvgIcon name="arrow_forward" className="text-[16px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REAL-TIME HELPDESK (Dark Block) */}
      <section className="w-full py-24 lg:py-32 bg-[#0A0D14] text-white" id="helpdesk">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1E293B] pb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121826] border border-[#1E293B] text-primary-fixed mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                <span className="font-data-mono-xs text-xs uppercase font-semibold">Real-time helpdesk</span>
              </div>
              <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Fixing problems before lines even start.
              </h2>
              <p className="font-body-lg text-slate-400 mt-2 leading-relaxed">
                Every question, ticket, and visit helps teams see what's slowing people down and fix it on the spot.
              </p>
            </div>
            <div className="font-data-mono-xs text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
              ALL OFFICES RUNNING ON SCHEDULE
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Live Help Chat */}
            <div className="lg:col-span-6 bg-[#121826] border border-[#1E293B] rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <SvgIcon name="forum" className="text-primary-container text-[20px]" />
                  <span className="text-sm font-semibold text-white">Live Help Chat</span>
                </div>
                <span className="font-data-mono-xs text-xs text-tertiary-fixed-dim">Instant Answer Ready</span>
              </div>

              {/* Inbound Thread Sample */}
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px]">W</span>
                    <span>Customer Question</span>
                  </div>
                  <span className="text-slate-400 font-data-mono-xs">Just now</span>
                </div>
                <p className="text-sm text-slate-300">"Can I bring my family member's ID to renew the card?"</p>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#1E293B] text-slate-300 font-data-mono-xs">Card Renewal</span>
                  <span className="px-2 py-0.5 rounded bg-tertiary-fixed/20 text-tertiary-fixed-dim font-data-mono-xs">Quick Answer</span>
                </div>
              </div>

              {/* Instant Clear Answer */}
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-primary-container/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary-fixed font-semibold flex items-center gap-1.5">
                    <SvgIcon name="check_circle" className="text-[16px]" /> Verified Instant Reply
                  </span>
                  <span className="font-data-mono-xs text-tertiary-fixed-dim">Ready to Send</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Yes! Just bring their signed letter and your own ID. You can also snap a photo of both documents right here to get them checked before you visit."
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#1E293B] text-xs">
                  <span className="text-slate-400 text-[11px]">Helpful &amp; friendly answer</span>
                  <button className="px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-white font-medium transition-colors">
                    Send to Customer
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Daily Wait Time Tracker */}
            <div className="lg:col-span-6 bg-[#121826] border border-[#1E293B] rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <SvgIcon name="analytics" className="text-tertiary-fixed-dim text-[20px]" />
                  <span className="text-sm font-semibold text-white">Daily Wait Time Tracker</span>
                </div>
                <div className="flex items-center gap-3 font-data-mono-xs text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-container"></span> Wait Time</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span> Fast Served</span>
                </div>
              </div>

              {/* Graph */}
              <div className="pt-2">
                <svg className="w-full h-36" fill="none" preserveAspectRatio="none" viewBox="0 0 500 120">
                  <line stroke="#1E293B" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="30" y2="30"></line>
                  <line stroke="#1E293B" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="70" y2="70"></line>
                  <path d="M0 95 C100 80, 200 45, 300 40 C400 35, 450 25, 500 15" fill="none" stroke="#4edea3" strokeWidth="2.5"></path>
                  <path d="M0 35 C100 45, 200 70, 300 85 C400 95, 450 100, 500 105" fill="none" stroke="#0052FF" strokeWidth="2.5"></path>
                  <circle cx="300" cy="40" fill="#4edea3" r="4"></circle>
                  <circle cx="300" cy="85" fill="#0052FF" r="4"></circle>
                </svg>
                <div className="flex justify-between font-data-mono-xs text-xs text-slate-400 pt-3 border-t border-[#1E293B]">
                  <span>08:00 AM (Open)</span>
                  <span>12:00 PM (Lunch)</span>
                  <span>05:00 PM (Close)</span>
                </div>
              </div>

              {/* Operational Signals */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B]">
                  <div className="text-xs text-slate-400">Average wait today</div>
                  <div className="text-base font-bold text-tertiary-fixed-dim font-data-mono mt-1">4 mins</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B]">
                  <div className="text-xs text-slate-400">Offices running smoothly</div>
                  <div className="text-base font-bold text-primary-fixed font-data-mono mt-1">42 offices</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW LUMA WORKS */}
      <section className="w-full py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto" id="how-it-works">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-label-caps text-xs uppercase text-primary-container font-semibold tracking-wider">How Luma works</span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight">
            How Luma keeps everything running smoothly.
          </h2>
          <p className="font-body-lg text-lg text-on-surface-variant mt-3 leading-relaxed">
            A simple 4-step circle that makes every visit easier than the last.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-8 lg:p-12 shadow-sm">
          {/* Central Hub */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-primary-container text-white text-center shadow-lg mb-10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <SvgIcon name="hub" className="text-[24px]" />
              <span className="font-headline-md text-lg font-bold">LUMA HUB</span>
            </div>
            <span className="font-data-mono-xs text-xs text-primary-fixed uppercase tracking-wider font-semibold">Everything connected</span>
            <p className="text-xs text-white/80 mt-2">Connects customer phones, desk counters, and payments in real time.</p>
          </div>

          {/* 4 Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center mx-auto text-primary mb-3">
                <SvgIcon name="smartphone" className="text-[22px]" />
              </div>
              <h4 className="font-bold text-on-surface text-base">1. Start from Your Phone</h4>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">Message on WhatsApp or book online from home.</p>
            </div>
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center mx-auto text-primary mb-3">
                <SvgIcon name="fact_check" className="text-[22px]" />
              </div>
              <h4 className="font-bold text-on-surface text-base">2. Check Papers Early</h4>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">Fix any missing signatures or documents in seconds.</p>
            </div>
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center mx-auto text-primary mb-3">
                <SvgIcon name="support_agent" className="text-[22px]" />
              </div>
              <h4 className="font-bold text-on-surface text-base">3. Friendly Counter Help</h4>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">Desk staff have your info ready the moment you sit down.</p>
            </div>
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center mx-auto text-primary mb-3">
                <SvgIcon name="auto_awesome" className="text-[22px]" />
              </div>
              <h4 className="font-bold text-on-surface text-base">4. Keep Getting Better</h4>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">Teams learn what took too long and make it faster next time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRUST & SECURITY */}
      <section className="w-full py-24 lg:py-32 bg-surface-container-lowest border-t border-outline-variant/30" id="security">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          <div className="max-w-3xl">
            <span className="font-label-caps text-xs uppercase text-primary-container font-semibold tracking-wider">Your privacy first</span>
            <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight">
              Safe, secure, and built to protect your private information.
            </h2>
            <p className="font-body-lg text-lg text-on-surface-variant mt-3 leading-relaxed">
              Your personal details and documents are locked tight and handled with bank-grade safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between">
                <SvgIcon name="shield_person" className="text-primary-container text-[26px]" />
                <span className="font-data-mono-xs text-xs font-bold text-primary">PRIVATE</span>
              </div>
              <h4 className="text-base font-bold text-on-surface">Strict Staff Access</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Only the staff member helping you can see your file.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between">
                <SvgIcon name="policy" className="text-primary-container text-[26px]" />
                <span className="font-data-mono-xs text-xs font-bold text-primary">CERTIFIED</span>
              </div>
              <h4 className="text-base font-bold text-on-surface">Bank-Grade Safety</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Built to meet the strictest international data security standards.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between">
                <SvgIcon name="speed" className="text-primary-container text-[26px]" />
                <span className="font-data-mono-xs text-xs font-bold text-primary">24 / 7</span>
              </div>
              <h4 className="text-base font-bold text-on-surface">Always Up &amp; Running</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Works around the clock with zero downtime so you can always get help.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between">
                <SvgIcon name="lock" className="text-primary-container text-[26px]" />
                <span className="font-data-mono-xs text-xs font-bold text-primary">PROTECTED</span>
              </div>
              <h4 className="text-base font-bold text-on-surface">Tamper-Proof Records</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Every document and receipt is safely stamped and stored.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7.5 FAQ ACCORDION */}
      <section className="w-full py-24 lg:py-32 bg-surface-container-low border-y border-outline-variant/30" id="faq">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left intro */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="font-label-caps text-xs uppercase text-primary-container font-semibold tracking-wider">Questions, answered</span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight">
                Everything you're wondering, in plain English.
              </h2>
              <p className="font-body-lg text-lg text-on-surface-variant mt-3 leading-relaxed">
                No jargon, no fine print. If it's not here, our team is one message away.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <a
                href="mailto:hello@luma.com"
                className="mt-8 inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface text-sm font-semibold border border-outline-variant/60 shadow-sm transition-all"
              >
                <SvgIcon name="support_agent" className="text-primary-container text-[18px]" />
                <span>Still stuck? Ask us anything</span>
              </a>
            </Reveal>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <Reveal key={faq.q} delay={i * 70}>
                  <div className={`bg-surface-container-lowest border rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-primary-container/40 shadow-sm' : 'border-outline-variant/40'}`}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-container-low transition-colors"
                    >
                      <span className="flex items-center gap-3 font-semibold text-on-surface text-sm sm:text-base">
                        <span className="font-data-mono-xs text-xs text-primary font-bold">{String(i + 1).padStart(2, '0')}</span>
                        {faq.q}
                      </span>
                      <SvgIcon
                        name="expand_more"
                        size={22}
                        className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-container' : 'text-on-surface-variant'}`}
                        aria-hidden="true"
                      />
                    </button>
                    {/* Smooth height animation via grid-template-rows trick */}
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 sm:pl-[3.4rem] text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="w-full py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto" id="pricing">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-container-lowest text-primary font-data-mono-xs text-xs font-semibold border border-outline-variant/40 mb-5">
            <span>LUMA FOR BUSINESS</span>
          </div>
          <h2 className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            One workspace for every service desk
          </h2>
          <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed mt-3">
            Banks, hospitals, telecoms, government offices — launch your branch in minutes with Luma.
            Yield Management folks call it a queue killer. We call it Tuesday.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Starter', price: 'Free', period: '14-day trial, then ₦0',
              features: ['1 branch', 'Unlimited services', 'Digital queue + appointments', 'Up to 5 staff'], cta: 'Start Free',
            },
            {
              name: 'Pro', price: '₦150k', period: '/year per branch', highlighted: true,
              features: ['Unlimited branches', 'AI document verification', 'Feedback insights studio', 'Unlimited staff', 'Priority support'], cta: 'Start Trial',
            },
            {
              name: 'Enterprise', price: 'Custom', period: 'tailored rollout',
              features: ['Dedicated onboarding team', 'SSO & audit controls', 'Custom integrations', 'SLA & 24/7 support'], cta: 'Talk To Us',
            },
          ].map(plan => (
            <div key={plan.name}
              className={`relative rounded-2xl border p-7 flex flex-col ${plan.highlighted
                ? 'bg-[#0A0D14] text-white border-transparent shadow-[0_12px_40px_rgba(0,82,255,0.25)]'
                : 'bg-surface-container-lowest border-outline-variant/40'}`}>
              {plan.highlighted && <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary-container text-white text-xs font-semibold font-data-mono-xs">MOST POPULAR</span>}
              <h3 className={`font-headline-md text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-on-surface'}`}>{plan.name}</h3>
              <div className="mt-3 flex items-end gap-1">
                <span className={`text-3xl font-extrabold font-headline-lg ${plan.highlighted ? 'text-white' : 'text-on-surface'}`}>{plan.price}</span>
                <span className={`text-sm mb-1 ${plan.highlighted ? 'text-white/60' : 'text-on-surface-variant'}`}>{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlighted ? 'text-white/80' : 'text-on-surface-variant'}`}>
                    <SvgIcon name="check_circle" className={`text-[18px] mt-0.5 ${plan.highlighted ? 'text-primary' : 'text-primary-container'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/workspace"
                className={`mt-8 inline-flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-primary-container hover:bg-primary text-white shadow-[0_4px_14px_rgba(0,82,255,0.3)]'
                    : 'bg-primary-container text-white hover:bg-primary shadow-[0_2px_8px_rgba(0,82,255,0.25)]'}`}>
                {plan.cta}
                <SvgIcon name="arrow_forward" size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto" id="get-started">
        <div className="relative bg-surface-container-highest/60 rounded-3xl border border-outline-variant/50 p-8 lg:p-16 overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-container-lowest text-primary font-data-mono-xs text-xs font-semibold border border-outline-variant/40">
              <span className="w-4 h-4 rounded bg-primary-container flex items-center justify-center">
                <span className="text-white font-bold text-[9px]">L</span>
              </span>
              <span>TRY LUMA TODAY</span>
            </div>
            <h2 className="font-headline-lg text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              No more waiting in lines.<br />No more guesswork.
            </h2>
            <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
              Give your customers an easy, stress-free experience — and give your staff the tools to help people faster.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/workspace"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-lg bg-primary-container hover:bg-primary text-white text-base font-semibold transition-all shadow-[0_4px_14px_rgba(0,82,255,0.3)] hover:-translate-y-0.5"
              >
                <span>Create Your Workspace</span>
                <SvgIcon name="arrow_forward" size={18} className="shrink-0" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface text-base font-semibold border border-outline-variant/60 shadow-sm transition-all"
              >
                <span>Join Your Bank</span>
              </Link>
            </div>
            <div className="pt-2 flex items-center gap-2 text-on-surface-variant font-data-mono-xs text-xs">
              <SvgIcon name="support_agent" className="text-primary-container text-[18px]" />
              <span>Need help? Talk to our team: <span className="text-on-surface font-semibold underline cursor-pointer">hello@luma.com</span></span>
            </div>
          </div>

          {/* Geometric ring decoration */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 hidden lg:flex items-center justify-center opacity-15 pointer-events-none">
            <svg className="w-full h-full" fill="none" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="160" stroke="#0052ff" strokeWidth="2"></circle>
              <circle cx="200" cy="200" r="100" stroke="#0052ff" strokeWidth="2"></circle>
              <circle cx="200" cy="200" r="40" stroke="#0052ff" strokeWidth="2"></circle>
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
