import React, { useState, useEffect } from 'react';
import { ResilientImage } from './ResilientImage';
import { Maximize2, ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const safeImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
      if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, safeImages.length]);

  return (
    <div className="space-y-3">
      {/* Main Large Image Container */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
        <ResilientImage
          src={safeImages[selectedIndex]}
          alt={`${title} - Photo ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
          fallbackText={`${title} Photo ${selectedIndex + 1}`}
        />

        {/* View All Photos / Zoom Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 right-4 bg-[#102A43]/90 hover:bg-[#102A43] text-white text-xs font-semibold px-3.5 py-2 rounded-lg backdrop-blur-sm shadow flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          <Maximize2 className="w-4 h-4 text-[#2698E8]" />
          <span>View All Photos ({safeImages.length})</span>
        </button>

        {/* Previous / Next Controls on Hover */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-mono tabular-nums px-2.5 py-1 rounded-md backdrop-blur-sm">
          {selectedIndex + 1} / {safeImages.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-[#2698E8] shadow-sm ring-2 ring-[#2698E8]/30'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              aria-label={`Select photo ${idx + 1}`}
            >
              <ResilientImage
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                fallbackText={`Photo ${idx + 1}`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Property Photo Gallery Lightbox"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full pb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-200 line-clamp-1">
                {title}
              </span>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                ({selectedIndex + 1} of {safeImages.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
              aria-label="Close photo gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Enlarged View with Navigation */}
          <div className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-auto overflow-hidden">
            <ResilientImage
              src={safeImages[selectedIndex]}
              alt={`${title} - Photo ${selectedIndex + 1}`}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              fallbackText={`${title} Photo ${selectedIndex + 1}`}
            />

            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all shadow-lg focus:outline-none"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all shadow-lg focus:outline-none"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          <div className="max-w-4xl mx-auto w-full pt-2 flex items-center justify-center gap-2 overflow-x-auto py-2">
            {safeImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-12 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                  selectedIndex === idx
                    ? 'border-[#2698E8] scale-105'
                    : 'border-transparent opacity-50 hover:opacity-90'
                }`}
              >
                <ResilientImage
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
