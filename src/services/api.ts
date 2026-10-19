export interface SubmitEnquiryPayload {
  fullName: string;
  phone: string;
  email?: string;
  propertyId: string;
  propertyTitle: string;
  preferredVisitDate?: string;
  preferredTime?: string;
  message?: string;
  consentGranted: boolean;
  type?: 'enquiry' | 'site_visit';
}

export interface SubmitEnquiryResponse {
  success: boolean;
  enquiryId?: string;
  createdAt?: string;
  type?: string;
  propertyTitle?: string;
  message?: string;
  notificationStatus?: 'delivered' | 'pending_smtp' | 'failed';
  error?: string;
}

export interface AdminProfile {
  name: string;
  role: string;
  privateEmail?: string;
  privatePhone?: string;
}

export interface AdminEnquiry {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email?: string;
  propertyId: string;
  propertyTitle: string;
  preferredVisitDate?: string;
  preferredTime?: string;
  message?: string;
  consentGranted: boolean;
  type: 'enquiry' | 'site_visit';
  status: 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Completed';
  notificationStatus: 'delivered' | 'pending_smtp' | 'failed';
  notificationDetails?: string;
  notificationPreviewUrl?: string;
}

export interface AdminStats {
  total: number;
  new: number;
  contacted: number;
  scheduled: number;
  completed: number;
}

export async function submitCustomerEnquiry(
  payload: SubmitEnquiryPayload
): Promise<SubmitEnquiryResponse> {
  const response = await fetch('/api/enquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
  }
  return data;
}

// Admin APIs
const ADMIN_TOKEN_KEY = 'nrg_admin_token';

export function getStoredAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearStoredAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function adminLogin(password: string): Promise<{ success: boolean; token: string; admin?: AdminProfile }> {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Invalid administrator password.');
  }

  setStoredAdminToken(data.token);
  return data;
}

export async function verifyAdminSession(): Promise<{ authenticated: boolean; admin?: AdminProfile }> {
  const token = getStoredAdminToken();
  if (!token) return { authenticated: false };

  try {
    const response = await fetch('/api/admin/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { authenticated: false };
    const data = await response.json();
    return { authenticated: true, admin: data.admin };
  } catch {
    return { authenticated: false };
  }
}

export async function triggerTestEmail(): Promise<{
  success: boolean;
  targetEmail: string;
  targetPhone: string;
  result: { success: boolean; status: string; details: string; previewUrl?: string };
  message: string;
}> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Authentication required.');

  const response = await fetch('/api/admin/test-email', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send test email.');
  }
  return data;
}

export async function adminLogout(): Promise<void> {
  const token = getStoredAdminToken();
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore network errors during logout
    }
  }
  clearStoredAdminToken();
}

export async function getAdminEnquiries(params?: {
  search?: string;
  status?: string;
  type?: string;
}): Promise<{ enquiries: AdminEnquiry[]; stats: AdminStats }> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Authentication required.');

  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.status && params.status !== 'All') query.append('status', params.status);
  if (params?.type && params.type !== 'All') query.append('type', params.type);

  const response = await fetch(`/api/admin/enquiries?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearStoredAdminToken();
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(data.error || 'Failed to fetch enquiries.');
  }

  return data;
}

export async function updateEnquiryStatus(
  id: string,
  status: 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Completed'
): Promise<AdminEnquiry> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Authentication required.');

  const response = await fetch(`/api/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update status.');
  }

  return data.enquiry;
}

export async function deleteEnquiry(id: string): Promise<void> {
  const token = getStoredAdminToken();
  if (!token) throw new Error('Authentication required.');

  const response = await fetch(`/api/admin/enquiries/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete enquiry.');
  }
}
