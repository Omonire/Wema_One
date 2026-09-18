import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import Reveal from '../../components/ScrollReveal';
import { LoadingPage, PageHeader } from '../../components/ui/Elements';
import SvgIcon from '../../components/ui/SvgIcon';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services/').then(res => setServices(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        eyebrow="Everyday services"
        title="Our Services"
        subtitle="Explore our banking services. Check requirements before you visit."
      />
      {categories.map(cat => (
        <div key={cat} className="mb-10">
          <Reveal direction="left">
            <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>{cat}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.filter(s => s.category === cat).map((service, i) => (
              <Reveal key={service.id} delay={(i % 3) * 90} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col">
                {/* Service Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center shrink-0">
                    <SvgIcon name={service.icon || 'services'} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-on-surface mb-1">{service.name}</h3>
                    {service.tagline && (
                      <p className="text-xs text-primary font-medium italic">{service.tagline}</p>
                    )}
                  </div>
                </div>
                
                <p className="text-on-surface-variant text-sm mb-3">{service.description}</p>
                
                {/* Features/Benefits */}
                {service.features && service.features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-on-surface-variant mb-2 tracking-wider">BENEFITS:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {service.features.map((feature, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 text-xs bg-tertiary-container/30 text-tertiary px-2 py-1 rounded-full">
                          <SvgIcon name="check_circle" size={12} className="shrink-0" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Time and Price */}
                <div className="flex items-center justify-between text-sm text-on-surface-variant mb-4">
                  <span className="flex items-center gap-1">
                    <SvgIcon name="schedule" size={16} className="text-primary shrink-0" />
                    ~{service.estimated_time_minutes} min
                  </span>
                  <span className="font-data-mono font-semibold text-primary">
                    {service.fee > 0 ? `₦${service.fee.toLocaleString()}` : 'Free'}
                  </span>
                </div>
                
                {/* Requirements */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-on-surface-variant mb-2 tracking-wider">REQUIRED DOCUMENTS:</p>
                  {service.requirements?.slice(0, 3).map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-on-surface-variant mb-1">
                      <span className={req.is_mandatory ? 'text-tertiary font-bold' : 'text-outline-variant'}>
                        {req.is_mandatory ? '✓' : '○'}
                      </span>
                      <span>{req.name}</span>
                    </div>
                  ))}
                  {service.requirements?.length > 3 && (
                    <p className="text-xs text-on-surface-variant mt-1">+{service.requirements.length - 3} more</p>
                  )}
                </div>
                
                <Link to={`/services/${service.id}`}
                  className="mt-auto block text-center bg-primary-container hover:bg-primary text-white py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_2px_8px_rgba(0,82,255,0.25)]">
                  Get Started
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
