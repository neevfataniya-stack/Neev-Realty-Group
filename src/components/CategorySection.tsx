import React from 'react';
import { CATEGORIES } from '../data/categories';
import { CategoryCard } from './CategoryCard';

export function CategorySection() {
  return (
    <section className="py-16 bg-[#F3F6F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#2698E8] tracking-widest uppercase">
            Curated Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight mt-2 mb-3">
            Explore Residential Categories in Surat
          </h2>
          <p className="text-sm text-[#627D98] leading-relaxed">
            Choose from modern high-rise apartments, private bungalows, lifestyle villas, and gated residential plots designed for contemporary living.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
