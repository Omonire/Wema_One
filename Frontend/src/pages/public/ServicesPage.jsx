import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services/').then(res => setServices(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#0C2D57] border-t-transparent rounded-full animate-spin"></div></div>;

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
        <p className="text-gray-600 mt-2">Explore our banking services. Check requirements before you visit.</p>
      </div>
      {categories.map(cat => (
        <div key={cat} className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{cat}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.filter(s => s.category === cat).map(service => (
              <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>~{service.estimated_time_minutes} min</span>
                  <span className="font-medium text-[#0C2D57]">{service.fee > 0 ? `₦${service.fee.toLocaleString()}` : 'Free'}</span>
                </div>
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">REQUIRED DOCUMENTS:</p>
                  {service.requirements?.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <span className={req.is_mandatory ? 'text-green-600' : 'text-gray-400'}>{req.is_mandatory ? '✓' : '○'}</span>
                      <span>{req.name}</span>
                    </div>
                  ))}
                </div>
                <Link to={`/services/${service.id}`}
                  className="block text-center bg-[#0C2D57] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0A2445] transition">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
