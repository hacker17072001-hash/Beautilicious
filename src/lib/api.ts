import {
  Booking,
  GalleryItem,
  Service,
  Category,
  SiteSettings,
  Inquiry,
  BlockedDate,
  AdminStats
} from '../types';

const TOKEN_KEY = 'beautilicious_admin_token';
const USER_KEY = 'beautilicious_admin_user';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(token: string, user: any) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthUser(): any | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const data = await response.json();
      if (data && data.error) errMessage = data.error;
    } catch {
      // ignore
    }
    throw new Error(errMessage);
  }

  return response.json();
}

// Site Settings
export async function getSettings(): Promise<SiteSettings> {
  return request<SiteSettings>('/settings');
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings }> {
  return request('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
}

// Services
export async function getServices(params?: { studio?: string; category?: string; activeOnly?: boolean }): Promise<Service[]> {
  const query = new URLSearchParams();
  if (params?.studio) query.set('studio', params.studio);
  if (params?.category) query.set('category', params.category);
  if (params?.activeOnly) query.set('activeOnly', 'true');
  return request<Service[]>(`/services?${query.toString()}`);
}

export async function createService(data: Partial<Service>): Promise<Service> {
  return request<Service>('/services', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  return request<Service>(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteService(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/services/${id}`, {
    method: 'DELETE'
  });
}

// Categories
export async function getCategories(): Promise<Category[]> {
  return request<Category[]>('/categories');
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  return request<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Gallery
export async function getGallery(params?: { studio?: string; category?: string; featuredOnly?: boolean }): Promise<GalleryItem[]> {
  const query = new URLSearchParams();
  if (params?.studio) query.set('studio', params.studio);
  if (params?.category) query.set('category', params.category);
  if (params?.featuredOnly) query.set('featuredOnly', 'true');
  return request<GalleryItem[]>(`/gallery?${query.toString()}`);
}

export async function createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
  return request<GalleryItem>('/gallery', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<GalleryItem> {
  return request<GalleryItem>(`/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteGalleryItem(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/gallery/${id}`, {
    method: 'DELETE'
  });
}

// Bookings
export async function checkAvailability(date: string, timeSlot: string, artist?: string): Promise<{ available: boolean; reason?: string | null }> {
  const query = new URLSearchParams({ date, timeSlot });
  if (artist) query.set('artist', artist);
  return request(`/bookings/check-availability?${query.toString()}`);
}

export async function createBooking(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  artist?: string;
  specialRequests?: string;
  referenceImageUrl?: string;
}): Promise<{ success: boolean; booking: Booking; message: string }> {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getBookings(params?: { status?: string; date?: string; search?: string }): Promise<Booking[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.date) query.set('date', params.date);
  if (params?.search) query.set('search', params.search);
  return request<Booking[]>(`/bookings?${query.toString()}`);
}

export async function updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
  return request<Booking>(`/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function deleteBooking(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/bookings/${id}`, {
    method: 'DELETE'
  });
}

// Inquiries
export async function createInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  preferredContact?: 'whatsapp' | 'email' | 'phone';
}): Promise<{ success: boolean; inquiry: Inquiry }> {
  return request('/inquiries', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getInquiries(): Promise<Inquiry[]> {
  return request<Inquiry[]>('/inquiries');
}

export async function updateInquiry(id: string, data: Partial<Inquiry>): Promise<Inquiry> {
  return request<Inquiry>(`/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

// Blocked Dates
export async function getBlockedDates(): Promise<BlockedDate[]> {
  return request<BlockedDate[]>('/blocked-dates');
}

export async function addBlockedDate(data: { date: string; reason: string; allDay?: boolean }): Promise<BlockedDate> {
  return request<BlockedDate>('/blocked-dates', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deleteBlockedDate(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/blocked-dates/${id}`, {
    method: 'DELETE'
  });
}

// Stats
export async function getStats(): Promise<AdminStats> {
  return request<AdminStats>('/stats');
}

// Auth
export async function loginAdmin(username: string, password: string): Promise<{ token: string; user: any }> {
  const res = await request<{ token: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  setAuthSession(res.token, res.user);
  return res;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await request('/auth/logout', { method: 'POST' });
  } finally {
    clearAuthSession();
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  return request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}
