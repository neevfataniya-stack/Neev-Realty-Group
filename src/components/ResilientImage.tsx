import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export function ResilientImage({
  src,
  alt = 'Surat residential property',
  className = '',
  fallbackText,
  ...props
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`bg-gradient-to-br from-[#102A43]/90 to-[#243B53] flex flex-col items-center justify-center text-white p-4 text-center select-none ${className}`}
        aria-label={alt}
      >
        <Building2 className="w-8 h-8 text-[#2698E8] mb-2 opacity-80" />
        <span className="text-xs font-medium tracking-wide text-[#DFF1FF] opacity-90 line-clamp-1">
          {fallbackText || alt || 'NEEV REALTY GROUP'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <Building2 className="w-6 h-6 text-slate-400" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
}
