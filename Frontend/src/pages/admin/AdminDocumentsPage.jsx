import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/Elements';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/documents/').then(res => setDocuments(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  const verified = documents.filter(d => d.status === 'VERIFIED').length;
  const actionRequired = documents.filter(d => d.status === 'ACTION_REQUIRED').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Document Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
          <div className="text-xs text-gray-500">Total Documents</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{verified}</div>
          <div className="text-xs text-gray-500">Verified</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{actionRequired}</div>
          <div className="text-xs text-gray-500">Action Required</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">File</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{doc.original_filename}</td>
                <td className="px-4 py-3 text-gray-600">#{doc.customer_id}</td>
                <td className="px-4 py-3 text-gray-600">{doc.requirement_name || '-'}</td>
                <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                <td className="px-4 py-3 text-gray-600">
                  {doc.verifications?.[0] ? `${(doc.verifications[0].confidence_score * 100).toFixed(0)}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
