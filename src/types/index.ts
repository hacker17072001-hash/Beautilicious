export type StudioType = 'nails' | 'beauty' | 'both';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ServiceVariant {
  name: string;
  price: number;
  duration: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  studio: StudioType;
  description: string;
  priceType: 'fixed' | 'starting_at' | 'quote';
  price: number;
  currency: string;
  durationMinutes: number;
  image: string;
  featured: boolean;
  order: number;
  active: boolean;
  packageVariants?: ServiceVariant[];
}

export interface Category {
  id: string;
  name: string;
  studio: StudioType;
  description: string;
  order: number;
}

export interface Booking {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  category: string;
  studio: StudioType;
  artist: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:00 AM"
  durationMinutes: number;
  priceEstimate: string;
  specialRequests?: string;
  referenceImageUrl?: string;
  status: BookingStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  studio: StudioType;
  imageUrl: string;
  caption: string;
  featured: boolean;
  order: number;
  likesCount?: number;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContact: 'whatsapp' | 'email' | 'phone';
  status: 'new' | 'in_progress' | 'replied' | 'archived';
  createdAt: string;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason: string;
  allDay: boolean;
  blockedSlots?: string[];
}

export interface WorkingDay {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface SiteSettings {
  brandName: string;
  nailsStudioName: string;
  ownerName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  googleMapsEmbed: string;
  instagramMain: string;
  instagramNails: string;
  openingHours: WorkingDay[];
  brandArchitecture: 'unified' | 'dual';
  bookingApprovalMode: 'owner_approval' | 'auto_confirm';
  cancellationPolicy: string;
  seoTitle: string;
  seoDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  noticeBanner?: string;
  enableOffers: boolean;
  seasonalOfferText?: string;
}

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  upcomingCount: number;
  totalInquiries: number;
  newInquiries: number;
  totalServices: number;
  totalGalleryItems: number;
  estimatedRevenue: number;
}
