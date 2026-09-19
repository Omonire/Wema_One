import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, PageHeader } from '../../components/ui/Elements';

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/branches/').then(res => setBranches(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Network"
        title="Manage Branches"
        subtitle="All offices on the Non_queue_Bank platform."
      />

      <Reveal delay={100} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Name</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Address</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">City</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody>
              {branches.map(b => (
                <tr key={b.id} className="border-t border-outline-variant/15 hover:bg-surface-container-low/60 transition-colors">
                  <td className="px-4 py-3 font-medium text-on-surface">{b.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{b.address}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{b.city}</td>
                  <td className="px-4 py-3 text-on-surface-variant font-data-mono-xs">{b.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${b.is_active ? 'bg-tertiary-fixed text-tertiary' : 'bg-error-container text-on-error-container'}`}>
                      {b.is_active ? 'Active' : 'Inactive'}
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
