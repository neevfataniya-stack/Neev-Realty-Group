import React, { useState } from 'react';
import { FilterCriteria } from '../utils/propertyFilters';
import { SURAT_LOCALITIES } from '../data/properties';
import { CATEGORIES } from '../data/categories';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building,
  BedDouble,
  IndianRupee,
  Square,
  Sparkles
} from 'lucide-react';

interface PropertyFiltersProps {
  filters: FilterCriteria;
  onFilterChange: (newFilters: FilterCriteria) => void;
  onReset: () => void;
  totalResults: number;
}

export function PropertyFilters({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categoryOptions = [
    'All Properties',
    'Flats & Apartments',
    'Independent Houses',
    'Villas',
    'Residential Plots',
    'New Projects',
    'Ready-to-Move Homes',
  ];

  const handleCategoryTab = (cat: string) => {
    onFilterChange({
      ...filters,
      category: cat === 'All Properties' ? 'All' : cat,
    });
  };

  const handleChange = (key: keyof FilterCriteria, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Category Tabs Strip */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {categoryOptions.map((cat) => {
            const isSelected =
              cat === 'All Properties'
                ? filters.category === 'All' || filters.category === 'All Properties'
                : filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryTab(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-[#2698E8] ${
                  isSelected
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'bg-[#F3F6F9] text-[#243B53] hover:bg-[#DFF1FF] hover:text-[#102A43]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Search & Quick Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Keyword Search Input */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
            placeholder="Search by title, landmark or locality..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8] text-xs text-[#243B53] outline-none transition-colors"
          />
        </div>

        {/* Locality Selector */}
        <div className="lg:col-span-3">
          <select
            value={filters.locality}
            onChange={(e) => handleChange('locality', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] text-xs text-[#243B53] bg-white outline-none"
          >
            {SURAT_LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose: Sale vs Rent */}
        <div className="lg:col-span-2">
          <select
            value={filters.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] text-xs text-[#243B53] bg-white outline-none"
          >
            <option value="All">All Purposes</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="lg:col-span-3">
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] text-xs text-[#243B53] bg-white outline-none"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Listings</option>
            <option value="area-desc">Largest Area</option>
          </select>
        </div>
      </div>

      {/* Advanced Filter Toggle & Results Summary Row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1.5 font-semibold text-[#2698E8] hover:text-[#102A43] transition-colors focus:outline-none"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Advanced Filters' : 'More Filters (BHK, Budget, Area, Furnishing)'}</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#627D98] font-medium font-mono tabular-nums">
            Showing <strong className="text-[#102A43]">{totalResults}</strong> properties
          </span>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[#627D98] hover:text-[#102A43] transition-colors p-1"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Expanded Advanced Filters Panel */}
      {showAdvanced && (
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-150">
          {/* BHK Configuration */}
          <div>
            <label className="block text-[11px] font-semibold text-[#102A43] uppercase tracking-wider mb-1.5">
              BHK Setup
            </label>
            <select
              value={filters.bhk}
              onChange={(e) => handleChange('bhk', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-[#243B53] bg-white outline-none focus:border-[#2698E8]"
            >
              <option value="All">All Configurations</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4+ BHK">4+ BHK</option>
              <option value="N/A">Plots / Land (N/A)</option>
            </select>
          </div>

          {/* Furnishing */}
          <div>
            <label className="block text-[11px] font-semibold text-[#102A43] uppercase tracking-wider mb-1.5">
              Furnishing
            </label>
            <select
              value={filters.furnishing}
              onChange={(e) => handleChange('furnishing', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-[#243B53] bg-white outline-none focus:border-[#2698E8]"
            >
              <option value="All">Any Furnishing</option>
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Fully Furnished">Fully Furnished</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[11px] font-semibold text-[#102A43] uppercase tracking-wider mb-1.5">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) => handleChange('availability', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-[#243B53] bg-white outline-none focus:border-[#2698E8]"
            >
              <option value="All">Any Status</option>
              <option value="Ready to Move">Ready to Move</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>

          {/* Max Budget Cap */}
          <div>
            <label className="block text-[11px] font-semibold text-[#102A43] uppercase tracking-wider mb-1.5">
              Max Budget
            </label>
            <select
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-[#243B53] bg-white outline-none focus:border-[#2698E8]"
            >
              <option value={50000000}>No Upper Limit</option>
              <option value={5000000}>Up to ₹50 Lakh</option>
              <option value={10000000}>Up to ₹1.00 Crore</option>
              <option value={15000000}>Up to ₹1.50 Crore</option>
              <option value={20000000}>Up to ₹2.00 Crore</option>
              <option value={30000000}>Up to ₹3.00 Crore</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
