import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, PageHeader } from '../../components/ui/Elements';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services/').then(res => setServices(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Service catalog"
        title="Manage Services"
        subtitle="Fees, durations, and requirements for every service."
      />

      <Reveal delay={100} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Name</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Category</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Fee</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Est. Time</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Requirements</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} className="border-t border-outline-variant/15 hover:bg-surface-container-low/60 transition-colors">
                  <td className="px-4 py-3 font-medium text-on-surface">{s.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{s.category}</td>
                  <td className="px-4 py-3 text-on-surface-variant font-data-mono">{s.fee > 0 ? `₦${s.fee.toLocaleString()}` : 'Free'}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{s.estimated_time_minutes} min</td>
                  <td className="px-4 py-3 text-on-surface-variant">{s.requirements?.length || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${s.is_active ? 'bg-tertiary-fixed text-tertiary' : 'bg-error-container text-on-error-container'}`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
