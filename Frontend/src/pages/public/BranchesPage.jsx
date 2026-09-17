import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/branches/').then(res => setBranches(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Branches</h1>
        <p className="text-gray-600 mt-2">Find a branch near you. Check availability and book appointments.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
            <div className="h-32 bg-gradient-to-br from-[#0C2D57] to-[#1a4080] flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-1">{branch.name.split(' ')[0]}</div>
                <div className="text-blue-200 text-sm">{branch.name}</div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-2">{branch.address}</p>
              <p className="text-sm text-gray-500 mb-1">{branch.city}, {branch.state}</p>
              <p className="text-sm text-gray-500 mb-3">{branch.opening_hours}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{branch.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
