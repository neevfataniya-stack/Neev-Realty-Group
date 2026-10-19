import React from 'react';
import { Property } from '../data/properties';
import {
  Building2,
  BedDouble,
  Maximize,
  Sofa,
  Car,
  Layers,
  Clock,
  Compass,
  Bath,
  Wind
} from 'lucide-react';

interface PropertyHighlightsProps {
  property: Property;
}

export function PropertyHighlights({ property }: PropertyHighlightsProps) {
  const highlights = [
    {
      label: 'Property Type',
      value: property.category,
      icon: Building2,
      show: Boolean(property.category),
    },
    {
      label: 'Configuration',
      value: property.bhk !== 'N/A' ? property.bhk : 'Residential Plot',
      icon: BedDouble,
      show: true,
    },
    {
      label: 'Total Area',
      value: `${property.area} sq ft (${property.areaType})`,
      icon: Maximize,
      show: Boolean(property.area),
    },
    {
      label: 'Bedrooms',
      value: property.bedrooms ? `${property.bedrooms} Bedrooms` : undefined,
      icon: BedDouble,
      show: Boolean(property.bedrooms),
    },
    {
      label: 'Bathrooms',
      value: property.bathrooms ? `${property.bathrooms} Bathrooms` : undefined,
      icon: Bath,
      show: Boolean(property.bathrooms),
    },
    {
      label: 'Balconies',
      value: property.balconies ? `${property.balconies} Balconies` : undefined,
      icon: Wind,
      show: Boolean(property.balconies),
    },
    {
      label: 'Furnishing',
      value: property.furnishing,
      icon: Sofa,
      show: Boolean(property.furnishing),
    },
    {
      label: 'Floor / Levels',
      value: property.floor || (property.totalFloors ? `${property.totalFloors} Floors` : undefined),
      icon: Layers,
      show: Boolean(property.floor || property.totalFloors),
    },
    {
      label: 'Parking',
      value: property.parking,
      icon: Car,
      show: Boolean(property.parking),
    },
    {
      label: 'Possession Status',
      value: `${property.availability} (${property.possession})`,
      icon: Clock,
      show: Boolean(property.possession),
    },
  ].filter((item) => item.show && item.value);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#102A43] mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
        <span>Property Specifications & Highlights</span>
        <span className="text-xs font-normal text-[#627D98]">Verified Sample Data</span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#F3F6F9] border border-slate-100 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-xs text-[#627D98] mb-1">
                <Icon className="w-4 h-4 text-[#2698E8] shrink-0" />
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="text-sm font-semibold text-[#102A43] line-clamp-2">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
