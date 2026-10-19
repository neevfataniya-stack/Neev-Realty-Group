import React from 'react';
import { useRouter } from '../context/RouterContext';
import { PROPERTIES } from '../data/properties';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PropertyGallery } from '../components/PropertyGallery';
import { PropertyHighlights } from '../components/PropertyHighlights';
import { AmenitiesList } from '../components/AmenitiesList';
import { EnquiryForm } from '../components/EnquiryForm';
import { RelatedProperties } from '../components/RelatedProperties';
import {
  MapPin,
  Calendar,
  IndianRupee,
  Building,
  CheckCircle,
  ArrowLeft,
  Share2,
  Bookmark,
  Info,
  Clock,
  Navigation,
  MessageSquare
} from 'lucide-react';

export function PropertyDetails() {
  const { route, navigate } = useRouter();
  const propertyId = route.params.id;

  const property = PROPERTIES.find((p) => p.id === propertyId);

  if (!property) {
    return (
      <div className="bg-[#F3F6F9] min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg shadow-sm">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Building className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#102A43] mb-2">
            Property Not Found
          </h2>
          <p className="text-xs text-[#627D98] mb-6 leading-relaxed">
            The property reference <strong className="font-mono text-[#243B53]">"{propertyId}"</strong> was not found in our residential dataset or may have been updated.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/properties')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] transition-colors"
            >
              Browse All Properties
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold text-[#102A43] bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBookVisit = () => {
    navigate(`/site-visit?propertyId=${encodeURIComponent(property.id)}`);
  };

  const handleCategoryBreadcrumb = () => {
    navigate(`/properties?category=${encodeURIComponent(property.category)}`);
  };

  return (
    <div className="bg-[#F3F6F9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <Breadcrumbs
            items={[
              { label: 'Properties', path: '/properties' },
              { label: property.category, path: `/properties?category=${encodeURIComponent(property.category)}` },
              { label: property.title },
            ]}
          />
          <button
            onClick={() => navigate('/properties')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#627D98] hover:text-[#102A43] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Listings</span>
          </button>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#102A43] text-white text-xs font-semibold px-2.5 py-1 rounded">
                  {property.purpose}
                </span>
                <span className="bg-[#DFF1FF] text-[#102A43] text-xs font-semibold px-2.5 py-1 rounded">
                  {property.category}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-0.5 rounded">
                  {property.availability}
                </span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium px-2 py-0.5 rounded">
                  Demo Listing
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
                {property.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#627D98]">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2698E8]" />
                  <span className="font-semibold text-[#243B53]">{property.locality}</span>
                  <span>, Surat, Gujarat</span>
                </div>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-500">Property ID: {property.id}</span>
                <span aria-hidden="true">·</span>
                <span>Possession: {property.possession}</span>
              </div>
            </div>

            {/* Price & Primary CTA Block */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 p-4 rounded-xl bg-[#F3F6F9] border border-slate-200/80">
              <div>
                <span className="text-xs text-[#627D98] block font-medium">
                  {property.purpose === 'For Rent' ? 'Monthly Rental' : 'Listed Price'}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#102A43] font-mono tabular-nums">
                  {property.priceDisplay}
                </div>
                {property.pricePerSqFt && (
                  <span className="text-xs text-[#627D98]">
                    ₹{property.pricePerSqFt.toLocaleString('en-IN')} per sq ft
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('enquire');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#102A43] hover:bg-[#243B53] shadow transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                >
                  <MessageSquare className="w-4 h-4 text-[#2698E8]" />
                  <span>Enquire Now</span>
                </button>
                <button
                  type="button"
                  onClick={handleBookVisit}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] shadow transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#2698E8]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Site Visit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        {/* Specifications & Highlights */}
        <PropertyHighlights property={property} />

        {/* Description & Detailed Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Details Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Detailed Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#102A43] mb-3 pb-3 border-b border-slate-100">
                Property Overview & Architectural Layout
              </h3>
              <p className="text-sm text-[#243B53] leading-relaxed mb-4">
                {property.description}
              </p>
              <div className="bg-[#F3F6F9] rounded-lg p-3.5 text-xs text-[#627D98] border border-slate-200/60 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#2698E8] shrink-0 mt-0.5" />
                <p>
                  This property is designed for residential use in a regulated Surat zoning district. All room dimensions and specifications reflect demo architectural plans.
                </p>
              </div>
            </div>

            {/* Amenities Grid */}
            <AmenitiesList amenities={property.amenities} />

            {/* Locality & Neighborhood Highlights */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#2698E8]" />
                  <span>Neighborhood & Location Overview</span>
                </h3>
                <span className="text-xs text-[#627D98] font-semibold">{property.locality}, Surat</span>
              </div>
              <p className="text-sm text-[#243B53] leading-relaxed mb-4">
                {property.locationSummary}
              </p>

              {property.nearbyLandmarks && property.nearbyLandmarks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2.5">
                    Proximity & Connectivity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.nearbyLandmarks.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F3F6F9] text-xs text-[#243B53] border border-slate-100"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#2698E8] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Transparent Pricing Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#102A43] mb-3 pb-3 border-b border-slate-100">
                Transparent Pricing Breakdown
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-[#627D98]">Base Quoted Amount:</span>
                  <span className="font-bold text-[#102A43] font-mono tabular-nums">{property.priceDisplay}</span>
                </div>
                {property.pricePerSqFt && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-[#627D98]">Rate per Sq Ft:</span>
                    <span className="font-semibold text-[#243B53] font-mono tabular-nums">
                      ₹{property.pricePerSqFt.toLocaleString('en-IN')} / sq ft
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-[#627D98]">Car Parking Allotment:</span>
                  <span className="font-semibold text-[#243B53]">{property.parking}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#627D98]">Municipal Water & Electric Supply:</span>
                  <span className="font-semibold text-[#243B53]">Standard Surat Municipal Connection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Enquiry Form */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <EnquiryForm
              propertyId={property.id}
              propertyTitle={property.title}
            />
          </div>
        </div>

        {/* Related Properties */}
        <RelatedProperties currentProperty={property} />

        {/* Final Navigation Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#102A43] hover:text-[#2698E8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Properties</span>
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('enquire');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#102A43] hover:bg-[#243B53] shadow transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#2698E8]" />
              <span>Enquire Now</span>
            </button>
            <button
              onClick={handleBookVisit}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] shadow transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Site Visit</span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#243B53] bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
