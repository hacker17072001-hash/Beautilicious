import React, { useState } from 'react';
import { Clock, Phone, Sparkles, Check, ArrowRight, Gem, Heart, ShieldCheck } from 'lucide-react';
import { ASSET_IMAGES } from '../assets/images';
import { Service, Category, SiteSettings } from '../types';

interface ServicesPageProps {
  services: Service[];
  categories: Category[];
  settings: SiteSettings | null;
  onOpenBooking: (serviceId?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  categories,
  settings,
  onOpenBooking
}) => {
  const [selectedStudio, setSelectedStudio] = useState<'all' | 'nails' | 'beauty'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter services
  const filteredServices = services.filter((srv) => {
    if (!srv.active) return false;
    if (selectedStudio !== 'all' && srv.studio !== selectedStudio && srv.studio !== 'both') {
      return false;
    }
    if (selectedCategory !== 'all' && srv.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  // Unique categories for active studio selection
  const relevantCategories = categories.filter((cat) => {
    if (selectedStudio === 'all') return true;
    return cat.studio === selectedStudio || cat.studio === 'both';
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 space-y-16">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#8D6B78] font-semibold block">
          Curated Treatment Menu
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#292429]">
          Couture Services & <span className="italic">Rituals</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#292429]/75 leading-relaxed font-sans">
          Every treatment is an intentional ritual performed with precision tools, medical autoclave sterilization, and premium Japanese and European cosmetic formulas.
        </p>
      </div>

      {/* Filter Bar: Studio Division & Categories */}
      <div className="space-y-6 pt-4 border-t border-[#1E1B1E]/10">
        {/* Studio Division Segmented Control */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-[#1E1B1E]/60 mr-2 font-medium">
            Category:
          </span>
          {[
            { id: 'all', label: 'All Offerings' },
            { id: 'nails', label: 'Beautilicious Nails Studio' },
            { id: 'beauty', label: 'Beautilicious Beauty & Skin' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedStudio(tab.id as any);
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-full uppercase tracking-wider transition-all cursor-pointer ${
                selectedStudio === tab.id
                  ? 'bg-[#171417] text-white shadow-xs'
                  : 'bg-white text-[#1E1B1E] border border-[#1E1B1E]/15 hover:border-[#1E1B1E]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Filter Pills (Functional Buttons) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 text-xs rounded-full transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#EEDCD7] text-[#1E1B1E] font-bold shadow-xs'
                : 'bg-white text-[#1E1B1E]/70 border border-[#1E1B1E]/10 hover:border-[#1E1B1E]/30'
            }`}
          >
            All Categories ({filteredServices.length})
          </button>
          {relevantCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 text-xs rounded-full transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-[#EEDCD7] text-[#1E1B1E] font-bold shadow-xs'
                  : 'bg-white text-[#1E1B1E]/70 border border-[#1E1B1E]/10 hover:border-[#1E1B1E]/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#1E1B1E]/10 text-xs text-[#1E1B1E]/60">
          No services currently published under this category filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="p-8 bg-white rounded-2xl border border-[#1E1B1E]/10 flex flex-col justify-between space-y-6 hover:shadow-md transition-all shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#8D6B78] font-bold block">
                      {srv.category}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#1E1B1E]">{srv.name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-numeric text-xl md:text-2xl font-bold text-[#1E1B1E]">
                      {srv.priceType === 'starting_at' && <span className="text-xs font-normal">from </span>}
                      {srv.priceType === 'quote' ? 'Custom Quote' : `${srv.currency}${srv.price}`}
                    </span>
                    <span className="flex items-center justify-end gap-1 text-[11px] font-numeric text-[#1E1B1E]/60 mt-0.5">
                      <Clock size={12} /> {srv.durationMinutes} min
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#1E1B1E]/75 leading-relaxed font-sans">
                  {srv.description}
                </p>

                {/* Package variants if any */}
                {srv.packageVariants && srv.packageVariants.length > 0 && (
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#1E1B1E]/8 space-y-2 text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block">
                      Tier & Complexity Options
                    </span>
                    {srv.packageVariants.map((variant, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px] text-[#1E1B1E]/80">
                        <span>• {variant.name} ({variant.duration}m)</span>
                        <span className="font-numeric font-bold">{srv.currency}{variant.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#1E1B1E]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={() => onOpenBooking(srv.id)}
                  className="px-6 py-2.5 bg-[#171417] text-white text-xs font-semibold rounded-full hover:bg-black transition-colors text-center cursor-pointer shadow-xs"
                >
                  Book Service →
                </button>

                <a
                  href={`https://wa.me/${settings?.whatsappNumber || '919820154321'}?text=Hi%20Ketna,%20I%20have%20a%20question%20regarding%20${encodeURIComponent(srv.name)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-[#8D6B78] hover:text-[#1E1B1E] transition-colors py-1"
                >
                  <Phone size={13} />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Atelier Consultation Note - Redesigned with round corners for everything */}
      <div className="bg-[#EEDCD7] rounded-[2.5rem] p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-sm border border-[#1E1B1E]/10">
        {/* Decorative soft blurred circles for luxury depth */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#FAF7F2]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, tags, info, and rounded buttons */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 shadow-xs border border-[#1E1B1E]/10">
              <Sparkles size={13} className="text-[#8D6B78]" />
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#1E1B1E]">
                Bespoke Bridal & Custom Artistry
              </span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E1B1E] leading-[1.12]">
              Looking for Bespoke Nail Art or Bridal Styling?
            </h3>

            <p className="text-xs sm:text-sm text-[#1E1B1E]/75 leading-relaxed font-sans font-light max-w-xl">
              Have a Pinterest moodboard, bridal palette, or runway reference you adore? Send your inspiration directly to our studio concierge. Ketna and our senior artists custom-sculpt every apex curve, intricate hand-painted artwork, and color blend right here in our Jalgaon atelier.
            </p>

            {/* 3 Rounded Feature Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-[#1E1B1E]/8 space-y-1.5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#1E1B1E]">
                  <Gem size={14} />
                </div>
                <h4 className="text-xs font-bold text-[#1E1B1E]">Moodboard Review</h4>
                <p className="text-[11px] text-[#1E1B1E]/65 leading-snug">Share runway swatches or Instagram links</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-[#1E1B1E]/8 space-y-1.5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#1E1B1E]">
                  <ShieldCheck size={14} />
                </div>
                <h4 className="text-xs font-bold text-[#1E1B1E]">Safe Japanese Gel</h4>
                <p className="text-[11px] text-[#1E1B1E]/65 leading-snug">Zero harsh acids, medical autoclave care</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-[#1E1B1E]/8 space-y-1.5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#1E1B1E]">
                  <Heart size={14} />
                </div>
                <h4 className="text-xs font-bold text-[#1E1B1E]">Private 1-on-1</h4>
                <p className="text-[11px] text-[#1E1B1E]/65 leading-snug">Undivided artist focus in our Jalgaon studio</p>
              </div>
            </div>

            {/* Rounded Pill Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '919820154321'}?text=Hi%20Ketna,%20I%20have%20a%20custom%20nail%20art%20inquiry%20and%20moodboard.`}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 shadow-sm active:scale-[0.98]"
              >
                <Phone size={14} />
                <span>Share Moodboard on WhatsApp</span>
                <span>→</span>
              </a>

              <button
                onClick={() => onOpenBooking()}
                className="px-6 py-3.5 bg-white text-[#1E1B1E] hover:bg-white/90 border border-[#1E1B1E]/15 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Book Consultation</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Circular & Rounded Visual Elements with Cursive Sticker */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
            {/* Handwritten Script Sticker */}
            <div className="absolute -top-6 right-2 sm:-top-8 sm:right-6 select-none pointer-events-none text-right z-20">
              <div className="font-script text-3xl sm:text-4xl text-[#1E1B1E] leading-tight rotate-6">
                <p>Bespoke</p>
                <p>Nails</p>
                <p>Just For</p>
                <p>You ♡</p>
              </div>
            </div>

            {/* Main Rounded Circular Photo */}
            <div className="relative">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                <img
                  src={ASSET_IMAGES.heroFloralNails}
                  alt="Bespoke luxury nail art"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating secondary circular thumbnail */}
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                <img
                  src={ASSET_IMAGES.polishDripping}
                  alt="Luxury cosmetic polish"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating aesthetic pill badge */}
              <div className="absolute -bottom-2 right-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#1E1B1E]/10 shadow-sm text-[10px] font-sans font-bold text-[#1E1B1E]">
                ✨ Jalgaon Atelier
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
