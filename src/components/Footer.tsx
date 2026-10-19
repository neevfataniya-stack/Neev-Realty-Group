import React from 'react';
import { useRouter } from '../context/RouterContext';
import { CATEGORIES } from '../data/categories';
import { NeevLogo } from './NeevLogo';
import { MapPin, Phone, Mail, Building, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const { navigate } = useRouter();

  const handleCategoryClick = (categoryTitle: string) => {
    navigate(`/properties?category=${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <footer className="bg-[#102A43] text-white border-t border-[#243B53] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <NeevLogo variant="light" showTagline={true} />
            <p className="text-sm text-[#DFF1FF]/80 leading-relaxed">
              Find Your Space. Build Your Future. Explore verified residential flats, luxury villas, independent bungalows, and approved plotted layouts across Surat, Gujarat with NEEV REALTY GROUP.
            </p>
            <div className="pt-2 text-xs text-[#DFF1FF]/60 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#2698E8] shrink-0" />
              <span>Covering Vesu, Adajan, Pal, Piplod, Althan & Dumas Road</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-[#DFF1FF]/80">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/properties')}
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Browse Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  About Our Platform
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/site-visit')}
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Book a Site Visit
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Residential Categories */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Property Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-[#DFF1FF]/80">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.filterKey)}
                    className="hover:text-white transition-colors text-left flex items-center gap-1 group focus:outline-none focus:underline"
                  >
                    <span>{cat.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#2698E8]" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Placeholders */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Connect With Us
            </h3>
            <p className="text-xs text-[#DFF1FF]/70 mb-3">
              Reach out for property enquiries, site inspections, and sample walkthroughs in Surat with NEEV REALTY GROUP.
            </p>
            <ul className="space-y-3 text-sm text-[#DFF1FF]/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2698E8] shrink-0 mt-0.5" />
                <span>Surat, Gujarat, India (395007)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2698E8] shrink-0" />
                <span>+91 98790 00000 (Sample Desk)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#2698E8] shrink-0" />
                <span>enquiries@neevrealtygroup.demo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Admin Link Bar */}
        <div className="mt-12 pt-8 border-t border-[#243B53]/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#DFF1FF]/60">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} NEEV REALTY GROUP. All rights reserved.</p>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-[#DFF1FF]/60 hover:text-white transition-colors underline focus:outline-none"
            >
              Admin Portal
            </button>
          </div>
          <p className="text-center md:text-right max-w-xl">
            Customer enquiries and booking requests are stored securely in our private administrative database.
          </p>
        </div>
      </div>
    </footer>
  );
}
