import React from 'react';
import { Property } from '../data/properties';
import { EnquiryForm } from './EnquiryForm';
import { X, Building } from 'lucide-react';

interface EnquiryModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EnquiryModal({ property, isOpen, onClose }: EnquiryModalProps) {
  if (!isOpen || !property) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-enquiry-title"
    >
      <div className="relative bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 my-8">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#102A43] text-white px-6 py-4 flex items-center justify-between border-b border-[#243B53]">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#2698E8]" />
            <div>
              <h3 id="modal-enquiry-title" className="text-sm font-bold text-white">
                Enquire with NEEV REALTY GROUP
              </h3>
              <p className="text-[11px] text-[#DFF1FF]/80">
                Direct Private Enquiry for {property.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-4 sm:p-6">
          <EnquiryForm
            propertyId={property.id}
            propertyTitle={property.title}
            onSuccess={() => {
              // Stay on success view in form
            }}
          />
        </div>
      </div>
    </div>
  );
}
