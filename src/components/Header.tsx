import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { NeevLogo } from './NeevLogo';
import { Menu, X, Home, Building2, Info, PhoneCall, CalendarCheck } from 'lucide-react';

export function Header() {
  const { route, navigate, isActive } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Properties', path: '/properties', icon: Building2 },
    { label: 'About Us', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: PhoneCall },
    { label: 'Book Site Visit', path: '/site-visit', icon: CalendarCheck },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#102A43] text-white border-b border-[#243B53] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNav('/')}
              className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2698E8] rounded-md p-1"
            >
              <NeevLogo variant="light" showTagline={true} />
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`text-sm font-medium transition-colors whitespace-nowrap relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2698E8] rounded ${
                    active
                      ? 'text-[#2698E8] font-semibold'
                      : 'text-[#DFF1FF]/90 hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2698E8] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Mobile Toggle */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => handleNav('/properties')}
              className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-[#2698E8] hover:bg-[#1d82c9] transition-all duration-150 shadow-sm whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2698E8]"
            >
              Explore Properties
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-[#243B53] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2698E8]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#102A43] border-t border-[#243B53] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? 'bg-[#2698E8]/20 text-[#2698E8] font-semibold'
                    : 'text-[#DFF1FF] hover:bg-[#243B53] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 opacity-80" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNav('/properties')}
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-[#2698E8] hover:bg-[#1d82c9] shadow transition-colors"
            >
              Explore Properties
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
