import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/Elements';

export default function BranchDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/documents/').then(res => setDocuments(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Document Review</h1>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {documents.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-10">No documents to review</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">File</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Verification</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">{doc.original_filename}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.requirement_name || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                  <td className="px-4 py-3">
                    {doc.verifications?.[0] ? (
                      <StatusBadge status={doc.verifications[0].overall_status} />
                    ) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {doc.verifications?.[0] ? `${(doc.verifications[0].confidence_score * 100).toFixed(0)}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
