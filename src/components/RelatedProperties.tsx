import React from 'react';
import { Property, PROPERTIES } from '../data/properties';
import { PropertyCard } from './PropertyCard';

interface RelatedPropertiesProps {
  currentProperty: Property;
  onQuickEnquire?: (property: Property) => void;
}

export function RelatedProperties({
  currentProperty,
  onQuickEnquire,
}: RelatedPropertiesProps) {
  // Exclude current property
  const otherProperties = PROPERTIES.filter((p) => p.id !== currentProperty.id);

  // Score candidate properties by category match (+3), BHK match (+2), locality match (+2), price closeness
  const scored = otherProperties.map((p) => {
    let score = 0;
    if (p.category === currentProperty.category) score += 4;
    if (p.bhk === currentProperty.bhk && currentProperty.bhk !== 'N/A') score += 2;
    if (p.locality === currentProperty.locality) score += 2;
    if (p.purpose === currentProperty.purpose) score += 1;

    // Price proximity
    const diffRatio = Math.abs(p.price - currentProperty.price) / (currentProperty.price || 1);
    if (diffRatio < 0.3) score += 2;

    return { property: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const related = scored.slice(0, 3).map((s) => s.property);

  if (related.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#102A43]">
            Similar Residential Properties in Surat
          </h3>
          <p className="text-xs text-[#627D98] mt-1">
            Handpicked options matching this category and locality profile
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onQuickEnquire={onQuickEnquire}
          />
        ))}
      </div>
    </section>
  );
}
