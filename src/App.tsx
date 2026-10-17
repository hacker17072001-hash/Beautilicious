/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { LightboxModal } from './components/LightboxModal';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { NailStudioPage } from './pages/NailStudioPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { StoryPage } from './pages/StoryPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Service, GalleryItem, Category, SiteSettings } from './types';
import { getServices, getGallery, getCategories, getSettings } from './lib/api';
import { Phone, Calendar } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>(undefined);

  // Lightbox modal
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  // Check URL pathname or hash for navigation
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.toLowerCase();
      if (path.endsWith('/admin') || hash === '#admin') {
        setCurrentTab('admin');
      } else if (hash === '#services') {
        setCurrentTab('services');
      } else if (hash === '#nails') {
        setCurrentTab('nails');
      } else if (hash === '#portfolio' || hash === '#gallery') {
        setCurrentTab('portfolio');
      } else if (hash === '#story' || hash === '#about' || hash === '#blog') {
        setCurrentTab('story');
      } else if (hash === '#contact') {
        setCurrentTab('contact');
      } else if (hash === '#home' || hash === '') {
        setCurrentTab('home');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  const loadData = async () => {
    try {
      const [sData, gData, cData, settsData] = await Promise.all([
        getServices(),
        getGallery(),
        getCategories(),
        getSettings()
      ]);
      setServices(sData);
      setGallery(gData);
      setCategories(cData);
      setSettings(settsData);
    } catch (err) {
      console.error('Failed to load initial studio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'home') {
      // Remove hash without wiping the repository subpath on GitHub Pages
      if (window.history.pushState) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = '';
      }
    } else {
      window.location.hash = `#${tab}`;
    }
  };

  const handleOpenBooking = (serviceId?: string) => {
    setPreSelectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  if (currentTab === 'admin') {
    return (
      <AdminDashboard
        onBackToSite={() => handleNavigate('home')}
        onRefreshPublicData={loadData}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#292429]">
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
        settings={settings}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            services={services}
            gallery={gallery}
            settings={settings}
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
            onOpenLightbox={(item) => setActiveLightboxItem(item)}
          />
        )}

        {currentTab === 'services' && (
          <ServicesPage
            services={services}
            categories={categories}
            settings={settings}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentTab === 'nails' && (
          <NailStudioPage
            gallery={gallery}
            services={services}
            settings={settings}
            onOpenBooking={handleOpenBooking}
            onOpenLightbox={(item) => setActiveLightboxItem(item)}
          />
        )}

        {currentTab === 'portfolio' && (
          <PortfolioPage
            gallery={gallery}
            settings={settings}
            onOpenLightbox={(item) => setActiveLightboxItem(item)}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentTab === 'story' && (
          <StoryPage
            settings={settings}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage
            settings={settings}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}
      </main>

      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Mobile Sticky Quick Booking Bar (≤ 15% mobile viewport cap) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#292429]/15 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <a
          href={`https://wa.me/${settings?.whatsappNumber || '14158905241'}?text=Hi%20Ketna,%20I%20would%20like%20to%20inquire%20about%20booking%20at%20Beautilicious.`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2 text-center text-[11px] uppercase tracking-wider text-[#292429] border border-[#292429]/25 bg-white flex items-center justify-center gap-1.5"
        >
          <Phone size={12} />
          <span>WhatsApp</span>
        </a>
        <button
          onClick={() => handleOpenBooking()}
          className="flex-1 py-2 text-center text-[11px] uppercase tracking-wider text-[#FAF7F2] bg-[#292429] font-medium flex items-center justify-center gap-1.5"
        >
          <Calendar size={12} />
          <span>Book Now</span>
        </button>
      </div>

      {/* Appointment Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        services={services}
        preSelectedServiceId={preSelectedServiceId}
        settings={settings}
      />

      {/* Lightbox Modal */}
      <LightboxModal
        item={activeLightboxItem}
        onClose={() => setActiveLightboxItem(null)}
        onBookInspired={() => handleOpenBooking()}
        settings={settings}
      />
    </div>
  );
}
