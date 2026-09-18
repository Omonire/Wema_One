import SvgIcon from '../../components/ui/SvgIcon';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, PageHeader, Card, CardTitle, PrimaryButton, Field, Input, Select, Textarea } from '../../components/ui/Elements';

export default function BranchConnectPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    branch_id: '', title: '', content: '', post_type: 'SOLUTION', category: '',
    solution: { problem: '', solution: '', result: '' }
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.set('type', filter);
    if (search) params.set('search', search);
    api.get(`/branchconnect/posts?${params}`).then(res => setPosts(res.data)).finally(() => setLoading(false));
  }, [filter, search]);

  const handleCreate = async () => {
    try {
      const data = { ...form, branch_id: parseInt(form.branch_id) || 1 };
      if (form.post_type !== 'SOLUTION') delete data.solution;
      await api.post('/branchconnect/posts', data);
      const res = await api.get('/branchconnect/posts');
      setPosts(res.data);
      setShowForm(false);
      setForm({ branch_id: '', title: '', content: '', post_type: 'SOLUTION', category: '', solution: { problem: '', solution: '', result: '' } });
    } catch (err) {
      alert(err.message || 'Failed to create post');
    }
  };

  const markUseful = async (postId) => {
    await api.post(`/branchconnect/posts/${postId}/useful`);
    setPosts(posts.map(p => p.id === postId ? { ...p, useful_count: p.useful_count + 1, is_useful: true } : p));
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="Shared best practices"
        title="BranchConnect"
        subtitle="When one branch learns a faster way to solve a problem, every other branch learns it too."
        action={
          <PrimaryButton onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Share Solution'}
            <SvgIcon name={showForm ? 'close' : 'add_circle'} className="text-[16px]" />
          </PrimaryButton>
        }
      />

      {/* Filters */}
      <Reveal direction="down" delay={80} className="flex gap-3 mb-6">
        <Input type="text" placeholder="Search solutions..." value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={filter} onChange={e => setFilter(e.target.value)} className="max-w-[180px]">
          <option value="">All Types</option>
          <option value="SOLUTION">Solutions</option>
          <option value="LESSON_LEARNED">Lessons Learned</option>
          <option value="TREND">Trends</option>
        </Select>
      </Reveal>

      {/* Create Form */}
      {showForm && (
        <Reveal direction="down" className="mb-6">
          <Card reveal={false}>
            <CardTitle icon="lightbulb">Share a Solution</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="Type">
                <Select value={form.post_type} onChange={e => setForm({...form, post_type: e.target.value})}>
                  <option value="SOLUTION">Solution</option>
                  <option value="LESSON_LEARNED">Lesson Learned</option>
                  <option value="TREND">Customer Trend</option>
                </Select>
              </Field>
              <Field label="Category">
                <Input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  placeholder="e.g. Queue Management" />
              </Field>
            </div>
            <div className="mb-4">
              <Field label="Title">
                <Input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </Field>
            </div>
            <div className="mb-4">
              <Field label="Content">
                <Textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={3} />
              </Field>
            </div>
            {form.post_type === 'SOLUTION' && (
              <div className="bg-surface-container-low rounded-xl p-4 mb-4 space-y-3 border border-outline-variant/30">
                <Field label="Problem">
                  <Input type="text" value={form.solution.problem} onChange={e => setForm({...form, solution: {...form.solution, problem: e.target.value}})} />
                </Field>
                <Field label="Solution">
                  <Input type="text" value={form.solution.solution} onChange={e => setForm({...form, solution: {...form.solution, solution: e.target.value}})} />
                </Field>
                <Field label="Result">
                  <Input type="text" value={form.solution.result} onChange={e => setForm({...form, solution: {...form.solution, result: e.target.value}})} />
                </Field>
              </div>
            )}
            <PrimaryButton onClick={handleCreate}>
              Publish
              <SvgIcon name="send" className="text-[16px]" />
            </PrimaryButton>
          </Card>
        </Reveal>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-10">No posts found</p>
        ) : posts.map((post, i) => (
          <Reveal key={post.id} delay={Math.min(i * 70, 350)}
            className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.post_type === 'SOLUTION' ? 'bg-tertiary-fixed text-tertiary' : post.post_type === 'LESSON_LEARNED' ? 'bg-primary-fixed text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                {post.post_type?.replace(/_/g, ' ')}
              </span>
              {post.category && <span className="text-xs text-on-surface-variant">{post.category}</span>}
            </div>
            <h3 className="font-semibold text-on-surface mb-1">{post.title}</h3>
            <p className="text-sm text-on-surface-variant mb-3">{post.content}</p>
            {post.solutions?.[0] && (
              <div className="bg-surface-container-low rounded-xl p-4 mb-3 space-y-2 border border-outline-variant/30">
                <div><span className="text-xs font-semibold text-primary">Problem:</span> <span className="text-sm text-on-surface">{post.solutions[0].problem}</span></div>
                <div><span className="text-xs font-semibold text-tertiary">Solution:</span> <span className="text-sm text-on-surface">{post.solutions[0].solution}</span></div>
                {post.solutions[0].result && <div><span className="text-xs font-semibold text-primary-container">Result:</span> <span className="text-sm text-on-surface">{post.solutions[0].result}</span></div>}
                <div className="text-xs text-outline font-data-mono-xs">Used by {post.solutions[0].adopted_by_count} branches</div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-xs text-on-surface-variant">
                {post.author?.first_name} {post.author?.last_name} • {post.branch?.name}
              </div>
              <button onClick={() => markUseful(post.id)} disabled={post.is_useful}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${post.is_useful ? 'bg-tertiary-fixed text-tertiary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                Useful ({post.useful_count})
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
