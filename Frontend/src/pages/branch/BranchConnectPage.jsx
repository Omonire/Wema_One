import { useState, useEffect } from 'react';
import { api } from '../../services/api';

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

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BranchConnect</h1>
          <p className="text-gray-500 text-sm">Internal knowledge sharing across branches</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#0C2D57] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0A2445]">
          {showForm ? 'Cancel' : 'Share Solution'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input type="text" placeholder="Search solutions..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">All Types</option>
          <option value="SOLUTION">Solutions</option>
          <option value="LESSON_LEARNED">Lessons Learned</option>
          <option value="TREND">Trends</option>
        </select>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Share a Solution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.post_type} onChange={e => setForm({...form, post_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="SOLUTION">Solution</option>
                <option value="LESSON_LEARNED">Lesson Learned</option>
                <option value="TREND">Customer Trend</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Queue Management" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          {form.post_type === 'SOLUTION' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Problem</label>
                <input type="text" value={form.solution.problem} onChange={e => setForm({...form, solution: {...form.solution, problem: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                <input type="text" value={form.solution.solution} onChange={e => setForm({...form, solution: {...form.solution, solution: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                <input type="text" value={form.solution.result} onChange={e => setForm({...form, solution: {...form.solution, result: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          )}
          <button onClick={handleCreate} className="bg-[#0C2D57] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#0A2445]">
            Publish
          </button>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-10">No posts found</p>
        ) : posts.map(post => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${post.post_type === 'SOLUTION' ? 'bg-green-100 text-green-700' : post.post_type === 'LESSON_LEARNED' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                {post.post_type?.replace(/_/g, ' ')}
              </span>
              {post.category && <span className="text-xs text-gray-500">{post.category}</span>}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{post.content}</p>
            {post.solutions?.[0] && (
              <div className="bg-gray-50 rounded-lg p-4 mb-3 space-y-2">
                <div><span className="text-xs font-medium text-gray-500">Problem:</span> <span className="text-sm text-gray-700">{post.solutions[0].problem}</span></div>
                <div><span className="text-xs font-medium text-gray-500">Solution:</span> <span className="text-sm text-gray-700">{post.solutions[0].solution}</span></div>
                {post.solutions[0].result && <div><span className="text-xs font-medium text-gray-500">Result:</span> <span className="text-sm text-gray-700">{post.solutions[0].result}</span></div>}
                <div className="text-xs text-gray-400">Used by {post.solutions[0].adopted_by_count} branches</div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {post.author?.first_name} {post.author?.last_name} • {post.branch?.name}
              </div>
              <button onClick={() => markUseful(post.id)} disabled={post.is_useful}
                className={`text-xs px-3 py-1 rounded-lg ${post.is_useful ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                Useful ({post.useful_count})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
