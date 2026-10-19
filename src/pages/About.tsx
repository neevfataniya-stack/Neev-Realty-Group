import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CATEGORIES } from '../data/categories';
import { ResilientImage } from '../components/ResilientImage';
import {
  Search,
  MessageSquare,
  CalendarCheck,
  CheckCircle,
  Building,
  ArrowRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export function About() {
  const { navigate } = useRouter();

  const workflowSteps = [
    {
      step: '01',
      title: 'Discover & Filter Properties',
      description: 'Filter residential listings in Surat by budget range, specific locality (Vesu, Adajan, Pal, Piplod), BHK configuration, and availability status.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Inspect Verified Specifications',
      description: 'Review high-resolution galleries, room layouts, carpet area breakdowns, and assigned society amenities without misleading claims.',
      icon: Building,
    },
    {
      step: '03',
      title: 'Submit Detailed Enquiries',
      description: 'Send property-specific queries with prefilled listing references and preferred communication modes (Phone, WhatsApp, or Email).',
      icon: MessageSquare,
    },
    {
      step: '04',
      title: 'Schedule a Guided Site Visit',
      description: 'Pick an upcoming convenient date and time window to request an in-person walkthrough of the property and its surrounding campus.',
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="bg-[#F3F6F9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Hero Section of About */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold text-[#2698E8] tracking-widest uppercase">
                About the Platform
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] tracking-tight leading-tight">
                Empowering Homebuyers in Surat with Transparency & Clarity
              </h1>
              <p className="text-sm sm:text-base text-[#627D98] leading-relaxed">
                NEEV REALTY GROUP was founded to make residential real estate discovery across Surat straightforward, structured, and pleasant. Guided by our philosophy, <em>“Find Your Space. Build Your Future.”</em>, whether you are looking for modern high-rise apartments on VIP Road, quiet family row houses in Rander, or scenic Tapi riverfront flats in Adajan, NEEV REALTY GROUP organizes property details with precision.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-[#243B53]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2698E8]" />
                  <span>Uncluttered Residential Focus</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2698E8]" />
                  <span>Surat-Centric Localities</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <ResilientImage
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                alt="Modern residential architecture in Surat"
                className="w-full h-full object-cover"
                fallbackText="Residential Architecture"
              />
            </div>
          </div>
        </div>

        {/* Purpose & Core Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#102A43] mb-2">
              Our Purpose
            </h3>
            <p className="text-xs text-[#627D98] leading-relaxed">
              At NEEV REALTY GROUP, our purpose is to provide an authentic, modern residential directory designed specifically for individuals and families exploring housing options in Surat, Gujarat.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center mb-4">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#102A43] mb-2">
              Comprehensive Coverage
            </h3>
            <p className="text-xs text-[#627D98] leading-relaxed">
              From compact 1 BHK starter flats to expansive 5 BHK private villas and residential plots, we represent diverse lifestyles and budgets.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center mb-4">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#102A43] mb-2">
              Transparent Information
            </h3>
            <p className="text-xs text-[#627D98] leading-relaxed">
              We present factual carpet areas, real floor levels, transparent parking specifications, and society amenities without exaggerated claims.
            </p>
          </div>
        </div>

        {/* How It Works Workflow */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#2698E8] tracking-widest uppercase">
              User Experience
            </span>
            <h2 className="text-2xl font-bold text-[#102A43] mt-1 mb-2">
              How You Can Explore & Connect
            </h2>
            <p className="text-xs text-[#627D98] leading-relaxed">
              A 4-step streamlined journey from initial discovery to scheduling an in-person site walkthrough.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#F3F6F9] border border-slate-200/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-black font-mono text-[#2698E8]">
                        {item.step}
                      </span>
                      <Icon className="w-5 h-5 text-[#102A43]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#102A43] mb-2">
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

        {/* Categories Showcase in About */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-[#102A43] mb-6">
            Residential Categories Available on the Platform
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/properties?category=${encodeURIComponent(cat.filterKey)}`)}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#2698E8] bg-[#F3F6F9]/50 hover:bg-white cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#102A43] group-hover:text-[#2698E8] transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-[#627D98] mt-0.5 font-mono tabular-nums">
                    {cat.count} Available Listings
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#2698E8] transform group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-[#102A43] rounded-2xl p-8 sm:p-12 text-center text-white shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Start Your Home Search Today
          </h2>
          <p className="text-sm text-[#DFF1FF]/80 max-w-lg mx-auto mb-6 leading-relaxed">
            Discover verified sample apartments, luxury villas, and plots across Surat with NEEV REALTY GROUP.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 rounded-lg text-xs font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] transition-colors shadow"
            >
              Browse Properties
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 rounded-lg text-xs font-semibold text-white bg-[#243B53] hover:bg-[#334E68] border border-white/20 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
