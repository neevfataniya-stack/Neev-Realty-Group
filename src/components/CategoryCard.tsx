import React from 'react';
import { PropertyCategory } from '../data/categories';
import { useRouter } from '../context/RouterContext';
import { ResilientImage } from './ResilientImage';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: PropertyCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { navigate } = useRouter();

  const handleExplore = () => {
    navigate(`/properties?category=${encodeURIComponent(category.filterKey)}`);
  };

  return (
    <div
      onClick={handleExplore}
      className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <ResilientImage
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fallbackText={category.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-[#102A43]/30 to-transparent flex items-end p-5">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#DFF1FF] transition-colors drop-shadow-sm">
              {category.title}
            </h3>
            <span className="text-xs text-[#DFF1FF]/90 font-medium font-mono tabular-nums">
              {category.count} Listings in Surat
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <p className="text-xs text-[#627D98] leading-relaxed mb-4">
          {category.shortDescription}
        </p>
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2698E8] group-hover:text-[#102A43] transition-colors">
          <span>Explore Properties</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
