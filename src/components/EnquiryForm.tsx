import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { validatePhone, validateEmail, getTomorrowDateString } from '../utils/formValidation';
import { submitCustomerEnquiry } from '../services/api';
import {
  Send,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface EnquiryFormProps {
  propertyId: string;
  propertyTitle: string;
  onSuccess?: () => void;
}

export function EnquiryForm({ propertyId, propertyTitle, onSuccess }: EnquiryFormProps) {
  const { navigate } = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    preferredVisitDate: '',
    message: `Hello, I would like more information on ${propertyTitle} (Ref: ${propertyId}). Please share current pricing, floor plan, and society details.`,
    consentGranted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<{
    id: string;
    createdAt?: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    if (isSubmitting) return;

    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name is required (at least 2 characters).';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.consentGranted) {
      newErrors.consentGranted = 'Please check the consent box to allow NEEV REALTY GROUP to contact you.';
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
        propertyId,
        propertyTitle,
        preferredVisitDate: formData.preferredVisitDate || undefined,
        message: formData.message.trim() || undefined,
        consentGranted: true,
        type: 'enquiry',
      });

      setSubmittedEnquiry({
        id: response.enquiryId || 'NRG-CONFIRMED',
        createdAt: response.createdAt,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError(err.message || 'Unable to submit enquiry at this time. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookSiteVisit = () => {
    navigate(`/site-visit?propertyId=${encodeURIComponent(propertyId)}`);
  };

  // Success State
  if (submittedEnquiry) {
    return (
      <div className="bg-[#DFF1FF]/60 border border-[#2698E8]/40 rounded-2xl p-6 sm:p-8 text-center animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-full bg-[#102A43] text-white flex items-center justify-center mx-auto mb-4 shadow">
          <CheckCircle2 className="w-8 h-8 text-[#2698E8]" />
        </div>

        <span className="inline-block text-xs font-semibold px-3 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
          Enquiry Saved in Database
        </span>

        <h4 className="text-xl font-bold text-[#102A43] mb-1">
          Enquiry Successfully Submitted
        </h4>

        <p className="text-xs font-mono text-[#2698E8] font-bold mb-3">
          Reference Code: {submittedEnquiry.id}
        </p>

        <p className="text-xs text-[#243B53] mb-4 max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{formData.fullName}</strong>. Your enquiry for <strong>{propertyTitle}</strong> has been logged in our secure backend. An advisor from NEEV REALTY GROUP will review your requirements and reach out to you at <strong>+91 {formData.phone}</strong>.
        </p>

        <div className="p-3 bg-white/90 rounded-lg text-xs text-[#627D98] border border-slate-200/80 mb-6 text-left flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2698E8] shrink-0 mt-0.5" />
          <span>
            Your details are stored securely in our private administrative system. We never share customer contact information publicly.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmittedEnquiry(null);
              setFormData({
                fullName: '',
                phone: '',
                email: '',
                preferredVisitDate: '',
                message: '',
                consentGranted: false,
              });
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-[#102A43] bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Submit Another Enquiry
          </button>
          <button
            type="button"
            onClick={handleBookSiteVisit}
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book a Site Visit</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="enquire" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-[#102A43]">
            Enquire About This Property
          </h3>
          <p className="text-xs text-[#627D98] mt-0.5">
            NEEV REALTY GROUP Verified Listing #{propertyId}
          </p>
        </div>
        <button
          type="button"
          onClick={handleBookSiteVisit}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2698E8] bg-[#DFF1FF] hover:bg-[#2698E8] hover:text-white rounded-lg transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Site Visit</span>
        </button>
      </div>

      {submitError && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selected Property Readonly Tags */}
        <div className="p-3 rounded-lg bg-[#F3F6F9] border border-slate-200/80 text-xs flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <span className="text-[#627D98] block text-[11px]">Selected Property:</span>
            <span className="font-bold text-[#102A43] truncate block">{propertyTitle}</span>
          </div>
          <span className="font-mono font-semibold text-[#2698E8] bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
            {propertyId}
          </span>
        </div>

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
            placeholder="e.g. Priyank Patel"
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

        {/* Phone & Email Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#102A43] mb-1">
              Mobile Number <span className="text-rose-500">*</span>
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
                placeholder="98790 12345"
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

        {/* Preferred Site Visit Date (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">
            Preferred Site Visit Date <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="date"
            name="preferredVisitDate"
            disabled={isSubmitting}
            min={getTomorrowDateString()}
            value={formData.preferredVisitDate}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8] text-sm text-[#243B53] outline-none transition-colors disabled:opacity-60"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-[#102A43] mb-1">
            Message or Specific Questions <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            name="message"
            rows={3}
            disabled={isSubmitting}
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Ask about floor availability, pricing negotiations, or society amenities..."
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
              I consent to <strong>NEEV REALTY GROUP</strong> contacting me via phone, WhatsApp, or email regarding this property enquiry. <span className="text-rose-500">*</span>
            </span>
          </label>
          {errors.consentGranted && (
            <p className="text-xs text-rose-500 mt-1">{errors.consentGranted}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-3 px-4 rounded-lg text-sm font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] shadow transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2698E8] disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Enquiry...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Property Enquiry</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleBookSiteVisit}
            className="w-full sm:w-auto py-3 px-4 rounded-lg text-sm font-semibold text-[#102A43] bg-[#DFF1FF] hover:bg-[#c9e7ff] transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#2698E8]" />
            <span>Book Site Visit</span>
          </button>
        </div>
      </form>
    </div>
  );
}
