import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { StatusBadge, LoadingPage, PageHeader } from '../../components/ui/Elements';

export default function BranchDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/documents/').then(res => setDocuments(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Pre-verified paperwork"
        title="Document Review"
        subtitle="AI-checked documents submitted by customers before their visits."
      />

      <Reveal delay={100} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
        {documents.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-10">No documents to review</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-on-surface-variant">File</th>
                  <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Verification</th>
                  <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id} className="border-t border-outline-variant/15 hover:bg-surface-container-low/60 transition-colors">
                    <td className="px-4 py-3 text-on-surface font-medium">{doc.original_filename}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{doc.requirement_name || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                    <td className="px-4 py-3">
                      {doc.verifications?.[0] ? (
                        <StatusBadge status={doc.verifications[0].overall_status} />
                      ) : <span className="text-outline-variant">-</span>}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant font-data-mono">
                      {doc.verifications?.[0] ? `${(doc.verifications[0].confidence_score * 100).toFixed(0)}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Reveal>
    </div>
  );
}
