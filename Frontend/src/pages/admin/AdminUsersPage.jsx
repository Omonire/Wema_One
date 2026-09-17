import { useState, useEffect } from 'react';
import { api } from '../../services/api';

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

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>

      <div className="flex gap-3 mb-6">
        {['', 'CUSTOMER', 'BRANCH_OFFICER', 'BRANCH_MANAGER', 'ADMIN'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === f ? 'bg-[#0C2D57] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f ? f.replace(/_/g, ' ') : 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.first_name} {u.last_name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1">
                    <option value="CUSTOMER">Customer</option>
                    <option value="BRANCH_OFFICER">Branch Officer</option>
                    <option value="BRANCH_MANAGER">Branch Manager</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleUser(u.id)}
                    className={`text-xs px-2 py-1 rounded ${u.is_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {u.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
