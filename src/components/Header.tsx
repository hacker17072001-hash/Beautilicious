import React, { useState } from 'react';
import { Menu, X, Instagram, Phone, Calendar } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenBooking: (serviceId?: string) => void;
  settings: SiteSettings | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenBooking,
  settings,
}) => {
  const [topBannerDismissed, setTopBannerDismissed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandTitle = 'Beautilicious by Ketna';
  const studioSubtitle = 'NAIL & BEAUTY STUDIO';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md transition-colors">
      {/* Top Black Announcement Bar */}
      {!topBannerDismissed && (
        <aside aria-label="Announcement" className="bg-[#171417] text-[#FAF7F2] text-xs px-4 py-2 text-center font-sans">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center justify-center gap-2.5 text-[11px] sm:text-xs">
              <span className="text-[#C4AB83]">✦</span>
              <span className="text-white/90">For modern salon appointments & bespoke nail design contact us</span>
              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-1.5 ml-2 px-3 py-1 bg-white text-[#171417] rounded-full text-[10px] font-bold tracking-wide uppercase hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <span>Get a Free Quote</span>
                <span>→</span>
              </button>
            </div>
            <button
              onClick={() => setTopBannerDismissed(true)}
              className="text-white/60 hover:text-white p-1 cursor-pointer"
              aria-label="Close Announcement"
            >
              <X size={14} />
            </button>
          </div>
        </aside>
      )}

      {/* Main Navigation Bar */}
      <div className="border-b border-[#292429]/10 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="text-left group cursor-pointer focus-visible:outline-none flex flex-col items-start"
          >
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#1E1B1E] group-hover:text-[#8D6B78] transition-colors leading-none">
              Beautilicious <span className="italic font-normal text-[#8D6B78]">by Ketna</span>
            </span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-[#1E1B1E]/60 mt-1">
              {studioSubtitle}
            </span>
          </button>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-[#1E1B1E]/80">
            {navItems.map((item) => {
              const isActive = (currentTab === item.id) || (currentTab === 'nails' && item.id === 'services') || (currentTab === 'portfolio' && item.id === 'gallery') || (currentTab === 'story' && item.id === 'about');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'gallery') onNavigate('portfolio');
                    else if (item.id === 'about') onNavigate('story');
                    else onNavigate(item.id);
                  }}
                  className={`relative py-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#1E1B1E] font-bold'
                      : 'hover:text-[#1E1B1E]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E1B1E] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area: Search + Pill Booking Button */}
          <div className="hidden sm:flex items-center gap-5 shrink-0">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="text-[#1E1B1E]/80 hover:text-[#1E1B1E] p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              onClick={() => onOpenBooking()}
              className="px-5 py-2.5 text-xs font-semibold tracking-wide bg-[#171417] text-white hover:bg-black rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <span>Book Appointment</span>
              <span>→</span>
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenBooking()}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#171417] text-white rounded-full"
            >
              Book →
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 text-[#1E1B1E]"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#292429]/10 bg-white px-6 py-3 animate-fadeIn">
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search manicure, gel extensions, nail art, bridal specials..."
                className="w-full text-xs text-[#1E1B1E] focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-gray-400 hover:text-black cursor-pointer"
              >
                Esc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#292429]/10 px-6 py-6 transition-all animate-fadeIn">
          <nav className="flex flex-col gap-4 text-base font-serif">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 border-b border-[#292429]/5 transition-colors ${
                  currentTab === item.id ? 'text-[#8D6B78] font-bold' : 'text-[#292429]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t border-[#292429]/10 flex flex-col gap-3">
            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center text-xs tracking-widest uppercase bg-[#292429] text-[#FAF7F2]"
            >
              Reserve Atelier Slot
            </button>
            <div className="flex items-center justify-around pt-3 text-xs text-[#292429]/70">
              <a
                href={settings?.instagramMain || 'https://www.instagram.com/_beautilicious_by_ketna_/'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#292429]"
              >
                <Instagram size={14} /> @beautilicious
              </a>
              <a
                href={`tel:${settings?.phone || '+14158905241'}`}
                className="flex items-center gap-1.5 hover:text-[#292429]"
              >
                <Phone size={14} /> Call Studio
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
