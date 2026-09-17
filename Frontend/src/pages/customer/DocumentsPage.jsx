import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/Elements';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ service_id: '', requirement_name: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    Promise.all([
      api.get('/documents/'),
      api.get('/services/')
    ]).then(([d, s]) => {
      setDocuments(d.data);
      setServices(s.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      if (form.service_id) fd.append('service_id', form.service_id);
      if (form.requirement_name) fd.append('requirement_name', form.requirement_name);
      await api.upload('/documents/upload', fd);
      const res = await api.get('/documents/');
      setDocuments(res.data);
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Document Upload & TrustVerify</h1>

      {/* Upload */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Upload Document</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select value={form.service_id} onChange={e => setForm({...form, service_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Select service</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <input type="text" value={form.requirement_name} onChange={e => setForm({...form, requirement_name: e.target.value})}
              placeholder="e.g. CAC Certificate, Valid ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => setSelectedFile(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          <p className="text-xs text-gray-400 mt-1">Accepted: PDF, JPEG, PNG (max 16MB)</p>
        </div>
        <button onClick={handleUpload} disabled={!selectedFile || uploading}
          className="bg-[#0C2D57] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#0A2445] disabled:opacity-50">
          {uploading ? 'Uploading & Verifying...' : 'Upload & Verify'}
        </button>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Your Documents</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-gray-500">No documents uploaded yet</p>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">{doc.mime_type?.includes('pdf') ? 'PDF' : 'IMG'}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{doc.original_filename}</div>
                    <div className="text-xs text-gray-500">{doc.requirement_name} • {(doc.file_size / 1024).toFixed(0)}KB</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={doc.status} />
                  {doc.verifications?.[0] && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Confidence</div>
                      <div className="text-sm font-medium text-gray-900">{(doc.verifications[0].confidence_score * 100).toFixed(0)}%</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
