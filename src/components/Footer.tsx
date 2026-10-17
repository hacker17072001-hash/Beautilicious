import React from 'react';
import { Instagram, Facebook, Youtube, ShieldCheck, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings | null;
  onNavigate: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenBooking }) => {
  const brandName = 'Beautilicious by Ketna';
  const phone = settings?.phone || '+91 98201 54321';
  const email = settings?.email || 'hello@naile.in';
  const address = settings?.address || 'SCO 12, VIP Road, Ring Road, Jalgaon, Maharashtra';

  return (
    <footer className="bg-[#FAF7F2] text-[#1E1B1E] pt-16 pb-12 border-t border-[#1E1B1E]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-[#1E1B1E]/10">
          {/* Col 1: Brand & Socials (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-left group cursor-pointer focus-visible:outline-none flex flex-col items-start"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B1E]">
                Beautilicious <span className="italic font-normal text-[#8D6B78]">by Ketna</span>
              </span>
              <span className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-[#1E1B1E]/60 mt-0.5">
                NAIL & BEAUTY STUDIO
              </span>
            </button>
            <p className="text-xs text-[#1E1B1E]/75 font-sans">
              Polished looks. Happier you.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-[#1E1B1E]/80">
              <a
                href="https://www.instagram.com/_beautilicious_nails_studio__/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-[#1E1B1E]/20 flex items-center justify-center hover:bg-[#1E1B1E] hover:text-white transition-colors"
              >
                <Instagram size={14} />
              </a>
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-[#1E1B1E]/20 flex items-center justify-center hover:bg-[#1E1B1E] hover:text-white transition-colors"
              >
                <Facebook size={14} />
              </a>
              <a
                href="#pinterest"
                aria-label="Pinterest"
                className="w-8 h-8 rounded-full border border-[#1E1B1E]/20 flex items-center justify-center hover:bg-[#1E1B1E] hover:text-white transition-colors"
              >
                <span className="text-xs font-serif font-bold">P</span>
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full border border-[#1E1B1E]/20 flex items-center justify-center hover:bg-[#1E1B1E] hover:text-white transition-colors"
              >
                <Youtube size={14} />
              </a>
              <a
                href="#tiktok"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full border border-[#1E1B1E]/20 flex items-center justify-center hover:bg-[#1E1B1E] hover:text-white transition-colors"
              >
                <span className="text-xs font-bold">♪</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1E]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#1E1B1E]/75">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-black transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-black transition-colors cursor-pointer">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-black transition-colors cursor-pointer">
                  Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('story')} className="hover:text-black transition-colors cursor-pointer">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('story')} className="hover:text-black transition-colors cursor-pointer">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-black transition-colors cursor-pointer">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Our Services (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1E]">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs text-[#1E1B1E]/75">
              <li>
                <button onClick={() => { onNavigate('services'); onOpenBooking(); }} className="hover:text-black transition-colors cursor-pointer">
                  Manicure
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('services'); onOpenBooking(); }} className="hover:text-black transition-colors cursor-pointer">
                  Pedicure
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('services'); onOpenBooking(); }} className="hover:text-black transition-colors cursor-pointer">
                  Nail Extensions
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('services'); onOpenBooking(); }} className="hover:text-black transition-colors cursor-pointer">
                  Nail Art
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('services'); onOpenBooking(); }} className="hover:text-black transition-colors cursor-pointer">
                  Gel Polish
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('services'); onOpenBooking(); }} className="hover:text-black transition-colors cursor-pointer">
                  Nail Spa
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Us + Handwritten Sticker (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1E]">
                Contact Us
              </h4>
              <div className="space-y-2 text-xs text-[#1E1B1E]/75">
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="shrink-0 mt-0.5 text-[#1E1B1E]" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} className="shrink-0 text-[#1E1B1E]" />
                  <a href={`tel:${phone}`} className="hover:text-black">{phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="shrink-0 text-[#1E1B1E]" />
                  <a href={`mailto:${email}`} className="hover:text-black">{email}</a>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <Clock size={13} className="shrink-0 mt-0.5 text-[#1E1B1E]" />
                  <div>
                    <p>Mon – Sat: 10 AM – 8 PM</p>
                    <p>Sun: 11 AM – 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Handwritten script sticker */}
            <div className="pt-4 self-end flex items-center justify-end text-right">
              <div className="font-script text-2xl sm:text-3xl text-[#1E1B1E]/80 leading-snug -rotate-3 select-none">
                <p>Good</p>
                <p>Nails</p>
                <p>Brighter</p>
                <p>Days ♡</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#1E1B1E]/60">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <span>|</span>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <span>|</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-[#8D6B78] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck size={12} />
              <span>Studio Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
