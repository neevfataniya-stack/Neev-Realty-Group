import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from '../context/RouterContext';
import { PROPERTIES, Property } from '../data/properties';
import {
  FilterCriteria,
  DEFAULT_FILTERS,
  filterAndSortProperties
} from '../utils/propertyFilters';
import { PropertyFilters } from '../components/PropertyFilters';
import { PropertyGrid } from '../components/PropertyGrid';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Building, Sparkles } from 'lucide-react';

export function Properties() {
  const { route } = useRouter();

  // Initialize filters from URL query parameters if present
  const [filters, setFilters] = useState<FilterCriteria>(() => {
    const q = route.query;
    return {
      ...DEFAULT_FILTERS,
      keyword: q.keyword || '',
      category: q.category || 'All',
      locality: q.locality || 'All Localities',
      bhk: q.bhk || 'All',
      purpose: q.purpose || 'All',
      furnishing: q.furnishing || 'All',
      availability: q.availability || 'All',
      minPrice: q.minPrice ? Number(q.minPrice) : 0,
      maxPrice: q.maxPrice ? Number(q.maxPrice) : 50000000,
      minArea: q.minArea ? Number(q.minArea) : 0,
      maxArea: q.maxArea ? Number(q.maxArea) : 10000,
      sortBy: (q.sortBy as any) || 'recommended',
    };
  });

  // Sync state if URL query changes (e.g. clicking category link from Header/Footer)
  useEffect(() => {
    const q = route.query;
    setFilters((prev) => ({
      ...prev,
      keyword: q.keyword !== undefined ? q.keyword : prev.keyword,
      category: q.category !== undefined ? q.category : prev.category,
      locality: q.locality !== undefined ? q.locality : prev.locality,
      bhk: q.bhk !== undefined ? q.bhk : prev.bhk,
      purpose: q.purpose !== undefined ? q.purpose : prev.purpose,
      minPrice: q.minPrice ? Number(q.minPrice) : prev.minPrice,
      maxPrice: q.maxPrice ? Number(q.maxPrice) : prev.maxPrice,
    }));
  }, [route.query]);

  // Compute filtered & sorted properties
  const filteredProperties = useMemo(() => {
    return filterAndSortProperties(PROPERTIES, filters);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="bg-[#F3F6F9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            {
              label: 'Properties',
              path: '/properties',
            },
            ...(filters.category && filters.category !== 'All'
              ? [{ label: filters.category }]
              : []),
          ]}
        />

        {/* Page Heading */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#2698E8] tracking-widest uppercase">
                NEEV REALTY GROUP · RESIDENTIAL DIRECTORY
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight mt-1">
                Explore Properties in Surat
              </h1>
              <p className="text-sm text-[#627D98] mt-1 max-w-2xl leading-relaxed">
                Discover residential properties for different lifestyles and budgets across Vesu, Adajan, Pal, Piplod, and premium Surat localities with NEEV REALTY GROUP.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DFF1FF] text-[#102A43] text-xs font-semibold">
                <Building className="w-4 h-4 text-[#2698E8]" />
                <span>{PROPERTIES.length} Curated Listings</span>
              </span>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <PropertyFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          totalResults={filteredProperties.length}
        />

        {/* Listing Results Grid */}
        <div className="pt-2">
          <PropertyGrid
            properties={filteredProperties}
            onResetFilters={handleResetFilters}
            columns={3}
          />
        </div>
      </div>
    </div>
  );
}
