import SvgIcon from '../../components/ui/SvgIcon';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, PageHeader } from '../../components/ui/Elements';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/branches/').then(res => setBranches(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        eyebrow="Find a location"
        title="Our Branches"
        subtitle="Find a branch near you. Check availability and book appointments."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch, i) => (
          <Reveal key={branch.id} delay={(i % 3) * 90} direction="up"
            className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="h-32 bg-gradient-to-br from-primary to-primary-container flex items-center justify-center relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-20" fill="none" viewBox="0 0 400 160" preserveAspectRatio="none">
                <circle cx="320" cy="20" r="80" stroke="#ffffff" strokeWidth="2" />
                <circle cx="340" cy="30" r="50" stroke="#ffffff" strokeWidth="2" />
              </svg>
              <div className="text-center text-white relative">
                <SvgIcon name="account_balance" className="text-[28px] mb-1" />
                <div className="font-headline-md font-bold text-lg">{branch.name}</div>
              </div>
            </div>
            <div className="p-5 space-y-2">
              <p className="text-sm text-on-surface flex items-start gap-2">
                <SvgIcon name="location_on" className="text-[16px] text-primary-container mt-0.5" />{branch.address}
              </p>
              <p className="text-sm text-on-surface-variant pl-6">{branch.city}, {branch.state}</p>
              <p className="text-sm text-on-surface-variant flex items-center gap-2 pl-6">
                <SvgIcon name="schedule" className="text-[16px] text-tertiary" />{branch.opening_hours}
              </p>
              <p className="text-sm text-on-surface-variant flex items-center gap-2 pl-6">
                <SvgIcon name="call" className="text-[16px] text-primary-container" />{branch.phone}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
