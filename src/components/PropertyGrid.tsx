import React from 'react';
import { Property } from '../data/properties';
import { PropertyCard } from './PropertyCard';
import { EmptyState } from './EmptyState';

interface PropertyGridProps {
  properties: Property[];
  onQuickEnquire?: (property: Property) => void;
  onResetFilters?: () => void;
  columns?: 2 | 3 | 4;
}

export function PropertyGrid({
  properties,
  onQuickEnquire,
  onResetFilters,
  columns = 3,
}: PropertyGridProps) {
  if (properties.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  const gridColsClass =
    columns === 2
      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
      : columns === 4
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <div className={gridColsClass}>
      {properties.map((prop) => (
        <PropertyCard
          key={prop.id}
          property={prop}
          onQuickEnquire={onQuickEnquire}
        />
      ))}
    </div>
  );
}
