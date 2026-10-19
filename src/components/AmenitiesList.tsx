import React from 'react';
import {
  ShieldCheck,
  Zap,
  Dumbbell,
  Trees,
  Waves,
  Car,
  PhoneCall,
  Flame,
  CheckCircle2,
  Users,
  Sun,
  Gamepad2,
  Sparkles
} from 'lucide-react';

interface AmenitiesListProps {
  amenities: string[];
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  if (!amenities || amenities.length === 0) return null;

  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('security') || lower.includes('cctv')) return ShieldCheck;
    if (lower.includes('power') || lower.includes('backup')) return Zap;
    if (lower.includes('gym') || lower.includes('fitness')) return Dumbbell;
    if (lower.includes('garden') || lower.includes('park') || lower.includes('tree')) return Trees;
    if (lower.includes('pool') || lower.includes('water')) return Waves;
    if (lower.includes('parking') || lower.includes('car')) return Car;
    if (lower.includes('intercom') || lower.includes('phone')) return PhoneCall;
    if (lower.includes('gas') || lower.includes('gujarat')) return Flame;
    if (lower.includes('clubhouse') || lower.includes('community') || lower.includes('hall')) return Users;
    if (lower.includes('solar') || lower.includes('sun')) return Sun;
    if (lower.includes('games') || lower.includes('kids') || lower.includes('play')) return Gamepad2;
    return CheckCircle2;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-[#102A43]">
          Society Amenities & Features
        </h3>
        <span className="text-xs text-[#627D98] font-mono tabular-nums">
          {amenities.length} Features
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {amenities.map((amenity, idx) => {
          const Icon = getAmenityIcon(amenity);
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#F3F6F9]/80 border border-slate-100 text-sm text-[#243B53]"
            >
              <div className="w-8 h-8 rounded-full bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-medium text-xs sm:text-sm">{amenity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
