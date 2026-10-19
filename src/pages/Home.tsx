import React from 'react';
import { useRouter } from '../context/RouterContext';
import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { PropertyCard } from '../components/PropertyCard';
import { PROPERTIES } from '../data/properties';
import {
  Compass,
  FileCheck2,
  CalendarCheck,
  PhoneCall,
  ArrowRight,
  Shield,
  Building,
  CheckCircle2
} from 'lucide-react';

export function Home() {
  const { navigate } = useRouter();

  // Pick 6 featured sample properties
  const featuredProperties = PROPERTIES.filter((p) => p.featured).slice(0, 6);

  const valuePillars = [
    {
      icon: Compass,
      title: 'Easy Property Discovery',
      description: 'Filter through residential homes across Surat by locality, budget, configuration and move-in timelines effortlessly.',
    },
    {
      icon: FileCheck2,
      title: 'Clear Property Information',
      description: 'Accurate layouts, true square footage, furnishing status, society amenities, and transparent pricing references.',
    },
    {
      icon: PhoneCall,
      title: 'Convenient Enquiry Options',
      description: 'Direct demo request forms prefilled with listing titles and IDs so you never lose context while researching.',
    },
    {
      icon: CalendarCheck,
      title: 'Simple Site Visit Requests',
      description: 'Select preferred dates and convenient morning or afternoon slots for an accompanied property walkthrough.',
    },
  ];

  return (
    <div>
      {/* Hero Section with Search Panel */}
      <HeroSection />

      {/* Property Categories (6 Image-Based Cards) */}
      <CategorySection />

      {/* Featured Properties Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold text-[#2698E8] tracking-widest uppercase">
                Featured Residences
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight mt-1">
                Handpicked Properties in Surat
              </h2>
              <p className="text-sm text-[#627D98] mt-1 max-w-xl">
                Explore popular residential apartments, villas, and independent homes situated in prime residential zones.
              </p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2698E8] hover:text-[#102A43] transition-colors focus:outline-none"
            >
              <span>View All Properties ({PROPERTIES.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#102A43] hover:bg-[#243B53] rounded-lg shadow transition-colors"
            >
              <span>Explore All Residential Listings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-[#F3F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#2698E8] tracking-widest uppercase">
              The NEEV Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight mt-1 mb-3">
              Why Choose NEEV REALTY GROUP?
            </h2>
            <p className="text-sm text-[#627D98] leading-relaxed">
              NEEV REALTY GROUP brings structured information, neighborhood clarity, and verified layout specifications to help you find your space and build your future.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuePillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-lg bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#102A43] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#627D98] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Surat Localities Strip */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#102A43] uppercase tracking-wider block mb-1">
                Prime Neighborhoods Covered
              </span>
              <p className="text-xs text-[#627D98]">
                Find residential offerings across top growth hubs in Surat:
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                'Vesu',
                'Adajan',
                'Pal',
                'Piplod',
                'Althan',
                'City Light',
                'Dumas Road',
                'Jahangirpura',
                'Rander',
              ].map((loc) => (
                <button
                  key={loc}
                  onClick={() => navigate(`/properties?locality=${encodeURIComponent(loc)}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#F3F6F9] hover:bg-[#DFF1FF] text-xs font-semibold text-[#243B53] hover:text-[#102A43] transition-colors border border-slate-200"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-[#102A43] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to Find Your New Home?
          </h2>
          <p className="text-base text-[#DFF1FF]/90 max-w-xl mx-auto mb-8 leading-relaxed">
            Explore property options and discover a home that suits your needs. Browse detailed listings or connect with our support desk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/properties')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] shadow transition-colors"
            >
              Browse Properties
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold text-white bg-[#243B53] hover:bg-[#334E68] border border-white/20 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
