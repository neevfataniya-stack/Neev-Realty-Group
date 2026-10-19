import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  actionText?: string;
}

export function EmptyState({
  title = 'No Properties Found',
  description = 'We could not find any residential properties matching your selected criteria. Try adjusting your budget, locality, or category filters.',
  onReset,
  actionText = 'Reset All Filters',
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm my-8">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[#102A43] mb-2">{title}</h3>
      <p className="text-sm text-[#627D98] mb-6 leading-relaxed">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#2698E8] hover:bg-[#1d82c9] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2698E8]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
