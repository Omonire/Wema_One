import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-surface min-h-screen">
      {/* HERO */}
      <section className="relative w-full pt-10 pb-16 px-4 lg:px-8 max-w-[1600px] mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-tr from-primary/10 via-primary-container/5 to-transparent blur-3xl pointer-events-none -z-10"></div>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/50 shadow-sm">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>
            <span className="font-mono text-xs uppercase text-primary font-semibold tracking-wider">One Connected Customer Service Delivery Experience</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface font-headline" style={{lineHeight:'1.15',letterSpacing:'-0.03em'}}>
            Customer Service for the <span className="text-primary">Digital Economy</span>.
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            WemaOne connects customers, teams, payments, documents, queues, and intelligence into one continuous, deterministic service experience.
          </p>
          <div className="pt-1 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-semibold transition-all shadow-[0_2px_8px_rgba(0,82,255,0.25)]">
              <span>Get Started</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <a href="#platform" className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-semibold border border-outline-variant/60 shadow-sm transition-all">
              <span className="material-symbols-outlined text-primary text-[20px]">explore</span>
              <span>Explore Platform</span>
            </a>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-on-surface-variant text-xs font-mono">
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span><span className="text-on-surface font-semibold">99.98%</span> Verification Accuracy</div>
            <div className="hidden sm:block text-outline-variant/80">/</div>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span><span className="text-on-surface font-semibold">42%</span> Lower Queue Wait Times</div>
            <div className="hidden sm:block text-outline-variant/80">/</div>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span><span className="text-on-surface font-semibold">14.2M</span> Journey Events Processed</div>
          </div>
        </div>

        {/* Journey Rail + Telemetry */}
        <div className="mt-10 relative w-full bg-surface-container-low rounded-xl border border-outline-variant/50 p-4 lg:p-6 shadow-sm">
          {/* Pipeline */}
          <div className="w-full bg-surface-container-lowest rounded-lg border border-outline-variant/40 p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-3">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">alt_route</span><span className="text-xs uppercase text-on-surface-variant font-semibold tracking-wider">Continuous Lifecycle Pipeline · Session #WMA-94821</span></div>
              <span className="text-xs text-tertiary font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-ping"></span> Live Pipeline Active</span>
            </div>
            <div className="relative overflow-x-auto pb-2">
              <div className="min-w-[780px] flex items-center justify-between relative px-2">
                <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-surface-container-highest"></div>
                <div className="absolute left-6 w-3/5 top-3.5 h-0.5 bg-primary"></div>
                {['Discover','Book','Verify','Pay','Visit','Get Served','Feedback','Improve'].map((s,i) => (
                  <div key={i} className="flex flex-col items-center text-center z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm ${
                      i < 3 ? 'bg-primary text-on-primary' :
                      i === 3 ? 'bg-primary-container text-on-primary ring-4 ring-primary-fixed animate-pulse font-bold' :
                      i === 7 ? 'bg-tertiary text-on-tertiary' :
                      'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {i < 3 ? '✓' : i === 7 ? <span className="material-symbols-outlined text-[14px]">auto_graph</span> : `0${i+1}`}
                    </div>
                    <span className={`mt-1 text-xs font-medium ${i === 3 ? 'text-primary font-bold' : i === 7 ? 'text-tertiary font-bold' : i < 3 ? 'text-on-surface' : 'text-on-surface-variant'}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6 Telemetry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Queue */}
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/40 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">confirmation_number</span><span className="font-semibold text-on-surface text-sm">Queue Dispatch</span></div>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-tertiary-fixed text-tertiary text-xs font-semibold">Active #3</span>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between items-baseline"><span className="text-xs uppercase text-on-surface-variant">Ticket ID</span><span className="font-mono font-bold text-primary">WMA-2841</span></div>
                <p className="text-xs text-on-surface">University Road Branch · Desk 4</p>
                <div className="pt-2 flex items-center justify-between text-on-surface-variant text-xs bg-surface-container-low p-2 rounded">
                  <span>Estimated Service:</span><span className="font-bold text-on-surface">11:40 AM (in 6 mins)</span>
                </div>
              </div>
            </div>
            {/* KYC */}
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/40 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-tertiary-container text-[18px]">verified_user</span><span className="font-semibold text-on-surface text-sm">Pre-Flight KYC Check</span></div>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-tertiary-fixed text-tertiary text-xs font-semibold">OCR 99.4%</span>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs"><span className="text-on-surface-variant">National Identity Vault</span><span className="text-tertiary font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> Valid</span></div>
                <div className="flex items-center justify-between text-xs"><span className="text-on-surface-variant">CAC Form 1 (Corporate)</span><span className="text-tertiary font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> Valid</span></div>
                <div className="pt-1 flex items-center gap-1.5 text-on-tertiary-fixed-variant bg-tertiary-fixed/30 p-2 rounded text-xs"><span className="material-symbols-outlined text-[14px]">task_alt</span> 0 Issues Found · Desk time pre-reduced by 14m</div>
              </div>
            </div>
            {/* Payment */}
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/40 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">payments</span><span className="font-semibold text-on-surface text-sm">Journey Settlement</span></div>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary-fixed text-primary text-xs font-semibold">Settled</span>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between items-baseline"><span className="text-xs text-on-surface-variant">Account Issuance Fee</span><span className="font-mono font-bold text-on-surface">₦5,000</span></div>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant"><span>Channel: WemaPay / NIP Rail</span><span className="text-outline-variant">·</span><span className="text-tertiary font-medium">Txn #90248</span></div>
                <div className="pt-2 flex items-center justify-between text-on-surface-variant text-xs bg-surface-container-low p-2 rounded"><span>Branch Ledger Sync:</span><span className="text-primary font-bold">Auto-Reconciled</span></div>
              </div>
            </div>
            {/* Feedback */}
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/40 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">reviews</span><span className="font-semibold text-on-surface text-sm">Experience Sentiment</span></div>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-xs">NPS 94</span>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-0.5 text-primary">{[1,2,3,4,5].map(n => <span key={n} className="material-symbols-outlined text-[16px]">star</span>)}</div>
                <p className="text-xs text-on-surface italic line-clamp-2">"Saved 45 minutes by uploading business charter prior to visit. Desk 4 had my card already issued."</p>
                <p className="text-xs text-on-surface-variant pt-1">Amara K. · Verified Corporate Visit</p>
              </div>
            </div>
            {/* Predictive */}
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/40 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">psychology</span><span className="font-semibold text-on-surface text-sm">Predictive Allocation</span></div>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary-fixed text-primary text-xs">Auto-Steering</span>
              </div>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs text-on-surface font-medium">Branch peak incoming at 12:15 PM</p>
                <p className="text-xs text-on-surface-variant">Counter 4 dynamic reallocation triggered for enterprise KYC flows.</p>
                <div className="pt-1 flex items-center justify-between text-xs bg-surface-container-low p-2 rounded"><span>Impact:</span><span className="text-tertiary font-bold">-18.4% Expected Surge Delay</span></div>
              </div>
            </div>
            {/* Network */}
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/40 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-tertiary-container text-[18px]">hub</span><span className="font-semibold text-on-surface text-sm">Network Activity</span></div>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-tertiary-fixed text-tertiary text-xs font-semibold">Sync 12ms</span>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-on-surface font-medium">Lagos Island Branch · 18 Desks Active</p>
                <div className="flex items-center justify-between pt-1"><span className="text-xs uppercase text-on-surface-variant">Avg Wait Real-Time</span><span className="font-mono font-bold text-tertiary">4.2 min</span></div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1"><div className="bg-tertiary-container h-full w-[24%]"></div></div>
                <span className="block text-xs text-on-surface-variant pt-1 text-right">Capacity Utilization: 68% optimal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="w-full bg-surface-container-lowest py-16 border-y border-outline-variant/30">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-on-surface font-headline">Built for organizations where customer experience and operations must work together.</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Serving national deposit banks, integrated health networks, state agencies, and critical infrastructure.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: 'account_balance', name: 'Banking', sub: 'Retail & Commercial' },
              { icon: 'local_hospital', name: 'Healthcare', sub: 'Outpatient & Clinics' },
              { icon: 'school', name: 'Education', sub: 'Registrar & Enrollment' },
              { icon: 'policy', name: 'Government', sub: 'Civic & ID Registry' },
              { icon: 'cell_tower', name: 'Telecom', sub: 'SIM KYC & Centers' },
              { icon: 'token', name: 'Digital Platforms', sub: 'Fintechs & Exchanges' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 transition-colors text-center group">
                <span className="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform">{s.icon}</span>
                <span className="mt-2 font-semibold text-on-surface text-sm">{s.name}</span>
                <span className="text-xs text-on-surface-variant">{s.sub}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: 'verified', label: 'SOC2 TYPE II CERTIFIED' },
              { icon: 'shield', label: 'ISO 27001 ENCRYPTED' },
              { icon: 'lock', label: 'BANK-GRADE DATA VAULT' },
              { icon: 'account_balance_wallet', label: 'CENTRAL BANK REGULATED' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-outline-variant/40">
                <span className={`material-symbols-outlined text-[20px] ${i < 3 ? 'text-tertiary-container' : 'text-primary'}`}>{b.icon}</span>
                <span className="text-xs font-semibold text-on-surface">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="w-full py-16 px-4 lg:px-8 max-w-[1600px] mx-auto">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase text-primary font-semibold tracking-wider">The Operational Disconnect</span>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 font-headline">The customer sees one journey. Your organization sees six different systems.</h2>
          <p className="text-base text-on-surface-variant mt-2">When social inquiries, physical ticketing, identity validation, and accounting sit in silos, customers wait — and staff operate blind.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Fragmented */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl border border-error/30 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-error/20">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-error text-[20px]">warning</span><span className="font-semibold text-on-surface">The Fragmented Model</span></div>
              <span className="text-xs bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold">5 DISCONNECTED SILOS</span>
            </div>
            {[
              { t: 'Physical Queue Bottlenecks', tag: '45m+ Wait', desc: 'Paper ticket kiosks with zero visibility until the customer stands physically in the lobby.' },
              { t: 'Missing Document Shock', tag: 'Turned Away', desc: 'Unclear requirements discovered only after waiting 40 minutes at the counter desk.' },
              { t: 'Separate Manual Cashier', tag: 'Re-Queueing', desc: 'Customer forced to pay fees at a second counter, manual receipt verification required.' },
              { t: 'Repeated Inquiry Loops', tag: '3 Reps', desc: 'Social team, support team, and branch staff share no CRM context across interactions.' },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded bg-surface-container-low border-l-4 border-error space-y-1">
                <div className="flex items-center justify-between"><span className="text-xs font-bold text-on-surface">{p.t}</span><span className="text-xs text-error font-semibold">{p.tag}</span></div>
                <p className="text-xs text-on-surface-variant">{p.desc}</p>
              </div>
            ))}
          </div>
          {/* Center: Bus */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 text-center">
            <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[24px]">sync</span>
            </div>
            <div className="mt-2 text-xs uppercase text-primary font-bold tracking-wider">WemaOne Bus</div>
            <p className="text-xs text-on-surface-variant max-w-[140px] mt-1">Real-time state synchronization</p>
          </div>
          {/* Right: Unified */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl border border-tertiary-container/30 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-tertiary-container/20">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span><span className="font-semibold text-on-surface">The WemaOne Unified Standard</span></div>
              <span className="text-xs bg-tertiary-fixed text-tertiary px-2 py-0.5 rounded font-bold">1 INTEGRATED RUNTIME</span>
            </div>
            {[
              { t: 'Virtual Smart Queue & ETA', tag: 'Predictive ETA', desc: 'Customers hold their spot from home; arrive right as their number is summoned to the desk.' },
              { t: 'Pre-Verified Document Pass', tag: '100% Pre-Check', desc: 'Automated OCR and compliance validation fixes missing documents before branch transit.' },
              { t: 'In-Journey Instant Checkout', tag: 'Auto-Reconciled', desc: 'Fees billed and settled automatically within the digital pass, verified immediately by staff.' },
              { t: 'Omnichannel Continuous Context', tag: 'Unified Record', desc: 'Every inquiry from social, web, and prior branch visits feeds the front desk agent\'s screen.' },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded bg-surface-container-low border-l-4 border-tertiary space-y-1">
                <div className="flex items-center justify-between"><span className="text-xs font-bold text-on-surface">{p.t}</span><span className="text-xs text-tertiary font-semibold">{p.tag}</span></div>
                <p className="text-xs text-on-surface-variant">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="w-full py-16 bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs uppercase text-primary font-semibold tracking-wider">Capabilities Architecture</span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 font-headline">Engineered for deterministic service delivery.</h2>
              <p className="text-base text-on-surface-variant mt-2">Six modular enterprise systems designed to operate together as one unified nervous system.</p>
            </div>
            <span className="text-xs text-on-surface-variant font-mono">SYSTEM MATRIX: V4.8-PRODUCTION</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 01 Social Studio */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3"><span className="text-xs text-primary font-bold">01 / CONVERSATIONS</span><span className="px-2 py-0.5 rounded bg-tertiary-fixed text-tertiary text-xs font-semibold">+82% Sentiment</span></div>
                <h3 className="text-lg font-bold text-on-surface font-headline">Social Studio</h3>
                <p className="mt-1 text-xs text-on-surface-variant">Turn public and private customer conversations into operational signals before branches open.</p>
                <div className="mt-4 p-3 rounded bg-surface-container-low border border-outline-variant/30 space-y-2">
                  <div className="flex items-center justify-between text-on-surface-variant text-xs"><span>Inbound Feed · WhatsApp</span><span className="text-tertiary">Live Thread</span></div>
                  <p className="text-xs text-on-surface font-medium">"Can I register our LLC without a utility bill in my name?"</p>
                  <div className="bg-primary-fixed/40 p-2 rounded text-primary text-xs"><span className="font-bold">AI Insight:</span> 34 users asked about utility bill alternatives this morning.</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between"><span className="text-xs uppercase text-on-surface-variant">Auto-Escalate to Queue</span><span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span></div>
            </div>
            {/* 02 Smart Queue */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3"><span className="text-xs text-primary font-bold">02 / CAPACITY</span><span className="px-2 py-0.5 rounded bg-primary-fixed text-primary text-xs font-semibold">Virtual Ticket</span></div>
                <h3 className="text-lg font-bold text-on-surface font-headline">Smart Queue</h3>
                <p className="mt-1 text-xs text-on-surface-variant">Let customers know before they go. Seamless mobile ticketing with deterministic desk scheduling.</p>
                <div className="mt-4 p-3 rounded bg-surface-container-low border border-outline-variant/30 space-y-2">
                  <div className="flex justify-between items-center"><span className="text-xs font-semibold text-on-surface">University Road Branch</span><span className="text-xs font-mono font-bold text-primary">TICKET: WMA-2841</span></div>
                  <div className="flex justify-between text-on-surface-variant text-xs"><span>Desk Type: Business KYC</span><span>Pos: #3 in line</span></div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden"><div className="bg-primary h-full w-3/4"></div></div>
                  <div className="flex justify-between text-xs text-on-surface-variant"><span>SMS Notifications: Active</span><span className="font-bold text-on-surface">ETA: 11:40 AM</span></div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between"><span className="text-xs uppercase text-on-surface-variant">Capacity Prediction Active</span><span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span></div>
            </div>
            {/* 03 Document Verification */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3"><span className="text-xs text-primary font-bold">03 / VERIFICATION</span><span className="px-2 py-0.5 rounded bg-tertiary-fixed text-tertiary text-xs font-semibold">Zero-Counter Rejection</span></div>
                <h3 className="text-lg font-bold text-on-surface font-headline">Document Verification</h3>
                <p className="mt-1 text-xs text-on-surface-variant">Inspect IDs, corporate filings, and compliance forms prior to branch arrival with edge OCR.</p>
                <div className="mt-4 p-3 rounded bg-surface-container-low border border-outline-variant/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs"><span className="text-on-surface font-medium">Passport / National ID Scan</span><span className="text-tertiary font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check</span> OCR OK</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="text-on-surface font-medium">Proof of Corporate Address</span><span className="text-error font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">close</span> Expired &gt; 90d</span></div>
                  <div className="bg-error-container/40 p-2 rounded text-on-error-container text-xs flex items-center justify-between"><span>Auto-fix request sent to customer phone</span><span className="font-bold underline cursor-pointer">1-Tap Prompt</span></div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between"><span className="text-xs uppercase text-on-surface-variant">Pre-Flight Regulatory Rules</span><span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span></div>
            </div>
            {/* 04 Payments */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3"><span className="text-xs text-primary font-bold">04 / SETTLEMENT</span><span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-xs font-semibold">Ledger Integrated</span></div>
                <h3 className="text-lg font-bold text-on-surface font-headline">Integrated Payments</h3>
                <p className="mt-1 text-xs text-on-surface-variant">Make transaction settlements part of the journey timeline, not a disjointed cashier detour.</p>
                <div className="mt-4 p-3 rounded bg-surface-container-low border border-outline-variant/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs"><span className="text-on-surface-variant">Workflow Fee Breakdown:</span><span className="font-mono font-bold text-on-surface">₦5,000</span></div>
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs"><span className="w-2 h-2 rounded-full bg-tertiary"></span><span>Payment Auth via Mobile Session</span></div>
                  <div className="p-2 rounded bg-surface-container text-xs flex justify-between"><span>Branch Counter Allocation:</span><span className="text-primary font-bold">Auto-Unlocked Desk #4</span></div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between"><span className="text-xs uppercase text-on-surface-variant">Core Banking API Connected</span><span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span></div>
            </div>
            {/* 05 Branch Connect */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3"><span className="text-xs text-primary font-bold">05 / KNOWLEDGE</span><span className="px-2 py-0.5 rounded bg-primary-fixed text-primary text-xs font-semibold">42 Branches Synced</span></div>
                <h3 className="text-lg font-bold text-on-surface font-headline">Branch Connect</h3>
                <p className="mt-1 text-xs text-on-surface-variant">Turn individual branch triumphs into shared operational intelligence across the network.</p>
                <div className="mt-4 p-3 rounded bg-surface-container-low border border-outline-variant/30 space-y-1.5">
                  <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold">UR</span><span className="text-xs font-semibold text-on-surface">University Road Post</span></div>
                  <p className="text-xs text-on-surface-variant line-clamp-2">"Checklist for Foreign Entity accounts reduced desk time by 18m across all desks."</p>
                  <div className="flex items-center gap-3 text-xs text-primary pt-1"><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">thumb_up</span> 42 Adopted</span><span className="text-outline-variant">·</span><span>8 Live Comments</span></div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between"><span className="text-xs uppercase text-on-surface-variant">Peer Knowledge Graph</span><span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span></div>
            </div>
            {/* 06 Intelligence */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3"><span className="text-xs text-primary font-bold">06 / TELEMETRY</span><span className="px-2 py-0.5 rounded bg-tertiary-fixed text-tertiary text-xs font-semibold">64 Branches Realtime</span></div>
                <h3 className="text-lg font-bold text-on-surface font-headline">WemaOne Intelligence</h3>
                <p className="mt-1 text-xs text-on-surface-variant">Complete surveillance of wait times, throughput, accuracy, and customer satisfaction.</p>
                <div className="mt-4 p-3 rounded bg-surface-container-low border border-outline-variant/30 grid grid-cols-2 gap-2">
                  {[
                    { label: 'Customers Served', val: '148,920', color: 'text-on-surface' },
                    { label: 'Avg Wait', val: '6.4 min', color: 'text-tertiary' },
                    { label: 'KYC Pass Rate', val: '98.2%', color: 'text-primary' },
                    { label: 'CSAT Index', val: '4.9 / 5.0', color: 'text-on-surface' },
                  ].map((s, i) => (
                    <div key={i} className="p-2 bg-surface-container-lowest rounded"><span className="text-xs text-on-surface-variant block">{s.label}</span><span className={`font-mono font-bold ${s.color}`}>{s.val}</span></div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between"><span className="text-xs uppercase text-on-surface-variant">Executive Dashboard Active</span><span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINUOUS LOOP */}
      <section className="w-full py-16 px-4 lg:px-8 max-w-[1600px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase text-primary font-semibold tracking-wider">The Continuous Loop</span>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 font-headline">Every interaction becomes part of the next improvement.</h2>
          <p className="text-base text-on-surface-variant mt-2">Operational telemetry feeds systemic refinement without lag. Customer actions generate data; intelligence adapts counter rules automatically.</p>
        </div>
        <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 lg:p-8 shadow-sm">
          {/* Customer Layer */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary"></span><span className="font-semibold text-on-surface">Customer Execution Layer</span></div>
              <span className="text-xs text-primary font-semibold">Direction: Ingestion → Touchpoint Delivery</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {['Discover','Book','Queue','Verify','Pay','Visit','Get Served','Feedback'].map((s, i) => (
                <div key={i} className="p-3 rounded bg-surface-container-low border border-outline-variant/30 text-center">
                  <span className="text-xs text-primary font-bold block">0{i + 1}</span>
                  <span className="text-xs font-semibold text-on-surface">{s}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Pipeline Bar */}
          <div className="my-6 py-3 px-4 rounded-lg bg-surface-container flex flex-col md:flex-row items-center justify-between gap-2 border border-outline-variant/40">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary animate-spin text-[22px]">sync</span>
              <span className="text-xs font-semibold text-on-surface">Operational Event Ingestion Pipeline:</span>
              <span className="text-xs text-on-surface-variant font-mono">Kafka Stream · Event-Sourced · Instant Telemetry Bus</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-tertiary font-semibold"><span className="w-2 h-2 rounded-full bg-tertiary-container animate-ping"></span><span>Zero Knowledge Loss</span></div>
          </div>
          {/* Intelligence Layer */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-tertiary"></span><span className="font-semibold text-on-surface">WemaOne Intelligence Engine Layer</span></div>
              <span className="text-xs text-tertiary font-semibold">Direction: Telemetry → Algorithmic Adaptation</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {[
                { icon: 'query_stats', title: '1. Analyse', desc: 'Wait, dropoff, OCR metrics' },
                { icon: 'troubleshoot', title: '2. Identify Patterns', desc: 'Pinpoint verification bottlenecks' },
                { icon: 'share', title: '3. Share Knowledge', desc: 'Broadcast fixes to all branches' },
                { icon: 'tune', title: '4. Improve Operations', desc: 'Dynamic desk allocation' },
                { icon: 'rocket_launch', title: '5. Refined Experience', desc: 'Next customer served 3x faster', highlight: true },
              ].map((s, i) => (
                <div key={i} className={`p-3 rounded border text-center ${s.highlight ? 'bg-primary-container text-on-primary border-primary' : 'bg-surface-container-low border-outline-variant/30'}`}>
                  <span className={`material-symbols-outlined text-[18px] ${s.highlight ? 'text-on-primary' : 'text-tertiary'}`}>{s.icon}</span>
                  <span className={`text-xs font-bold block mt-1 ${s.highlight ? 'text-on-primary' : 'text-on-surface'}`}>{s.title}</span>
                  <span className={`text-xs ${s.highlight ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCENARIO */}
      <section className="w-full py-16 bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 space-y-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase text-primary font-semibold tracking-wider">End-to-End Execution Scenario</span>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 font-headline">From a simple question to a better customer experience.</h2>
            <p className="text-base text-on-surface-variant mt-2">Scenario: An entrepreneur opens a commercial corporate account. Trace all 13 synchronized milestones across WemaOne's connected fabric.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { t: 'Checks Requirements Online', d: 'Customer queries account prerequisites via website; automated guidance displays checklist.' },
              { t: 'Books Branch Appointment', d: 'Selects University Road for Thursday at 11:30 AM based on live wait predictive models.' },
              { t: 'Receives Digital Queue Ticket', d: 'Ticket #WMA-2841 generated instantly in mobile wallet with real-time dynamic countdown.' },
              { t: 'Uploads KYC Documents', d: 'Captures CAC corporate registry & director ID via smartphone camera before traveling.' },
              { t: 'OCR Flags Unclear Stamp', d: 'WemaOne AI detects smudged tax stamp before arrival, preventing an embarrassing desk rejection.' },
              { t: 'Customer Fixes it at Home', d: 'Re-scans official digital PDF in 30 seconds; status shifts to Verified Pre-Flight Pass.' },
              { t: 'In-Journey Fee Settled', d: '₦5,000 account setup fee processed instantly via NIP; clearance stamp tied to ticket.' },
              { t: 'Customer Visits Branch', d: 'Arrives at 11:38 AM. Geofence recognizes arrival; screen directs customer to Counter 4.' },
              { t: 'Service Finished in 7 Mins', d: 'Officer executes physical biometric scan only. Zero paper review or cashier handoffs needed.' },
              { t: '5-Star Feedback Logged', d: 'Prompted on phone upon exit; client notes ease of prior document upload and zero wait.' },
              { t: 'Social Studio Logs Signal', d: 'AI identifies recurring tax stamp ambiguity in corporate registrations across region.' },
              { t: 'Branch Connect Shares Fix', d: 'University Road team shares updated tax portal guideline; 42 regional branches sync in 1 hour.' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30">
                <span className="text-xs text-primary font-bold">STEP {String(i + 1).padStart(2, '0')}</span>
                <h4 className="text-sm font-semibold text-on-surface mt-1">{s.t}</h4>
                <p className="text-xs text-on-surface-variant mt-1">{s.d}</p>
              </div>
            ))}
            {/* Step 13 highlight */}
            <div className="p-4 rounded-lg bg-primary-fixed/30 border border-primary/40 xl:col-span-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-primary font-bold">STEP 13 · THE OUTCOME</span>
                  <h4 className="text-sm font-bold text-on-surface mt-1">Executive Visibility: 24% Queue Reduction Realized</h4>
                  <p className="text-xs text-on-surface-variant mt-1">WemaOne Intelligence reports 24% less dwell time for business desks network-wide by end of month.</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded bg-tertiary-fixed text-tertiary shrink-0"><span className="material-symbols-outlined text-[16px]">trending_up</span> Continuous System ROI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTELLIGENCE DARK */}
      <section className="w-full py-16 bg-[#0A0D14] text-white">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E293B] pb-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121826] border border-[#1E293B] text-primary-fixed mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                <span className="text-xs uppercase font-semibold">Real-Time Surveillance Stream</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-headline">Every interaction creates intelligence.</h2>
              <p className="text-base text-slate-400 mt-2">WemaOne turns customer activity, operational data, and feedback into deterministic insights teams can act on instantly.</p>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span> NETWORK RADAR: 64 BRANCHES SYNCHRONIZED</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'EMERGING ISSUE', badge: '+34% Spike', badgeColor: 'text-error', title: 'Business Account Document Confusion', desc: 'Recurring questions around certificate of incorporation apostille requirements.', foot: 'Detection: 18m ago', footRight: 'Social Studio Link' },
              { label: 'AUTOMATED ACTION', badge: 'Ready to Deploy', badgeColor: 'text-tertiary-fixed-dim', title: 'Deploy Pre-Flight Checklist', desc: 'Push dynamic visual checklist to mobile appointment flow for all registered LLC applicants.', foot: 'Predicted impact: -22m Desk Time', footRight: 'Approve Run' },
              { label: 'BRANCH INSIGHT', badge: 'Top Performer', badgeColor: 'text-tertiary-fixed-dim', title: 'University Road Optimization', desc: 'Documentation delays dropped 41% after adopting the verified pre-upload checklist.', foot: 'Adoption: 42 Branches', footRight: 'View Case Study' },
              { label: 'CUSTOMER SIGNAL', badge: '82% Majority', badgeColor: 'text-primary-fixed', title: 'WhatsApp Preference Surge', desc: 'Corporate clients prefer real-time WhatsApp ticket notifications over standard SMS.', foot: 'Routing: Auto-Configured', footRight: 'Status: Active' },
            ].map((c, i) => (
              <div key={i} className="bg-[#121826] border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs"><span>{c.label}</span><span className={`${c.badgeColor} flex items-center gap-1 font-bold`}>{c.badge}</span></div>
                  <h4 className="text-sm font-semibold text-white">{c.title}</h4>
                  <p className="text-xs text-slate-400">{c.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-slate-400 text-xs"><span>{c.foot}</span><span className="text-primary-fixed">{c.footRight}</span></div>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div className="bg-[#121826] border border-[#1E293B] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-3">
              <div><h3 className="text-sm font-bold text-white">Throughput & Resolution Velocity Matrix</h3><p className="text-xs text-slate-400">Across 64 Connected Branches (Past 24 Hours)</p></div>
              <div className="flex items-center gap-3 text-xs"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-container"></span> Wait Time (min)</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span> Pre-Verification Rate</span></div>
            </div>
            <div className="pt-4">
              <svg className="w-full h-40" fill="none" preserveAspectRatio="none" viewBox="0 0 1000 160">
                <line stroke="#1E293B" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="40" y2="40"/>
                <line stroke="#1E293B" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="80" y2="80"/>
                <line stroke="#1E293B" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="120" y2="120"/>
                <path d="M0 130 C150 110, 300 70, 450 65 C600 60, 750 35, 1000 25" fill="none" stroke="#4edea3" strokeWidth="3"/>
                <path d="M0 45 C150 55, 300 85, 450 110 C600 130, 750 135, 1000 145" fill="none" stroke="#0052FF" strokeWidth="3"/>
                <circle cx="450" cy="65" fill="#4edea3" r="5"/>
                <circle cx="450" cy="110" fill="#0052FF" r="5"/>
              </svg>
              <div className="flex justify-between text-xs text-slate-400 pt-2"><span>08:00 AM (Branch Open)</span><span>11:00 AM</span><span>02:00 PM (Peak)</span><span>05:00 PM (Close)</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL STUDIO */}
      <section className="w-full py-16 px-4 lg:px-8 max-w-[1600px] mx-auto">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase text-primary font-semibold tracking-wider">Social Studio Engine</span>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 font-headline">Your customers are already telling you what needs to improve.</h2>
          <p className="text-base text-on-surface-variant mt-2">WemaOne turns conversational chatter across X, WhatsApp, mobile apps, and chat into categorized signals, predictive insight, and desk-ready workflows.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 lg:p-6 shadow-sm">
          {/* Left: Threads */}
          <div className="lg:col-span-5 space-y-3 border-b lg:border-b-0 lg:border-r border-outline-variant/30 pb-4 lg:pb-0 lg:pr-6">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">forum</span><span className="font-semibold text-on-surface text-sm">Unified Inbound Stream</span></div>
              <span className="text-xs text-tertiary font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-ping"></span> 5 Channels Active</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container-low border-l-4 border-primary space-y-1.5">
              <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-[10px]">W</span><span className="text-xs font-bold text-on-surface">Tunde O. (+234 802 ...)</span></div><span className="text-xs text-on-surface-variant">2m ago</span></div>
              <p className="text-xs text-on-surface font-medium">"Can I register our foreign affiliate without physical presence at the central branch?"</p>
              <div className="flex items-center gap-2"><span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-xs">Onboarding Docs</span><span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-tertiary text-xs">Positive Sentiment</span></div>
            </div>
            <div className="p-3 rounded-lg hover:bg-surface-container-low/50 transition-colors border border-outline-variant/20 space-y-1">
              <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-on-surface text-white flex items-center justify-center font-bold text-[10px]">X</span><span className="text-xs font-semibold text-on-surface">@meridian_capital</span></div><span className="text-xs text-on-surface-variant">9m ago</span></div>
              <p className="text-xs text-on-surface-variant line-clamp-1">"POS terminal batch settlement failed for batch #8921. Needs counter validation."</p>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-xs">POS Settlement</span>
            </div>
            <div className="p-3 rounded-lg hover:bg-surface-container-low/50 transition-colors border border-outline-variant/20 space-y-1">
              <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[10px]">App</span><span className="text-xs font-semibold text-on-surface">Zainab B.</span></div><span className="text-xs text-on-surface-variant">14m ago</span></div>
              <p className="text-xs text-on-surface-variant line-clamp-1">"Corporate card replacement readiness status for Marina Branch pickup?"</p>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-xs">Card Pickup</span>
            </div>
          </div>
          {/* Right: AI Response */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3"><span className="text-xs text-on-surface font-semibold">Real-Time Sentiment Index:</span>
                <div className="flex items-center gap-1.5 text-xs"><span className="px-2 py-0.5 rounded bg-tertiary-fixed text-tertiary font-bold">76% Positive</span><span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">18% Neutral</span><span className="px-2 py-0.5 rounded bg-error-container text-on-error-container">6% Urgent</span></div>
              </div>
              <span className="text-xs text-primary font-bold">Latency: 4.8s</span>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-lowest border border-primary/30 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span><span className="font-semibold text-primary text-sm">Compliance-Verified AI Response</span></div>
                <span className="text-xs bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">99.8% Match</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low text-xs text-on-surface space-y-2">
                <p>"Hello Tunde! Yes, foreign affiliates can complete registration digitally. Upload your notarized certificate of good standing directly to your WemaOne pre-verification pass, and our corporate desk will issue your account credentials without an in-branch appointment."</p>
                <div className="pt-1 flex items-center gap-1.5 text-on-surface-variant border-t border-outline-variant/20"><span className="material-symbols-outlined text-[14px]">policy</span><span>Regulatory Source: Central Bank Circular #CB-2025/11 · Corporate Digital Onboarding</span></div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-colors">Send Verified Response</button>
                  <button className="px-4 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-medium hover:bg-surface-container-high transition-colors">Edit Draft</button>
                </div>
                <button className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-tertiary-fixed text-tertiary text-xs font-semibold hover:bg-tertiary-fixed/80 transition-colors"><span className="material-symbols-outlined text-[16px]">bolt</span><span>Escalate to Smart Queue Pre-Check</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM ARCHITECTURE */}
      <section className="w-full py-16 bg-surface-container-low border-y border-outline-variant/30" id="platform">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs uppercase text-primary font-semibold tracking-wider">Enterprise Topology</span>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 font-headline">WemaOne Platform Core Architecture</h2>
            <p className="text-base text-on-surface-variant mt-2">A centralized event-sourced engine connecting client-facing endpoints with branch operations and analytics in a closed-loop topology.</p>
          </div>
          <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 lg:p-8 shadow-sm overflow-hidden">
            <div className="max-w-md mx-auto p-4 rounded-xl bg-primary text-on-primary text-center shadow-lg border border-primary-container relative z-20">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center"><span className="text-primary font-bold text-xs">W</span></div>
                <span className="text-lg font-bold text-white tracking-tight font-headline">WEMAONE CORE ENGINE</span>
              </div>
              <span className="text-xs text-primary-fixed uppercase tracking-wider font-semibold">Deterministic State Orchestrator</span>
              <p className="text-xs text-on-primary/80 mt-1">High-throughput synchronization bus connecting queue states, documents, and payments.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 relative z-10">
              {[
                { icon: 'person_check', name: 'Customer', sub: 'Web & Mobile Web' },
                { icon: 'format_list_numbered', name: 'Smart Queue', sub: 'Virtual Tickets' },
                { icon: 'badge', name: 'Documents', sub: 'OCR & ID Checks' },
                { icon: 'account_balance_wallet', name: 'Payments', sub: 'Instant Rail Settlement' },
                { icon: 'meeting_room', name: 'Branches', sub: '5 Coordinated Hubs' },
                { icon: 'forum', name: 'Social Studio', sub: 'Omnichannel Inflow' },
              ].map((n, i) => (
                <div key={i} className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-center space-y-1">
                  <span className="material-symbols-outlined text-primary text-[22px]">{n.icon}</span>
                  <h5 className="text-sm font-bold text-on-surface">{n.name}</h5>
                  <span className="text-xs text-on-surface-variant block">{n.sub}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">analytics</span></span>
                <div><span className="text-sm font-bold text-on-surface">Unified Telemetry Stream → WemaOne Intelligence</span><p className="text-xs text-on-surface-variant">Real-time systemic pattern detection across all connected nodes.</p></div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/30 shrink-0"><span className="material-symbols-outlined text-tertiary text-[18px]">restart_alt</span><span className="text-xs font-semibold text-on-surface">Continual Refinement Loop Active</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="w-full py-16 px-4 lg:px-8 max-w-[1600px] mx-auto">
        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase text-primary font-semibold tracking-wider">Enterprise Security Framework</span>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 font-headline">Built for organizations where trust matters.</h2>
          <p className="text-base text-on-surface-variant mt-2">Financial and civic grade isolation built into every layer of authentication, network egress, and customer identification storage.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: 'shield_person', label: 'RBAC MATRIX', title: 'Role-Based Access Control', desc: 'Granular permission scopes for tellers, branch heads, customer support agents, and regional executives.' },
            { icon: 'key', label: 'SSO / MFA', title: 'SSO & Multi-Factor Auth', desc: 'Native enterprise single sign-on integration supporting Azure AD, Okta, and FIDO2 keys.' },
            { icon: 'share_location', label: 'SCOPED DATA', title: 'Branch-Level Scoped Access', desc: 'Strict operational partitioning ensuring branch personnel can view records only for assigned territories.' },
            { icon: 'history_edu', label: 'WORM STORAGE', title: 'Immutable Audit Visibility', desc: 'Cryptographically signed audit trails for every document inspection, payment settlement, and staff action.' },
            { icon: 'api', label: 'mTLS GATEWAYS', title: 'Controlled Banking Gateways', desc: 'Mutual TLS secured connection to legacy core banking processors (Finacle, Temenos, Oracle FLEXCUBE).' },
            { icon: 'cloud_sync', label: 'GEO-RESIDENT', title: 'Data-Residency Workflows', desc: 'Compliant in-country data storage honoring NDPR, GDPR, and central bank local host retention guidelines.' },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-2">
              <div className="flex items-center justify-between"><span className="material-symbols-outlined text-primary text-[24px]">{s.icon}</span><span className="text-xs font-bold text-primary">{s.label}</span></div>
              <h4 className="text-sm font-bold text-on-surface">{s.title}</h4>
              <p className="text-xs text-on-surface-variant">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 px-4 lg:px-8 max-w-[1600px] mx-auto mb-16">
        <div className="relative bg-surface-container-highest/60 rounded-2xl border border-outline-variant/50 p-8 lg:p-12 overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-lowest text-primary text-xs font-semibold border border-outline-variant/30">
              <div className="w-4 h-4 bg-primary rounded flex items-center justify-center"><span className="text-white font-bold text-[8px]">W</span></div>
              <span>DEPLOY WEMAONE ENTERPRISE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight font-headline">Connect the journey.<br className="hidden sm:inline" />Improve the experience.</h2>
            <p className="text-base text-on-surface-variant max-w-xl">Give customers a simpler way to get served — and give your operations teams the intelligence to keep getting faster, sharper, and better every day.</p>
            <div className="pt-1 flex flex-wrap items-center gap-4">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-semibold transition-all shadow-[0_2px_8px_rgba(0,82,255,0.3)]">
                <span>Get Started</span><span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <a href="#platform" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-semibold border border-outline-variant/60 shadow-sm transition-all">Explore the Platform</a>
            </div>
            <div className="pt-2 flex items-center gap-2 text-on-surface-variant text-xs"><span className="material-symbols-outlined text-primary text-[18px]">support_agent</span><span>Talk to our Solutions Engineering Team: <span className="text-on-surface font-semibold underline cursor-pointer">enterprise@wemaone.com</span></span></div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center opacity-10 pointer-events-none">
            <svg className="w-full h-full" fill="none" viewBox="0 0 400 400"><circle cx="200" cy="200" r="160" stroke="#0052ff" strokeWidth="2"/><circle cx="200" cy="200" r="110" stroke="#0052ff" strokeWidth="2"/><circle cx="200" cy="200" r="60" stroke="#0052ff" strokeWidth="2"/><line stroke="#0052ff" strokeWidth="1.5" x1="40" x2="360" y1="200" y2="200"/><line stroke="#0052ff" strokeWidth="1.5" x1="200" x2="200" y1="40" y2="360"/></svg>
          </div>
        </div>
      </section>
    </div>
  );
}
