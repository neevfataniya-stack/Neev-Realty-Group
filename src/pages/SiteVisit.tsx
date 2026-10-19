import React from 'react';
import { useRouter } from '../context/RouterContext';
import { PROPERTIES } from '../data/properties';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SiteVisitForm } from '../components/SiteVisitForm';
import { CalendarCheck, ShieldCheck, MapPin } from 'lucide-react';

export function SiteVisit() {
  const { route } = useRouter();
  const propertyIdParam = route.query.propertyId;

  const initialProperty = propertyIdParam
    ? PROPERTIES.find((p) => p.id === propertyIdParam) || PROPERTIES[0]
    : PROPERTIES[0];

  return (
    <div className="bg-[#F3F6F9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: 'Book a Site Visit' },
            ...(initialProperty ? [{ label: initialProperty.title }] : []),
          ]}
        />

        {/* Page Heading */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#2698E8] tracking-widest uppercase">
                Property Walkthrough
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight mt-1">
                Book an Accompanied Site Visit
              </h1>
              <p className="text-sm text-[#627D98] mt-1 max-w-2xl leading-relaxed">
                Experience residential properties in Surat firsthand. Schedule an accompanied physical site visit with NEEV REALTY GROUP, featuring dedicated parking, layout walk-through, and society amenity tour.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#243B53] font-medium bg-[#DFF1FF] px-3.5 py-2 rounded-lg shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#2698E8]" />
              <span>Complimentary Demo Scheduling</span>
            </div>
          </div>
        </div>

        {/* Main Site Visit Form & Property Selector */}
        <SiteVisitForm initialProperty={initialProperty} />
      </div>
    </div>
  );
}
