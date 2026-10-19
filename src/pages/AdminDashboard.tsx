import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from '../context/RouterContext';
import {
  adminLogin,
  adminLogout,
  verifyAdminSession,
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  triggerTestEmail,
  AdminEnquiry,
  AdminStats,
  AdminProfile
} from '../services/api';
import { NeevLogo } from '../components/NeevLogo';
import {
  Lock,
  LogOut,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Trash2,
  Eye,
  Shield,
  Loader2,
  CalendarCheck,
  CheckCircle2,
  Bell,
  ExternalLink
} from 'lucide-react';

export function AdminDashboard() {
  const { navigate } = useRouter();

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Test email state
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailFeedback, setTestEmailFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    previewUrl?: string;
  } | null>(null);

  // Enquiries & Dashboard state
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    new: 0,
    contacted: 0,
    scheduled: 0,
    completed: 0,
  });
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Selected enquiry for detail drawer/modal
  const [activeEnquiry, setActiveEnquiry] = useState<AdminEnquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Check initial admin session
  useEffect(() => {
    let mounted = true;
    verifyAdminSession().then((res) => {
      if (mounted) {
        setIsAuthenticated(res.authenticated);
        if (res.admin) {
          setAdminProfile(res.admin);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch enquiries when authenticated or filters change
  const fetchEnquiries = useCallback(async () => {
    setIsLoadingEnquiries(true);
    setErrorMessage(null);
    try {
      const data = await getAdminEnquiries({
        search: searchQuery,
        status: selectedStatus,
        type: selectedType,
      });
      setEnquiries(data.enquiries);
      setStats(data.stats);
    } catch (err: any) {
      console.error('Fetch error:', err);
      if (err.message.includes('Session expired')) {
        setIsAuthenticated(false);
      } else {
        setErrorMessage(err.message || 'Failed to load enquiries from database.');
      }
    } finally {
      setIsLoadingEnquiries(false);
    }
  }, [searchQuery, selectedStatus, selectedType]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnquiries();
    }
  }, [isAuthenticated, fetchEnquiries]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isLoggingIn) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await adminLogin(passwordInput.trim());
      setIsAuthenticated(true);
      if (res.admin) {
        setAdminProfile(res.admin);
      }
      setPasswordInput('');
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect administrator password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setAdminProfile(null);
    setEnquiries([]);
  };

  // Handle Send Test Email
  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailFeedback(null);
    try {
      const data = await triggerTestEmail();
      setTestEmailFeedback({
        type: 'success',
        message: `Notification email successfully dispatched to ${data.targetEmail}!`,
        previewUrl: data.result.previewUrl,
      });
      fetchEnquiries();
    } catch (err: any) {
      setTestEmailFeedback({
        type: 'error',
        message: err.message || 'Failed to dispatch test notification.',
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Update Status
  const handleStatusChange = async (
    enquiryId: string,
    newStatus: 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Completed'
  ) => {
    setUpdatingId(enquiryId);
    try {
      const updated = await updateEnquiryStatus(enquiryId, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: updated.status } : e))
      );
      if (activeEnquiry?.id === enquiryId) {
        setActiveEnquiry((prev) => (prev ? { ...prev, status: updated.status } : null));
      }
      // Re-fetch stats
      fetchEnquiries();
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Enquiry
  const handleDelete = async (enquiryId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete enquiry ${enquiryId}?`)) {
      return;
    }

    try {
      await deleteEnquiry(enquiryId);
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
      if (activeEnquiry?.id === enquiryId) {
        setActiveEnquiry(null);
      }
      fetchEnquiries();
    } catch (err: any) {
      alert(`Error deleting enquiry: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // SCREEN 1: Admin Login Gate
  // -------------------------------------------------------------
  if (isAuthenticated === false || (isAuthenticated === null && !sessionStorage.getItem('nrg_admin_token'))) {
    return (
      <div className="min-h-[85vh] bg-[#F3F6F9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#102A43] text-white flex items-center justify-center mx-auto mb-4 shadow">
              <Lock className="w-7 h-7 text-[#2698E8]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#102A43] tracking-tight">
              NEEV REALTY GROUP
            </h2>
            <p className="text-xs font-semibold text-[#2698E8] uppercase tracking-wider mt-1">
              Private Management Portal
            </p>
            <p className="text-xs text-[#627D98] mt-2">
              Enter your authorized administrator credentials to manage customer property enquiries and private bookings.
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password..."
                  required
                  disabled={isLoggingIn}
                  className="w-full pl-3.5 pr-10 py-3 rounded-lg border border-slate-300 hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8] text-sm text-[#243B53] outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-[#627D98] mt-1.5">
                Configured securely in server environment variables.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-lg text-sm font-bold text-white bg-[#102A43] hover:bg-[#243B53] transition-colors shadow flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2698E8] disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#2698E8]" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-[#2698E8]" />
                  <span>Access Protected Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-[#627D98] hover:text-[#102A43] transition-colors focus:outline-none"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 2: Authorized Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div className="bg-[#F3F6F9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Management Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#102A43] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Shield className="w-5 h-5 text-[#2698E8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#102A43]">
                  NEEV REALTY GROUP — Admin Dashboard
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#DFF1FF] text-[#102A43] border border-[#2698E8]/30">
                  Private & Confidential
                </span>
              </div>
              <p className="text-xs text-[#627D98]">
                Real-Time Customer Enquiries & Site Visit Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchEnquiries}
              disabled={isLoadingEnquiries}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-[#243B53] bg-[#F3F6F9] hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Refresh Enquiries"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEnquiries ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Private Configuration & Notification Status Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-[#102A43]">
                  Connected Private Notification Channel
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Server-Side Protected
                </span>
              </div>
              <p className="text-xs text-[#627D98]">
                Customer enquiries and site visit bookings are automatically logged into this persistent database and dispatched to your email.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#243B53]">
                  <Mail className="w-3.5 h-3.5 text-[#2698E8]" />
                  <span className="text-[#627D98]">Private Email:</span>
                  <strong className="font-mono text-[#102A43]">{adminProfile?.privateEmail || 'neevfataniy@gmail.com'}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-[#243B53]">
                  <Phone className="w-3.5 h-3.5 text-[#2698E8]" />
                  <span className="text-[#627D98]">Private Phone:</span>
                  <strong className="font-mono text-[#102A43]">+91 {adminProfile?.privatePhone || '7862828010'}</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  (Strictly concealed from public website visitors)
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTestEmail}
                className="px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-60"
              >
                {isSendingTestEmail ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Test Email...</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>Send Test Notification</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {testEmailFeedback && (
            <div className={`mt-3 p-3 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              testEmailFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testEmailFeedback.message}</span>
              </div>
              {testEmailFeedback.previewUrl && (
                <a
                  href={testEmailFeedback.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900 flex items-center gap-1 shrink-0"
                >
                  <span>View Dispatched Email Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="text-xs font-semibold text-[#627D98] uppercase tracking-wider block">
              Total Enquiries
            </span>
            <div className="text-2xl font-black text-[#102A43] font-mono tabular-nums mt-1">
              {stats.total}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
              New (Uncontacted)
            </span>
            <div className="text-2xl font-black text-blue-700 font-mono tabular-nums mt-1">
              {stats.new}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block">
              Contacted
            </span>
            <div className="text-2xl font-black text-amber-700 font-mono tabular-nums mt-1">
              {stats.contacted}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block">
              Site Visits
            </span>
            <div className="text-2xl font-black text-purple-700 font-mono tabular-nums mt-1">
              {stats.scheduled}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
              Completed
            </span>
            <div className="text-2xl font-black text-emerald-700 font-mono tabular-nums mt-1">
              {stats.completed}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, phone, email, or property title..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-xs text-[#243B53] outline-none focus:border-[#2698E8]"
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs text-[#243B53] bg-white outline-none focus:border-[#2698E8]"
              >
                <option value="All">All Statuses</option>
                <option value="New">Status: New</option>
                <option value="Contacted">Status: Contacted</option>
                <option value="Site Visit Scheduled">Status: Site Visit Scheduled</option>
                <option value="Completed">Status: Completed</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs text-[#243B53] bg-white outline-none focus:border-[#2698E8]"
              >
                <option value="All">All Request Types</option>
                <option value="enquiry">Property Enquiries</option>
                <option value="site_visit">Site Visit Bookings</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#627D98] pt-2 border-t border-slate-100">
            <span>
              Showing <strong className="text-[#102A43] font-mono">{enquiries.length}</strong> matching records (Sorted: Newest First)
            </span>
            <span className="text-[11px] text-slate-500">
              Auto-saved in secure persistent storage
            </span>
          </div>
        </div>

        {/* Enquiries List / Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {isLoadingEnquiries ? (
            <div className="py-20 text-center text-xs text-[#627D98] space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#2698E8]" />
              <p>Loading enquiries from secure database...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#627D98] max-w-sm mx-auto px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#102A43] mb-1">
                No Enquiries Found
              </h3>
              <p>
                {searchQuery || selectedStatus !== 'All' || selectedType !== 'All'
                  ? 'No enquiries match the current filter or search criteria.'
                  : 'Customer property enquiries and site visit bookings will appear here in real-time as visitors submit them.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#102A43] text-white border-b border-[#243B53]">
                    <th className="py-3 px-4 font-semibold">Ref ID & Time</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Customer Details</th>
                    <th className="py-3 px-4 font-semibold">Property Interested</th>
                    <th className="py-3 px-4 font-semibold">Visit Preference</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enquiries.map((item) => {
                    const isNew = item.status === 'New';
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isNew ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        {/* ID and Date */}
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-[#102A43] block">
                            {item.id}
                          </span>
                          <span className="text-[11px] text-[#627D98]">
                            {new Date(item.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {new Date(item.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="py-3 px-4">
                          {item.type === 'site_visit' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                              <CalendarCheck className="w-3 h-3" />
                              <span>Site Visit</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                              <MessageSquare className="w-3 h-3" />
                              <span>Enquiry</span>
                            </span>
                          )}
                        </td>

                        {/* Customer Info */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#102A43] block">
                            {item.fullName}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <a
                              href={`tel:+91${item.phone}`}
                              className="text-[#2698E8] hover:underline flex items-center gap-1 font-mono font-medium"
                            >
                              <Phone className="w-3 h-3" />
                              <span>+91 {item.phone}</span>
                            </a>
                            <a
                              href={`https://wa.me/91${item.phone}?text=Hello%20${encodeURIComponent(item.fullName)},%20thank%20you%20for%20enquiring%20with%20NEEV%20REALTY%20GROUP%20about%20${encodeURIComponent(item.propertyTitle)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 text-[10px] px-1.5 py-0.5 bg-emerald-50 rounded border border-emerald-200 font-semibold"
                            >
                              WhatsApp
                            </a>
                          </div>
                          {item.email && (
                            <span className="text-[11px] text-[#627D98] block mt-0.5">
                              {item.email}
                            </span>
                          )}
                        </td>

                        {/* Property */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-[#243B53] line-clamp-1 block max-w-[200px]" title={item.propertyTitle}>
                            {item.propertyTitle}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            ID: {item.propertyId}
                          </span>
                        </td>

                        {/* Visit Preference */}
                        <td className="py-3 px-4">
                          {item.preferredVisitDate ? (
                            <div className="text-[11px]">
                              <span className="font-semibold text-[#102A43] block">
                                {item.preferredVisitDate}
                              </span>
                              {item.preferredTime && (
                                <span className="text-slate-500 text-[10px]">
                                  {item.preferredTime}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">
                              None requested
                            </span>
                          )}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3 px-4">
                          <select
                            value={item.status}
                            disabled={updatingId === item.id}
                            onChange={(e) =>
                              handleStatusChange(item.id, e.target.value as any)
                            }
                            className={`px-2.5 py-1 rounded text-xs font-semibold outline-none border transition-colors cursor-pointer ${
                              item.status === 'New'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : item.status === 'Contacted'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : item.status === 'Site Visit Scheduled'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.notificationPreviewUrl && (
                              <a
                                href={item.notificationPreviewUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                                title="Open Live Email Preview"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => setActiveEnquiry(item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#102A43] hover:bg-slate-100 transition-colors"
                              title="View full enquiry details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Enquiry Detail Modal */}
        {activeEnquiry && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
              <div className="bg-[#102A43] text-white p-5 flex items-center justify-between border-b border-[#243B53]">
                <div>
                  <span className="text-[11px] text-[#2698E8] font-bold uppercase tracking-wider block">
                    Enquiry Details
                  </span>
                  <h3 className="text-base font-bold text-white font-mono">
                    {activeEnquiry.id}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveEnquiry(null)}
                  className="p-1 text-slate-300 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[#627D98] block">Customer:</span>
                    <span className="font-bold text-sm text-[#102A43]">{activeEnquiry.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#627D98] block">Phone:</span>
                    <a href={`tel:+91${activeEnquiry.phone}`} className="font-bold text-sm text-[#2698E8] hover:underline font-mono">
                      +91 {activeEnquiry.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#627D98] block">Email:</span>
                    <span className="text-[#243B53]">{activeEnquiry.email || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[#627D98] block">Submitted At:</span>
                    <span className="text-[#243B53] font-mono">
                      {new Date(activeEnquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[#627D98] font-semibold block mb-1">Target Property:</span>
                  <div className="p-3 bg-[#F3F6F9] rounded-lg border border-slate-200">
                    <span className="font-bold text-[#102A43] text-sm block">{activeEnquiry.propertyTitle}</span>
                    <span className="text-[11px] text-slate-500 font-mono">Ref ID: {activeEnquiry.propertyId}</span>
                  </div>
                </div>

                {activeEnquiry.preferredVisitDate && (
                  <div>
                    <span className="text-[#627D98] font-semibold block mb-1">Site Visit Request:</span>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-purple-900 font-medium">
                      Date: {activeEnquiry.preferredVisitDate} {activeEnquiry.preferredTime ? `(${activeEnquiry.preferredTime})` : ''}
                    </div>
                  </div>
                )}

                {activeEnquiry.message && (
                  <div>
                    <span className="text-[#627D98] font-semibold block mb-1">Customer Message:</span>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[#243B53] whitespace-pre-wrap leading-relaxed">
                      {activeEnquiry.message}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[#627D98] font-semibold block mb-1">Status Management:</span>
                  <div className="flex items-center gap-2">
                    {(['New', 'Contacted', 'Site Visit Scheduled', 'Completed'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(activeEnquiry.id, st)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                          activeEnquiry.status === st
                            ? 'bg-[#102A43] text-white shadow-sm'
                            : 'bg-slate-100 text-[#243B53] hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Notification Status */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] text-[#627D98]">
                    <Bell className="w-3.5 h-3.5 text-[#2698E8]" />
                    <span>Notification State:</span>
                    <span className="font-semibold text-[#102A43]">
                      {activeEnquiry.notificationStatus === 'delivered'
                        ? 'Delivered'
                        : activeEnquiry.notificationStatus === 'pending_smtp'
                        ? 'Saved in DB (Queued for SMTP)'
                        : 'Dispatch Error'}
                    </span>
                  </div>
                  {activeEnquiry.notificationDetails && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {activeEnquiry.notificationDetails}
                    </p>
                  )}
                  {activeEnquiry.notificationPreviewUrl && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <a
                        href={activeEnquiry.notificationPreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Dispatched Email Live Preview</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`https://wa.me/91${activeEnquiry.phone}?text=Hello%20${encodeURIComponent(activeEnquiry.fullName)},%20I%20am%20following%20up%20from%20NEEV%20REALTY%20GROUP%20regarding%20your%20enquiry%20for%20${encodeURIComponent(activeEnquiry.propertyTitle)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Contact via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setActiveEnquiry(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-[#102A43] rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
