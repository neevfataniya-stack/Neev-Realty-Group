import React, { useState } from 'react';
import { Property, PROPERTIES } from '../data/properties';
import { ResilientImage } from './ResilientImage';
import {
  validatePhone,
  validateEmail,
  isPastDate,
  getTomorrowDateString
} from '../utils/formValidation';
import { submitCustomerEnquiry } from '../services/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  MapPin,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';

interface SiteVisitFormProps {
  initialProperty?: Property;
}

export function SiteVisitForm({ initialProperty }: SiteVisitFormProps) {
  const { navigate } = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(
    initialProperty || PROPERTIES[0]
  );

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    visitDate: getTomorrowDateString(),
    visitTime: '11:00 AM - 01:00 PM',
    message: 'I would like an in-person guided tour of this property and society amenities.',
    consentGranted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<{
    id: string;
    createdAt?: string;
  } | null>(null);

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
  ];

  const handlePropertyChange = (propertyId: string) => {
    const prop = PROPERTIES.find((p) => p.id === propertyId);
    if (prop) {
      setSelectedProperty(prop);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !selectedProperty) return;

    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name is required (minimum 2 characters).';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile phone number is required.';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.visitDate) {
      newErrors.visitDate = 'Please select a visit date.';
    } else if (isPastDate(formData.visitDate)) {
      newErrors.visitDate = 'Visit date cannot be in the past.';
    }

    if (!formData.visitTime) {
      newErrors.visitTime = 'Please pick a preferred time slot.';
    }

    if (!formData.consentGranted) {
      newErrors.consentGranted = 'Please provide consent for NEEV REALTY GROUP to contact you.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitCustomerEnquiry({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        propertyId: selectedProperty.id,
        propertyTitle: selectedProperty.title,
        preferredVisitDate: formData.visitDate,
        preferredTime: formData.visitTime,
        message: formData.message.trim() || undefined,
        consentGranted: true,
        type: 'site_visit',
      });

      setSubmittedBooking({
        id: response.enquiryId || 'NRG-VISIT-LOGGED',
        createdAt: response.createdAt,
      });
    } catch (err: any) {
      console.error('Site visit booking error:', err);
      setSubmitError(err.message || 'Unable to register site visit at this moment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedBooking && selectedProperty) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-2xl mx-auto text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-[#102A43] text-white flex items-center justify-center mx-auto mb-4 shadow">
          <CheckCircle2 className="w-8 h-8 text-[#2698E8]" />
        </div>

        <span className="inline-block text-xs font-semibold px-3 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
          Site Visit Saved & Confirmed
        </span>

        <h3 className="text-2xl font-bold text-[#102A43] mb-1">
          Site Visit Request Registered
        </h3>

        <p className="text-xs font-mono text-[#2698E8] font-bold mb-4">
          Booking Pass Code: {submittedBooking.id}
        </p>

        {/* Selected Property Summary Card */}
        <div className="bg-[#F3F6F9] rounded-xl p-4 border border-slate-200/80 mb-6 text-left flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
            <ResilientImage
              src={selectedProperty.images[0]}
              alt={selectedProperty.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-[#2698E8] uppercase tracking-wider block">
              {selectedProperty.category}
            </span>
            <h4 className="text-sm font-bold text-[#102A43] truncate">
              {selectedProperty.title}
            </h4>
            <div className="text-xs text-[#627D98] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#2698E8]" />
              <span>{selectedProperty.locality}, Surat</span>
            </div>
            <div className="text-xs font-bold text-[#102A43] font-mono mt-1">
              {selectedProperty.priceDisplay}
            </div>
          </div>
        </div>

        {/* Scheduled Slot Details */}
        <div className="grid grid-cols-2 gap-3 text-left text-xs bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
          <div>
            <span className="text-[#627D98] block">Scheduled Date:</span>
            <span className="font-bold text-[#243B53]">{formData.visitDate}</span>
          </div>
          <div>
            <span className="text-[#627D98] block">Time Window:</span>
            <span className="font-bold text-[#243B53]">{formData.visitTime}</span>
          </div>
          <div>
            <span className="text-[#627D98] block">Visitor Name:</span>
            <span className="font-bold text-[#243B53]">{formData.fullName}</span>
          </div>
          <div>
            <span className="text-[#627D98] block">Contact Number:</span>
            <span className="font-bold text-[#243B53]">+91 {formData.phone}</span>
          </div>
        </div>

        <div className="p-3 bg-[#DFF1FF]/50 border border-[#2698E8]/30 rounded-lg text-xs text-left mb-6 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2698E8] shrink-0 mt-0.5" />
          <p className="text-[#243B53] leading-relaxed">
            Your request has been saved in our persistent database and our property coordinator will reach out to you before your scheduled visit.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmittedBooking(null);
              setFormData({
                fullName: '',
                phone: '',
                email: '',
                visitDate: getTomorrowDateString(),
                visitTime: '11:00 AM - 01:00 PM',
                message: '',
                consentGranted: false,
              });
            }}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#102A43] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Schedule Another Visit
          </button>
          <button
            type="button"
            onClick={() => navigate(`/property/${selectedProperty.id}`)}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Back to Property Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Property Preview Card */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm sticky top-28">
        <div className="p-4 bg-[#102A43] text-white">
          <span className="text-xs font-semibold text-[#2698E8] tracking-wider uppercase block mb-1">
            Step 1: Property Selected
          </span>
          <h3 className="text-base font-bold text-white">
            Site Visit Property Overview
          </h3>
        </div>

        {selectedProperty ? (
          <div>
            <div className="relative aspect-[16/10] bg-slate-100">
              <ResilientImage
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#102A43]/90 text-white text-xs font-medium px-2 py-0.5 rounded backdrop-blur-sm">
                {selectedProperty.category}
              </div>
              <div className="absolute bottom-3 right-3 bg-white/95 text-[#102A43] text-xs font-bold font-mono px-2 py-1 rounded shadow">
                {selectedProperty.priceDisplay}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-base font-bold text-[#102A43] leading-snug">
                  {selectedProperty.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-[#627D98] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2698E8]" />
                  <span>{selectedProperty.locality}, Surat</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[#243B53] font-medium">
                    ID: {selectedProperty.id}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100">
                <div>
                  <span className="text-[#627D98] block">Configuration:</span>
                  <span className="font-semibold text-[#243B53]">
                    {selectedProperty.bhk !== 'N/A' ? selectedProperty.bhk : 'Plot'}
                  </span>
                </div>
                <div>
                  <span className="text-[#627D98] block">Area:</span>
                  <span className="font-semibold text-[#243B53]">
                    {selectedProperty.area} sq ft
                  </span>
                </div>
                <div>
                  <span className="text-[#627D98] block">Furnishing:</span>
                  <span className="font-semibold text-[#243B53]">
                    {selectedProperty.furnishing}
                  </span>
                </div>
                <div>
                  <span className="text-[#627D98] block">Possession:</span>
                  <span className="font-semibold text-[#243B53]">
                    {selectedProperty.availability}
                  </span>
                </div>
              </div>

              {/* Property Selector Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1.5">
                  Change Property for Visit:
                </label>
                <select
                  disabled={isSubmitting}
                  value={selectedProperty.id}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-[#243B53] bg-white outline-none focus:border-[#2698E8] disabled:opacity-60"
                >
                  {PROPERTIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.locality} - {p.title} ({p.priceDisplay})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#627D98]">
            Please select a property from the list.
          </div>
        )}
      </div>

      {/* Right Column: Site Visit Request Form */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <span className="text-xs font-semibold text-[#2698E8] tracking-wider uppercase block mb-1">
            Step 2: Choose Your Slot
          </span>
          <h2 className="text-2xl font-bold text-[#102A43]">
            Schedule an Accompanied Site Visit
          </h2>
          <p className="text-xs text-[#627D98] mt-1 leading-relaxed">
            Fill in your preferred date and time to arrange an in-person walkthrough with a NEEV REALTY GROUP property advisor.
          </p>
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              disabled={isSubmitting}
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. Amish Patel"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#243B53] outline-none transition-colors ${
                errors.fullName
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8]'
              } disabled:opacity-60`}
            />
            {errors.fullName && (
              <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 select-none">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  disabled={isSubmitting}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="98790 00000"
                  maxLength={13}
                  className={`w-full pl-11 pr-3.5 py-2.5 rounded-lg border text-sm text-[#243B53] outline-none transition-colors ${
                    errors.phone
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8]'
                  } disabled:opacity-60`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                name="email"
                disabled={isSubmitting}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#243B53] outline-none transition-colors ${
                  errors.email
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8]'
                } disabled:opacity-60`}
              />
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1 flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-[#2698E8]" />
                <span>Preferred Date <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                name="visitDate"
                disabled={isSubmitting}
                min={getTomorrowDateString()}
                value={formData.visitDate}
                onChange={handleInputChange}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#243B53] outline-none transition-colors ${
                  errors.visitDate
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8]'
                } disabled:opacity-60`}
              />
              {errors.visitDate && (
                <p className="text-xs text-rose-500 mt-1">{errors.visitDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#2698E8]" />
                <span>Time Slot <span className="text-rose-500">*</span></span>
              </label>
              <select
                name="visitTime"
                disabled={isSubmitting}
                value={formData.visitTime}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-[#243B53] bg-white outline-none focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8] disabled:opacity-60"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.visitTime && (
                <p className="text-xs text-rose-500 mt-1">{errors.visitTime}</p>
              )}
            </div>
          </div>

          {/* Specific Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">
              Specific Requirements or Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              name="message"
              rows={3}
              disabled={isSubmitting}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="e.g. Request to view rooftop clubhouse or discuss covered parking options."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8] text-sm text-[#243B53] outline-none transition-colors resize-none disabled:opacity-60"
            />
          </div>

          {/* Consent Checkbox (REQUIRED) */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="consentGranted"
                disabled={isSubmitting}
                checked={formData.consentGranted}
                onChange={handleInputChange}
                className="mt-0.5 w-4 h-4 rounded text-[#2698E8] border-slate-300 focus:ring-[#2698E8]"
              />
              <span className="text-xs text-[#243B53] leading-relaxed">
                I consent to <strong>NEEV REALTY GROUP</strong> contacting me to coordinate and schedule this in-person site visit. <span className="text-rose-500">*</span>
              </span>
            </label>
            {errors.consentGranted && (
              <p className="text-xs text-rose-500 mt-1">{errors.consentGranted}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-lg text-sm font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] shadow transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2698E8] disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Booking Request...</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Confirm Site Visit Request</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
