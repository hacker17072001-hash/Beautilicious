import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Plus,
  Trash2,
  Edit2,
  Settings,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  Lock
} from 'lucide-react';
import {
  Booking,
  Service,
  GalleryItem,
  Inquiry,
  BlockedDate,
  SiteSettings,
  AdminStats,
  Category
} from '../types';
import {
  getAuthToken,
  loginAdmin,
  logoutAdmin,
  changePassword,
  getBookings,
  updateBooking,
  deleteBooking,
  getServices,
  createService,
  updateService,
  deleteService,
  getCategories,
  createCategory,
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getInquiries,
  updateInquiry,
  getBlockedDates,
  addBlockedDate,
  deleteBlockedDate,
  getSettings,
  updateSettings,
  getStats
} from '../lib/api';
import { ASSET_IMAGES } from '../assets/images';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onRefreshPublicData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToSite,
  onRefreshPublicData
}) => {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'services' | 'gallery' | 'inquiries' | 'settings'>('overview');

  // State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Modals & form states
  const [rescheduleModalBooking, setRescheduleModalBooking] = useState<Booking | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('');

  // New Service Modal
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({
    name: '',
    category: 'Couture Nail Art & Extensions',
    studio: 'nails',
    description: '',
    priceType: 'fixed',
    price: 2500,
    currency: '₹',
    durationMinutes: 75,
    image: ASSET_IMAGES.nailArt,
    featured: false,
    active: true
  });

  // New Gallery Modal
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    title: '',
    category: 'Couture Nail Art',
    studio: 'nails',
    imageUrl: ASSET_IMAGES.nailArt,
    caption: '',
    featured: false
  });

  // Block date form
  const [blockDateInput, setBlockDateInput] = useState('');
  const [blockReasonInput, setBlockReasonInput] = useState('');

  // Password change form
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwModalOpen, setPwModalOpen] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    if (token) {
      loadAllAdminData();
    }
  }, [token]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [sData, bData, srvData, catData, gData, inqData, blkData, settsData] = await Promise.all([
        getStats(),
        getBookings(),
        getServices(),
        getCategories(),
        getGallery(),
        getInquiries(),
        getBlockedDates(),
        getSettings()
      ]);

      setStats(sData);
      setBookings(bData);
      setServices(srvData);
      setCategories(catData);
      setGallery(gData);
      setInquiries(inqData);
      setBlockedDates(blkData);
      setSettings(settsData);
      setSettingsForm(settsData);
    } catch (err: any) {
      if (err.message?.includes('Unauthorized') || err.message?.includes('invalid')) {
        setToken(null);
      } else {
        setFeedback({ type: 'error', message: err.message || 'Failed to load data' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await loginAdmin(loginUsername, loginPassword);
      setToken(res.token);
      setFeedback({ type: 'success', message: 'Welcome back to Beautilicious Management Portal.' });
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setToken(null);
  };

  // Booking actions
  const handleUpdateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateBooking(id, { status });
      setFeedback({ type: 'success', message: `Booking status updated to ${status}` });
      await loadAllAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update booking status' });
    }
  };

  const handleSaveReschedule = async () => {
    if (!rescheduleModalBooking || !newRescheduleDate || !newRescheduleTime) return;
    try {
      await updateBooking(rescheduleModalBooking.id, {
        date: newRescheduleDate,
        timeSlot: newRescheduleTime
      });
      setFeedback({ type: 'success', message: `Appointment rescheduled to ${newRescheduleDate} at ${newRescheduleTime}` });
      setRescheduleModalBooking(null);
      await loadAllAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to reschedule' });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this booking record?')) return;
    try {
      await deleteBooking(id);
      setFeedback({ type: 'success', message: 'Booking removed' });
      await loadAllAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete booking' });
    }
  };

  // Service actions
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService(editingService.id, serviceForm);
        setFeedback({ type: 'success', message: 'Service updated successfully' });
      } else {
        await createService(serviceForm);
        setFeedback({ type: 'success', message: 'New service created' });
      }
      setServiceModalOpen(false);
      setEditingService(null);
      await loadAllAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save service' });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this atelier service?')) return;
    try {
      await deleteService(id);
      setFeedback({ type: 'success', message: 'Service removed' });
      await loadAllAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete service' });
    }
  };

  // Gallery actions
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGalleryItem(galleryForm);
      setFeedback({ type: 'success', message: 'Portfolio piece published' });
      setGalleryModalOpen(false);
      await loadAllAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save gallery item' });
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Remove this portfolio artwork?')) return;
    try {
      await deleteGalleryItem(id);
      setFeedback({ type: 'success', message: 'Portfolio piece removed' });
      await loadAllAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete' });
    }
  };

  // Blocked Date
  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDateInput) return;
    try {
      await addBlockedDate({ date: blockDateInput, reason: blockReasonInput || 'Studio Closed' });
      setFeedback({ type: 'success', message: `Date ${blockDateInput} blocked from bookings` });
      setBlockDateInput('');
      setBlockReasonInput('');
      await loadAllAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to block date' });
    }
  };

  const handleDeleteBlockedDate = async (id: string) => {
    try {
      await deleteBlockedDate(id);
      setFeedback({ type: 'success', message: 'Date unblocked' });
      await loadAllAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to unblock date' });
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(settingsForm);
      setFeedback({ type: 'success', message: 'Atelier settings saved and published' });
      await loadAllAdminData();
      onRefreshPublicData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update settings' });
    }
  };

  // Password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(currentPw, newPw);
      setFeedback({ type: 'success', message: 'Admin password successfully updated' });
      setPwModalOpen(false);
      setCurrentPw('');
      setNewPw('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to change password' });
    }
  };

  // If not logged in, render Login View
  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B1E] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#EEDCD7] selection:text-[#1E1B1E]">
        {/* Decorative soft blurred circles for luxury depth */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#EEDCD7]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FAF0EC] rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#1E1B1E]/10 shadow-xl space-y-6 relative z-10">
          {/* Handwritten Script Sticker */}
          <div className="absolute -top-5 -right-3 select-none pointer-events-none text-right">
            <div className="font-script text-2xl sm:text-3xl text-[#1E1B1E] leading-tight rotate-6">
              <p>Atelier</p>
              <p>Portal ♡</p>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#EEDCD7] text-[#1E1B1E] mx-auto flex items-center justify-center rounded-full mb-3 shadow-xs">
              <ShieldCheck size={26} className="text-[#8D6B78]" />
            </div>
            <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#8D6B78] block">
              ATELIER MANAGEMENT PORTAL
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1E]">Beautilicious Admin</h1>
            <p className="text-xs text-[#1E1B1E]/70 font-sans leading-relaxed">
              Sign in with your verified administrative credentials to manage appointments, services, and atelier content in Jalgaon.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">
                Username
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF7F2] rounded-xl border border-[#1E1B1E]/15 text-xs text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-[#FAF7F2] rounded-xl border border-[#1E1B1E]/15 text-xs text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E] transition-all"
              />
              <span className="text-[10px] text-[#1E1B1E]/50 block mt-1">
                Default: <code className="bg-[#FAF7F2] px-2 py-0.5 rounded-md font-mono text-[#8D6B78]">beautilicious2026!</code> (editable in Settings)
              </span>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                {isLoggingIn ? 'Verifying...' : 'Access Dashboard →'}
              </button>

              <button
                type="button"
                onClick={onBackToSite}
                className="w-full py-3 bg-[#FAF7F2] border border-[#1E1B1E]/15 rounded-full text-xs font-semibold text-[#1E1B1E] hover:bg-[#EEDCD7] transition-all cursor-pointer"
              >
                Return to Public Website
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus !== 'all' && b.status !== bookingFilterStatus) return false;
    if (bookingSearch) {
      const q = bookingSearch.toLowerCase();
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        b.referenceNumber.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B1E] flex flex-col selection:bg-[#EEDCD7] selection:text-[#1E1B1E]">
      {/* Top Bar for Admin */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#1E1B1E]/10 px-6 md:px-10 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBackToSite}
            className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#EEDCD7] text-[#1E1B1E] border border-[#1E1B1E]/10 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <span>← Public Website</span>
          </button>
          <span className="text-[#1E1B1E]/20">|</span>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B1E] tracking-tight">
              Beautilicious <span className="font-sans font-normal text-xs text-[#8D6B78] uppercase tracking-widest block sm:inline-block sm:ml-1">Management Portal</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setPwModalOpen(true)}
            className="text-xs text-[#1E1B1E] hover:bg-[#FAF7F2] flex items-center gap-1.5 px-4 py-2 border border-[#1E1B1E]/15 rounded-full font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Lock size={12} className="text-[#8D6B78]" />
            <span>Security</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center gap-1.5 px-4 py-2 border border-rose-200 rounded-full font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mx-6 md:mx-10 mt-4 px-6 py-3 rounded-2xl text-xs flex items-center justify-between shadow-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <span className="font-medium">{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-[#1E1B1E]/50 hover:text-[#1E1B1E] p-1 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Sub Navigation Tabs */}
      <div className="bg-white border-b border-[#1E1B1E]/10 px-6 md:px-10 py-3.5 overflow-x-auto flex gap-2 text-xs font-medium tracking-wide">
        {[
          { id: 'overview', label: 'Overview & KPIs' },
          { id: 'bookings', label: `Bookings (${bookings.length})` },
          { id: 'services', label: `Services (${services.length})` },
          { id: 'gallery', label: `Gallery (${gallery.length})` },
          { id: 'inquiries', label: `Inquiries (${inquiries.filter((i) => i.status === 'new').length} New)` },
          { id: 'settings', label: 'Settings & Schedules' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-full uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#171417] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#1E1B1E]/75 border border-[#1E1B1E]/10 hover:border-[#1E1B1E]/30 hover:text-[#1E1B1E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <main className="p-6 md:p-10 flex-1 max-w-7xl mx-auto w-full space-y-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="p-6 bg-white rounded-3xl border border-[#1E1B1E]/10 shadow-xs space-y-2 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-[#EEDCD7] flex items-center justify-center text-[#8D6B78]">
                  <Clock size={18} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block">
                  Pending Approval
                </span>
                <p className="font-numeric text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1B1E]">
                  {stats?.pendingBookings ?? 0}
                </p>
                <span className="text-[11px] text-[#1E1B1E]/60 block">Require concierge review</span>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-[#1E1B1E]/10 shadow-xs space-y-2 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-[#EEDCD7] flex items-center justify-center text-[#8D6B78]">
                  <CheckCircle size={18} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block">
                  Confirmed Bookings
                </span>
                <p className="font-numeric text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1B1E]">
                  {stats?.confirmedBookings ?? 0}
                </p>
                <span className="text-[11px] text-[#1E1B1E]/60 block">Locked atelier slots</span>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-[#1E1B1E]/10 shadow-xs space-y-2 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-[#EEDCD7] flex items-center justify-center text-[#8D6B78]">
                  <Sparkles size={18} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block">
                  Estimated Pipeline
                </span>
                <p className="font-numeric text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1B1E]">
                  ₹{stats?.estimatedRevenue ?? 0}
                </p>
                <span className="text-[11px] text-[#1E1B1E]/60 block">Confirmed service value</span>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-[#1E1B1E]/10 shadow-xs space-y-2 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-[#EEDCD7] flex items-center justify-center text-[#8D6B78]">
                  <MessageSquare size={18} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block">
                  New Inquiries
                </span>
                <p className="font-numeric text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1B1E]">
                  {stats?.newInquiries ?? 0}
                </p>
                <span className="text-[11px] text-[#1E1B1E]/60 block">Awaiting response</span>
              </div>
            </div>

            {/* Recent Bookings Queue */}
            <div className="bg-white rounded-3xl border border-[#1E1B1E]/10 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1E1B1E]">Recent Appointment Requests</h3>
                  <p className="text-xs text-[#1E1B1E]/65 font-sans">Latest submissions awaiting confirmation or preparation</p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#EEDCD7] text-[#1E1B1E] border border-[#1E1B1E]/10 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
                >
                  View All Bookings →
                </button>
              </div>

              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#1E1B1E]/8 hover:border-[#1E1B1E]/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1E1B1E] text-sm">{b.customerName}</span>
                        <span className="text-[#1E1B1E]/30">·</span>
                        <span className="text-[#8D6B78] font-mono font-semibold">{b.referenceNumber}</span>
                        <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                          b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          b.status === 'completed' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-[#1E1B1E]/75 mt-1 font-sans">
                        {b.serviceName} — <span className="font-semibold text-[#1E1B1E]">{b.date} at {b.timeSlot}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                          className="px-4 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 cursor-pointer shadow-2xs transition-all"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                          className="px-4 py-1.5 bg-[#171417] text-white text-xs font-semibold rounded-full hover:bg-black cursor-pointer shadow-2xs transition-all"
                        >
                          Complete
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${b.customerPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(b.customerName)},%20this%20is%20Ketna%20from%20Beautilicious%20regarding%20your%20appointment%20${b.referenceNumber}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-1.5 bg-white border border-[#1E1B1E]/15 rounded-full text-xs font-semibold text-[#1E1B1E] hover:bg-[#FAF7F2] transition-all"
                      >
                        WhatsApp Client
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-[#1E1B1E]/10 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1E1B1E]">Appointment Ledger</h3>
                <p className="text-xs text-[#1E1B1E]/65 font-sans">Manage, confirm, reschedule and export customer reservations</p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/api/bookings/export"
                  download="beautilicious_bookings_export.csv"
                  className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#EEDCD7] border border-[#1E1B1E]/15 rounded-full text-xs font-semibold text-[#1E1B1E] flex items-center gap-2 shadow-2xs transition-all"
                >
                  <Download size={13} />
                  <span>Export CSV</span>
                </a>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3.5 top-3 text-[#1E1B1E]/40" />
                <input
                  type="text"
                  placeholder="Search by client name, email, phone, reference..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] rounded-full border border-[#1E1B1E]/15 text-xs text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E] transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilterStatus(st)}
                    className={`px-3.5 py-1.5 text-xs rounded-full uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                      bookingFilterStatus === st
                        ? 'bg-[#171417] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-[#1E1B1E]/70 border border-[#1E1B1E]/10 hover:border-[#1E1B1E]/30 hover:text-[#1E1B1E]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#1E1B1E]/10">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#FAF7F2] border-b border-[#1E1B1E]/10 text-[10px] font-bold uppercase tracking-wider text-[#1E1B1E]/60">
                  <tr>
                    <th className="p-3.5">Reference</th>
                    <th className="p-3.5">Client</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Date & Slot</th>
                    <th className="p-3.5">Artist</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1B1E]/8">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#1E1B1E]/50">
                        No appointments match current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#8D6B78]">
                          {b.referenceNumber}
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-[#1E1B1E]">{b.customerName}</p>
                          <p className="text-[11px] text-[#1E1B1E]/60">{b.customerPhone}</p>
                          <p className="text-[11px] text-[#1E1B1E]/50">{b.customerEmail}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-medium text-[#1E1B1E]">{b.serviceName}</p>
                          <span className="text-[11px] font-numeric text-[#8D6B78] font-bold">{b.priceEstimate}</span>
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold font-numeric text-[#1E1B1E]">{b.date}</p>
                          <p className="text-[11px] font-numeric text-[#1E1B1E]/60">{b.timeSlot}</p>
                        </td>
                        <td className="p-3.5 text-[#1E1B1E]/80 font-medium">
                          {b.artist}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            b.status === 'completed' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                              className="px-3 py-1 bg-emerald-800 text-white text-[11px] font-semibold rounded-full hover:bg-emerald-700 cursor-pointer shadow-2xs"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                              className="px-3 py-1 bg-[#171417] text-white text-[11px] font-semibold rounded-full hover:bg-black cursor-pointer shadow-2xs"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setRescheduleModalBooking(b);
                              setNewRescheduleDate(b.date);
                              setNewRescheduleTime(b.timeSlot);
                            }}
                            className="px-3 py-1 bg-white border border-[#1E1B1E]/15 text-[11px] font-semibold rounded-full text-[#1E1B1E] hover:bg-[#FAF7F2] cursor-pointer"
                          >
                            Reschedule
                          </button>
                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                              className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold rounded-full hover:bg-rose-100 cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl border border-[#1E1B1E]/10 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1E1B1E]">Service Offerings & Prices</h3>
                <p className="text-xs text-[#1E1B1E]/65 font-sans">Create, edit, and toggle active status on atelier services</p>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
                  setServiceForm({
                    name: '',
                    category: 'Couture Nail Art & Extensions',
                    studio: 'nails',
                    description: '',
                    priceType: 'fixed',
                    price: 2500,
                    currency: '₹',
                    durationMinutes: 75,
                    image: ASSET_IMAGES.nailArt,
                    featured: false,
                    active: true
                  });
                  setServiceModalOpen(true);
                }}
                className="px-6 py-2.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
              >
                <Plus size={14} /> <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div key={srv.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#1E1B1E]/8 hover:border-[#1E1B1E]/20 transition-all flex gap-4 items-start shadow-2xs">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover border border-[#1E1B1E]/10 shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0 space-y-1 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase text-[#8D6B78] font-bold tracking-wider">{srv.category}</span>
                      <span className="text-[#1E1B1E]/30">·</span>
                      <span className="text-[10px] text-[#1E1B1E]/60 uppercase font-semibold">{srv.studio}</span>
                      {!srv.active && <span className="text-[10px] text-rose-600 font-bold tracking-wider bg-rose-50 px-2 py-0.5 rounded-full">[INACTIVE]</span>}
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#1E1B1E] truncate">{srv.name}</h4>
                    <p className="text-xs text-[#1E1B1E]/70 line-clamp-1">{srv.description}</p>
                    <p className="text-xs font-bold font-numeric text-[#1E1B1E] pt-0.5">
                      {srv.currency}{srv.price} · {srv.durationMinutes} mins
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingService(srv);
                        setServiceForm(srv);
                        setServiceModalOpen(true);
                      }}
                      className="p-2 text-[#1E1B1E]/70 hover:text-[#1E1B1E] hover:bg-white rounded-full transition-all cursor-pointer"
                      title="Edit service"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                      title="Delete service"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-3xl border border-[#1E1B1E]/10 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1E1B1E]">Portfolio & Artwork Media</h3>
                <p className="text-xs text-[#1E1B1E]/65 font-sans">Upload new showcase photos and curate exhibition lookbook</p>
              </div>
              <button
                onClick={() => setGalleryModalOpen(true)}
                className="px-6 py-2.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
              >
                <Plus size={14} /> <span>Add Portfolio Piece</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="border border-[#1E1B1E]/10 rounded-2xl overflow-hidden flex flex-col bg-[#FAF7F2] shadow-2xs group hover:shadow-md transition-all">
                  <div className="aspect-square overflow-hidden relative bg-white">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 text-xs font-sans">
                    <div>
                      <span className="text-[10px] text-[#8D6B78] uppercase font-bold tracking-wider block">{item.category}</span>
                      <p className="font-serif text-base font-bold text-[#1E1B1E] truncate mt-0.5">{item.title}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#1E1B1E]/8">
                      <span className="text-[10px] text-[#1E1B1E]/60 uppercase font-semibold">{item.studio}</span>
                      <button
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                        title="Delete piece"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INQUIRIES MANAGEMENT */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-[#1E1B1E]/10 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1E1B1E]">Customer Inquiries</h3>
              <p className="text-xs text-[#1E1B1E]/65 font-sans">Incoming notes and direct messages submitted via the website</p>
            </div>

            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-6 rounded-2xl border border-[#1E1B1E]/10 bg-[#FAF7F2] space-y-3 text-xs font-sans shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E1B1E]/10 pb-3">
                    <div>
                      <span className="font-bold text-[#1E1B1E] text-sm">{inq.name}</span>
                      <span className="text-[#1E1B1E]/30 mx-2">·</span>
                      <span className="text-[#8D6B78] font-medium">{inq.email}</span>
                      {inq.phone && <span className="text-[#1E1B1E]/60 ml-2">({inq.phone})</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full ${
                        inq.status === 'new' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-800'
                      }`}>
                        {inq.status}
                      </span>
                      <span className="text-[11px] text-[#1E1B1E]/50 font-numeric">{inq.createdAt.split('T')[0]}</span>
                    </div>
                  </div>

                  <p className="font-serif text-base font-bold text-[#1E1B1E]">{inq.subject}</p>
                  <p className="text-[#1E1B1E]/80 leading-relaxed font-sans">{inq.message}</p>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-[#1E1B1E]/60">
                      Preferred response: <strong className="uppercase text-[#1E1B1E]">{inq.preferredContact}</strong>
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {inq.phone && (
                        <a
                          href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(inq.name)},%20this%20is%20Ketna%20from%20Beautilicious%20following%20up%20on%20your%20inquiry.`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-1.5 bg-[#171417] text-white text-xs font-semibold rounded-full hover:bg-black transition-all shadow-2xs"
                        >
                          WhatsApp Client
                        </a>
                      )}
                      <a
                        href={`mailto:${inq.email}?subject=Re:%20${encodeURIComponent(inq.subject)}`}
                        className="px-4 py-1.5 bg-white border border-[#1E1B1E]/15 rounded-full text-xs font-semibold text-[#1E1B1E] hover:bg-[#FAF7F2] transition-all"
                      >
                        Email Client
                      </a>
                      {inq.status === 'new' && (
                        <button
                          onClick={async () => {
                            await updateInquiry(inq.id, { status: 'replied' });
                            await loadAllAdminData();
                          }}
                          className="px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-full hover:bg-emerald-100 transition-all cursor-pointer"
                        >
                          Mark Replied
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS & SCHEDULES */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Blocked Dates Management */}
            <div className="bg-white rounded-3xl border border-[#1E1B1E]/10 p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="font-serif text-2xl font-bold text-[#1E1B1E]">Blocked Dates & Studio Closures</h3>
              <p className="text-xs text-[#1E1B1E]/65 font-sans">Dates added here will be immediately disabled in the client booking calendar</p>

              <form onSubmit={handleAddBlockedDate} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="date"
                  required
                  value={blockDateInput}
                  onChange={(e) => setBlockDateInput(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 text-xs bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                />
                <input
                  type="text"
                  placeholder="Reason (e.g. Master Class, Festival Closure)"
                  value={blockReasonInput}
                  onChange={(e) => setBlockReasonInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 text-xs bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  Block Date
                </button>
              </form>

              <div className="divide-y divide-[#1E1B1E]/8 pt-2 text-xs font-sans">
                {blockedDates.map((b) => (
                  <div key={b.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#1E1B1E] font-numeric">{b.date}</span>
                      <span className="text-[#1E1B1E]/60 ml-2">({b.reason})</span>
                    </div>
                    <button
                      onClick={() => handleDeleteBlockedDate(b.id)}
                      className="px-3 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-full font-semibold transition-colors cursor-pointer"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Site Settings & Architecture Configuration */}
            <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-[#1E1B1E]/10 p-6 sm:p-8 space-y-6 text-xs font-sans shadow-xs">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1E1B1E]">Brand & Studio Architecture</h3>
                <p className="text-xs text-[#1E1B1E]/65">Customize studio contact details, verified Instagram handles, and booking rules</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Main Studio Name</label>
                  <input
                    type="text"
                    value={settingsForm.brandName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Dedicated Nails Studio Name</label>
                  <input
                    type="text"
                    value={settingsForm.nailsStudioName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, nailsStudioName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Founder / Master Artist Name</label>
                  <input
                    type="text"
                    value={settingsForm.ownerName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Brand Architecture Mode</label>
                  <select
                    value={settingsForm.brandArchitecture || 'dual'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandArchitecture: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                  >
                    <option value="dual">Dual Brand (Beautilicious by Ketna + Beautilicious Nails Studio)</option>
                    <option value="unified">Unified Single Brand Atelier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Main Instagram Profile URL</label>
                  <input
                    type="text"
                    value={settingsForm.instagramMain || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramMain: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Nails Studio Instagram Profile URL</label>
                  <input
                    type="text"
                    value={settingsForm.instagramNails || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramNails: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">WhatsApp Number (e.g. 919820154321)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Phone Display Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Cancellation & Rescheduling Policy</label>
                <textarea
                  rows={2}
                  value={settingsForm.cancellationPolicy || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, cancellationPolicy: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Seasonal Offer Announcement Text</label>
                <input
                  type="text"
                  value={settingsForm.seasonalOfferText || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, seasonalOfferText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  Save Settings & Update Site →
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* MODAL: Reschedule */}
      {rescheduleModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 max-w-md w-full rounded-3xl border border-[#1E1B1E]/10 shadow-2xl space-y-5 text-xs font-sans">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block mb-1">
                Concierge Rescheduling
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#1E1B1E]">
                Reschedule {rescheduleModalBooking.referenceNumber}
              </h4>
              <p className="text-[#1E1B1E]/70 mt-1">
                Client: <strong className="text-[#1E1B1E]">{rescheduleModalBooking.customerName}</strong> ({rescheduleModalBooking.serviceName})
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">New Date</label>
              <input
                type="date"
                value={newRescheduleDate}
                onChange={(e) => setNewRescheduleDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">New Time Slot</label>
              <select
                value={newRescheduleTime}
                onChange={(e) => setNewRescheduleTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
              >
                {['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleModalBooking(null)}
                className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#EEDCD7] border border-[#1E1B1E]/15 rounded-full text-xs font-semibold text-[#1E1B1E] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReschedule}
                className="px-6 py-2.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                Confirm Reschedule →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Service Form */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form onSubmit={handleSaveService} className="bg-white p-6 sm:p-8 max-w-lg w-full rounded-3xl border border-[#1E1B1E]/10 shadow-2xl space-y-4 text-xs font-sans max-h-[90vh] overflow-y-auto">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block mb-1">
                Atelier Service Catalog
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#1E1B1E]">
                {editingService ? 'Edit Atelier Service' : 'Add New Service'}
              </h4>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Service Name</label>
              <input
                type="text"
                required
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Category</label>
                <input
                  type="text"
                  required
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Studio Division</label>
                <select
                  value={serviceForm.studio}
                  onChange={(e) => setServiceForm({ ...serviceForm, studio: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                >
                  <option value="nails">Beautilicious Nails Studio</option>
                  <option value="beauty">Beautilicious Beauty</option>
                  <option value="both">Both / Atelier</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Price Type</label>
                <select
                  value={serviceForm.priceType}
                  onChange={(e) => setServiceForm({ ...serviceForm, priceType: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                >
                  <option value="fixed">Fixed</option>
                  <option value="starting_at">Starting At</option>
                  <option value="quote">Quote</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Duration (Mins)</label>
                <input
                  type="number"
                  required
                  value={serviceForm.durationMinutes}
                  onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Description</label>
              <textarea
                rows={3}
                required
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Image URL / Path</label>
              <input
                type="text"
                required
                value={serviceForm.image}
                onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
              />
            </div>

            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={serviceForm.featured}
                  onChange={(e) => setServiceForm({ ...serviceForm, featured: e.target.checked })}
                  className="rounded"
                />
                <span>Feature on Homepage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={serviceForm.active}
                  onChange={(e) => setServiceForm({ ...serviceForm, active: e.target.checked })}
                  className="rounded"
                />
                <span>Active for Booking</span>
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#1E1B1E]/10">
              <button
                type="button"
                onClick={() => setServiceModalOpen(false)}
                className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#EEDCD7] border border-[#1E1B1E]/15 rounded-full text-xs font-semibold text-[#1E1B1E] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                Save Service →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Gallery Item Form */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form onSubmit={handleSaveGalleryItem} className="bg-white p-6 sm:p-8 max-w-md w-full rounded-3xl border border-[#1E1B1E]/10 shadow-2xl space-y-4 text-xs font-sans">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block mb-1">
                Portfolio Exhibition
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#1E1B1E]">
                Add Artwork to Lookbook
              </h4>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Artwork Title</label>
              <input
                type="text"
                required
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Category</label>
                <input
                  type="text"
                  required
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Studio</label>
                <select
                  value={galleryForm.studio}
                  onChange={(e) => setGalleryForm({ ...galleryForm, studio: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
                >
                  <option value="nails">Nails Atelier</option>
                  <option value="beauty">Beauty & Skin</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Image URL</label>
              <input
                type="text"
                required
                value={galleryForm.imageUrl}
                onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Caption</label>
              <textarea
                rows={2}
                value={galleryForm.caption}
                onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setGalleryModalOpen(false)}
                className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#EEDCD7] border border-[#1E1B1E]/15 rounded-full text-xs font-semibold text-[#1E1B1E] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                Publish Artwork →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Change Password */}
      {pwModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form onSubmit={handleChangePassword} className="bg-white p-6 sm:p-8 max-w-sm w-full rounded-3xl border border-[#1E1B1E]/10 shadow-2xl space-y-4 text-xs font-sans">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block mb-1">
                Portal Credentials
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#1E1B1E]">Update Admin Password</h4>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">Current Password</label>
              <input
                type="password"
                required
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1B1E]">New Password (Min 6 chars)</label>
              <input
                type="password"
                required
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E1B1E]/15 bg-[#FAF7F2] text-[#1E1B1E] focus:outline-none focus:border-[#1E1B1E]"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPwModalOpen(false)}
                className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#EEDCD7] border border-[#1E1B1E]/15 rounded-full text-xs font-semibold text-[#1E1B1E] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                Update Password →
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
