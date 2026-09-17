import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { StatusBadge, LoadingPage, PageHeader, Card, CardTitle, PrimaryButton, Field, Select, Input } from '../../components/ui/Elements';

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

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Check papers before you leave"
        title="Documents & TrustVerify"
        subtitle="Upload your documents and let AI catch mistakes before your visit — never get turned away."
      />

      {/* Upload */}
      <Card className="mb-6">
        <CardTitle icon="upload_file">Upload Document</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Field label="Service">
            <Select value={form.service_id} onChange={e => setForm({...form, service_id: e.target.value})}>
              <option value="">Select service</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
          <Field label="Document Type">
            <Input type="text" value={form.requirement_name} onChange={e => setForm({...form, requirement_name: e.target.value})}
              placeholder="e.g. CAC Certificate, Valid ID" />
          </Field>
        </div>
        <div className="mb-4">
          <Field label="File">
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => setSelectedFile(e.target.files[0])}
              className="w-full px-3 py-2 border border-outline-variant/60 rounded-lg text-sm text-on-surface bg-surface-container-lowest file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary-container file:text-white file:text-xs file:font-semibold cursor-pointer" />
          </Field>
          <p className="text-xs text-outline mt-1 font-data-mono-xs">Accepted: PDF, JPEG, PNG (max 16MB)</p>
        </div>
        <PrimaryButton onClick={handleUpload} disabled={!selectedFile || uploading}>
          {uploading ? 'Uploading & Verifying...' : 'Upload & Verify'}
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
        </PrimaryButton>
      </Card>

      {/* Documents List */}
      <Card delay={120}>
        <CardTitle icon="folder_open">Your Documents</CardTitle>
        {documents.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No documents uploaded yet</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, i) => (
              <Reveal key={doc.id} delay={i * 60}
                className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center">
                    <span className="text-primary font-data-mono-xs text-xs font-bold">{doc.mime_type?.includes('pdf') ? 'PDF' : 'IMG'}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-on-surface">{doc.original_filename}</div>
                    <div className="text-xs text-on-surface-variant">{doc.requirement_name} • {(doc.file_size / 1024).toFixed(0)}KB</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={doc.status} />
                  {doc.verifications?.[0] && (
                    <div className="text-right">
                      <div className="text-xs text-on-surface-variant">Confidence</div>
                      <div className="text-sm font-semibold text-tertiary font-data-mono">{(doc.verifications[0].confidence_score * 100).toFixed(0)}%</div>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
