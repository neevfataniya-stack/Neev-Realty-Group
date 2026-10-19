import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { validatePhone, validateEmail, ContactFormData } from '../utils/formValidation';
import { submitCustomerEnquiry } from '../services/api';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Loader2,
  AlertCircle
} from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: 'General Residential Inquiry',
    message: '',
    consentGranted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [demoTicketId, setDemoTicketId] = useState('');

  const subjectOptions = [
    'General Residential Inquiry',
    'Request Property Callback',
    'Schedule Site Visit Inquiry',
    'Listing Inquiry & Verification',
    'Feedback & Website Suggestion',
  ];

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
    if (isSubmitting) return;

    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (minimum 2 letters).';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = 'Please enter a message of at least 5 characters.';
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
        propertyId: 'general-contact',
        propertyTitle: `Contact Desk: ${formData.subject}`,
        message: formData.message.trim(),
        consentGranted: true,
        type: 'enquiry',
      });

      setDemoTicketId(response.enquiryId || `NRG-TCK-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F3F6F9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        {/* Page Heading */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <span className="text-xs font-semibold text-[#2698E8] tracking-widest uppercase">
            Get In Touch
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight mt-1">
            Contact NEEV REALTY GROUP
          </h1>
          <p className="text-sm text-[#627D98] mt-1 max-w-2xl leading-relaxed">
            Have questions regarding sample properties, residential zones in Surat, or want assistance scheduling a walkthrough? We are here to help.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Channels & Demo Notice */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-[#102A43] pb-3 border-b border-slate-100">
                Contact & Support Desk
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-[#F3F6F9] border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#102A43] block">
                      Office Location (Placeholder)
                    </span>
                    <span className="text-xs text-[#627D98] leading-relaxed">
                      VIP Road / Vesu Corridor, Surat, Gujarat, India - 395007
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-[#F3F6F9] border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#102A43] block">
                      Phone Support (Placeholder)
                    </span>
                    <span className="text-xs text-[#627D98]">
                      +91 98790 00000 (Mon - Sat, 9:30 AM - 6:30 PM)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-[#F3F6F9] border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#102A43] block">
                      WhatsApp Desk (Placeholder)
                    </span>
                    <span className="text-xs text-[#627D98]">
                      +91 98790 11111 (Chat Support)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-lg bg-[#F3F6F9] border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#102A43] block">
                      Email Address (Placeholder)
                    </span>
                    <span className="text-xs text-[#627D98]">
                      contact@neevrealtygroup.demo
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#627D98] space-y-2">
                <div className="flex items-center gap-1.5 text-[#102A43] font-semibold">
                  <Clock className="w-4 h-4 text-[#2698E8]" />
                  <span>Support Hours</span>
                </div>
                <p>Monday to Saturday: 9:30 AM to 6:30 PM IST</p>
                <p>Sunday: Closed for routine maintenance</p>
              </div>
            </div>

            {/* Clear Transparency Notice */}
            <div className="p-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Demonstration Notice:</strong> All contact numbers and email addresses shown here are placeholders for this frontend application showcase. No actual business identity or phone system is represented.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-8 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 inline-block mb-2">
                  Message Logged Successfully
                </span>
                <h3 className="text-xl font-bold text-[#102A43] mb-1">
                  Thank You For Reaching Out
                </h3>
                <p className="text-xs font-mono text-[#2698E8] font-semibold mb-4">
                  Ticket Reference: {demoTicketId}
                </p>
                <p className="text-xs text-[#243B53] max-w-md mx-auto mb-6 leading-relaxed">
                  Your message has been captured in this frontend demonstration. In a production environment, this message triggers email alerts and logs into your customer inquiry CRM.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      subject: 'General Residential Inquiry',
                      message: '',
                      consentGranted: false,
                    });
                  }}
                  className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-[#102A43] mb-1">
                  Send Us a Direct Message
                </h3>
                <p className="text-xs text-[#627D98] mb-6">
                  Please fill out the form below with your query or requirement.
                </p>

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
                      placeholder="e.g. Priyank Shah"
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

                  {/* Phone and Email */}
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
                        placeholder="priyank@example.com"
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

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Subject
                    </label>
                    <select
                      name="subject"
                      disabled={isSubmitting}
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] text-sm text-[#243B53] bg-white outline-none disabled:opacity-60"
                    >
                      {subjectOptions.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      disabled={isSubmitting}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Share your requirements, desired property configurations or questions..."
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#243B53] outline-none transition-colors resize-none ${
                        errors.message
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8]'
                      } disabled:opacity-60`}
                    />
                    {errors.message && (
                      <p className="text-xs text-rose-500 mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Consent Checkbox */}
                  <div>
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
                        I consent to <strong>NEEV REALTY GROUP</strong> contacting me via phone or email regarding this message. <span className="text-rose-500">*</span>
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
                    className="w-full py-3 px-4 rounded-lg text-sm font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] shadow transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2698E8] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
