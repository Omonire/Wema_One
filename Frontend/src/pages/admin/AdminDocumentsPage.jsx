import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { StatusBadge, LoadingPage, PageHeader } from '../../components/ui/Elements';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/documents/').then(res => setDocuments(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const verified = documents.filter(d => d.status === 'VERIFIED').length;
  const actionRequired = documents.filter(d => d.status === 'ACTION_REQUIRED').length;

  const stats = [
    { label: 'Total Documents', value: documents.length, color: 'text-on-surface' },
    { label: 'Verified', value: verified, color: 'text-tertiary' },
    { label: 'Action Required', value: actionRequired, color: 'text-error' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="TrustVerify AI"
        title="Document Analytics"
        subtitle="Verification health across every document submitted."
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 70} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 text-center shadow-sm">
            <div className={`text-2xl font-bold font-data-mono ${s.color}`}>{s.value}</div>
            <div className="text-xs text-on-surface-variant">{s.label}</div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">File</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Type</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id} className="border-t border-outline-variant/15 hover:bg-surface-container-low/60 transition-colors">
                  <td className="px-4 py-3 font-medium text-on-surface">{doc.original_filename}</td>
                  <td className="px-4 py-3 text-on-surface-variant font-data-mono-xs">#{doc.customer_id}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{doc.requirement_name || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                  <td className="px-4 py-3 text-on-surface-variant font-data-mono">
                    {doc.verifications?.[0] ? `${(doc.verifications[0].confidence_score * 100).toFixed(0)}%` : '-'}
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
