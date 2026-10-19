import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { SURAT_LOCALITIES } from '../data/properties';
import { CATEGORIES } from '../data/categories';
import { Search, MapPin, Building, BedDouble, IndianRupee } from 'lucide-react';
import { ResilientImage } from './ResilientImage';

export function HeroSection() {
  const { navigate } = useRouter();

  const [location, setLocation] = useState('All Localities');
  const [category, setCategory] = useState('All');
  const [bhk, setBhk] = useState('All');
  const [budgetRange, setBudgetRange] = useState('any');

  const budgetOptions = [
    { label: 'Any Budget', value: 'any', min: 0, max: 50000000 },
    { label: 'Under ₹50 Lakh', value: 'under-50l', min: 0, max: 5000000 },
    { label: '₹50 Lakh - ₹1 Crore', value: '50l-1cr', min: 5000000, max: 10000000 },
    { label: '₹1 Crore - ₹2 Crore', value: '1cr-2cr', min: 10000000, max: 20000000 },
    { label: 'Above ₹2 Crore', value: 'above-2cr', min: 20000000, max: 50000000 },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (location && location !== 'All Localities') {
      params.append('locality', location);
    }
    if (category && category !== 'All') {
      params.append('category', category);
    }
    if (bhk && bhk !== 'All') {
      params.append('bhk', bhk);
    }

    const selectedBudget = budgetOptions.find((b) => b.value === budgetRange);
    if (selectedBudget && selectedBudget.value !== 'any') {
      if (selectedBudget.min > 0) params.append('minPrice', selectedBudget.min.toString());
      if (selectedBudget.max > 0) params.append('maxPrice', selectedBudget.max.toString());
    }

    const queryString = params.toString();
    navigate(`/properties${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section className="relative bg-[#102A43] text-white overflow-hidden py-16 lg:py-24">
      {/* Background Hero Image with Dark Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <ResilientImage
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80"
          alt="Modern residential high-rise towers in Surat"
          className="w-full h-full object-cover opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102A43] via-[#102A43]/90 to-[#102A43]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#2698E8]/20 text-[#DFF1FF] text-xs font-semibold mb-4 border border-[#2698E8]/30">
            <span>NEEV REALTY GROUP · SURAT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight text-balance">
            Find Your Space. Build Your Future.
          </h1>

          <p className="text-base sm:text-lg text-[#DFF1FF]/90 font-normal leading-relaxed max-w-2xl">
            Explore premium residential properties that match your lifestyle, preferences and budget across Vesu, Adajan, Pal, Piplod, Althan, and surrounding neighborhoods with NEEV REALTY GROUP.
          </p>
        </div>

        {/* Property Search Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 text-[#243B53] border border-slate-200">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-[#102A43] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2698E8]" />
                  <span>Location</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-[#243B53] bg-white hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8] outline-none transition-colors"
                >
                  {SURAT_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Category */}
              <div>
                <label className="block text-xs font-semibold text-[#102A43] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#2698E8]" />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-[#243B53] bg-white hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8] outline-none transition-colors"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.filterKey}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* BHK Configuration */}
              <div>
                <label className="block text-xs font-semibold text-[#102A43] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-[#2698E8]" />
                  <span>BHK Setup</span>
                </label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-[#243B53] bg-white hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8] outline-none transition-colors"
                >
                  <option value="All">All Configurations</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4+ BHK">4+ BHK</option>
                  <option value="N/A">Plots / Land (N/A)</option>
                </select>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-semibold text-[#102A43] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-[#2698E8]" />
                  <span>Budget</span>
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-[#243B53] bg-white hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8] outline-none transition-colors"
                >
                  {budgetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs text-[#627D98]">
                Discover verified sample listings across 10+ Surat residential zones
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] transition-colors shadow flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2698E8]"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
