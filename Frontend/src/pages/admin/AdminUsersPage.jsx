import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, PageHeader } from '../../components/ui/Elements';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const params = filter ? `?role=${filter}` : '';
    api.get(`/admin/users${params}`).then(res => setUsers(res.data)).finally(() => setLoading(false));
  }, [filter]);

  const toggleUser = async (userId) => {
    await api.post(`/admin/users/${userId}/toggle`);
    setUsers(users.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
  };

  const changeRole = async (userId, role) => {
    await api.put(`/admin/users/${userId}/role`, { role });
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        eyebrow="People"
        title="Manage Users"
        subtitle="Roles and account access across the platform."
      />

      <Reveal direction="down" delay={80} className="flex flex-wrap gap-2 mb-6">
        {['', 'CUSTOMER', 'BRANCH_OFFICER', 'BRANCH_MANAGER', 'ADMIN'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-primary-container text-white shadow-[0_2px_8px_rgba(0,82,255,0.25)]' : 'bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'}`}>
            {f ? f.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : 'All'}
          </button>
        ))}
      </Reveal>

      <Reveal delay={140} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Name</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Email</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Role</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-outline-variant/15 hover:bg-surface-container-low/60 transition-colors">
                  <td className="px-4 py-3 font-medium text-on-surface">{u.first_name} {u.last_name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{u.email}</td>
                  <td className="px-4 py-3">
                    <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                      className="text-xs border border-outline-variant/60 rounded-lg px-2 py-1 bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/60">
                      <option value="CUSTOMER">Customer</option>
                      <option value="BRANCH_OFFICER">Branch Officer</option>
                      <option value="BRANCH_MANAGER">Branch Manager</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${u.is_active ? 'bg-tertiary-fixed text-tertiary' : 'bg-error-container text-on-error-container'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleUser(u.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${u.is_active ? 'bg-error-container text-on-error-container hover:bg-error hover:text-white' : 'bg-tertiary-fixed text-tertiary hover:bg-tertiary hover:text-white'}`}>
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
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
