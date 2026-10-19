import React from 'react';
import { Property } from '../data/properties';
import { useRouter } from '../context/RouterContext';
import { useEnquiryModal } from '../context/EnquiryModalContext';
import { ResilientImage } from './ResilientImage';
import { MapPin, BedDouble, Square, CheckCircle, ArrowRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onQuickEnquire?: (property: Property) => void;
}

export function PropertyCard({ property, onQuickEnquire }: PropertyCardProps) {
  const { navigate } = useRouter();
  const { openEnquiryModal } = useEnquiryModal();

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  const handleEnquire = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickEnquire) {
      onQuickEnquire(property);
    } else {
      openEnquiryModal(property);
    }
  };

  return (
    <article
      onClick={handleViewDetails}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-[#2698E8]/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <ResilientImage
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fallbackText={property.title}
        />

        {/* Clean Top Overlay: Purpose & Category Unboxed Banner */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="bg-[#102A43]/90 text-white text-xs font-semibold px-2.5 py-1 rounded backdrop-blur-sm">
            {property.purpose}
          </span>
          <span className="bg-white/95 text-[#102A43] text-xs font-medium px-2.5 py-1 rounded shadow-sm backdrop-blur-sm">
            {property.category}
          </span>
        </div>

        {/* Price Scrim Banner at bottom of image */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 flex items-end justify-between text-white">
          <div>
            <div className="text-xl font-bold tracking-tight text-white drop-shadow-sm font-mono tabular-nums">
              {property.priceDisplay}
            </div>
            {property.pricePerSqFt && (
              <div className="text-[11px] text-[#DFF1FF] opacity-90">
                ₹{property.pricePerSqFt.toLocaleString('en-IN')} / sq ft
              </div>
            )}
          </div>
          <span className="text-xs text-[#DFF1FF] font-medium bg-[#102A43]/60 px-2 py-0.5 rounded">
            {property.availability}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & Surat */}
          <div className="flex items-center gap-1.5 text-xs text-[#627D98] mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#2698E8] shrink-0" />
            <span className="font-medium text-[#243B53]">{property.locality}</span>
            <span aria-hidden="true">·</span>
            <span>Surat</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[#102A43] group-hover:text-[#2698E8] transition-colors line-clamp-1 mb-2">
            {property.title}
          </h3>

          {/* Key specs metadata: unboxed with subtle separators */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#627D98] py-2 border-y border-slate-100 mb-3">
            {property.bhk !== 'N/A' && (
              <span className="inline-flex items-center gap-1 font-medium text-[#243B53]">
                <BedDouble className="w-3.5 h-3.5 text-[#2698E8]" />
                {property.bhk}
              </span>
            )}
            {property.bhk !== 'N/A' && <span aria-hidden="true">·</span>}
            <span className="inline-flex items-center gap-1">
              <Square className="w-3.5 h-3.5 text-slate-400" />
              {property.area} sq ft ({property.areaType.replace(' Area', '')})
            </span>
            <span aria-hidden="true">·</span>
            <span>{property.furnishing}</span>
          </div>

          {/* Highlights bullet preview */}
          <p className="text-xs text-[#627D98] line-clamp-2 leading-relaxed mb-4">
            {property.description}
          </p>
        </div>

        {/* Card Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={handleViewDetails}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg text-[#102A43] bg-slate-100 hover:bg-[#DFF1FF] hover:text-[#102A43] transition-colors flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#2698E8]"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleEnquire}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg text-white bg-[#2698E8] hover:bg-[#1d82c9] transition-colors flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#2698E8]"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Enquire Now</span>
          </button>
        </div>
      </div>
    </article>
  );
}
