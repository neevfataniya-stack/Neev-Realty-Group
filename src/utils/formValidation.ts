export interface EnquiryFormData {
  fullName: string;
  phone: string;
  email: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
  message: string;
  propertyId: string;
  propertyTitle: string;
}

export interface SiteVisitFormData {
  fullName: string;
  phone: string;
  email: string;
  visitDate: string;
  visitTime: string;
  message: string;
  propertyId: string;
  propertyTitle: string;
}

export interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export function validatePhone(phone: string): boolean {
  // Accepts standard Indian 10-digit number, with optional +91 or 0 prefix, spaces or hyphens
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  const indianMobileRegex = /^(\+91|0)?[6-9]\d{9}$/;
  return indianMobileRegex.test(clean);
}

export function validateEmail(email: string): boolean {
  if (!email || !email.trim()) return true; // optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isPastDate(dateString: string): boolean {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(dateString);
  return selectedDate < today;
}

export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}
