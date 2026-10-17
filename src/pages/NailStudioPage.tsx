import React, { useState } from 'react';
import { Instagram, Sparkles, Check, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { GalleryItem, Service, SiteSettings } from '../types';
import { ASSET_IMAGES } from '../assets/images';

interface NailStudioPageProps {
  gallery: GalleryItem[];
  services: Service[];
  settings: SiteSettings | null;
  onOpenBooking: (serviceId?: string) => void;
  onOpenLightbox: (item: GalleryItem) => void;
}

export const NailStudioPage: React.FC<NailStudioPageProps> = ({
  gallery,
  services,
  settings,
  onOpenBooking,
  onOpenLightbox
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const nailServices = services.filter((s) => s.studio === 'nails' || s.studio === 'both');
  const nailGallery = gallery.filter((g) => g.studio === 'nails' || g.studio === 'both');

  const filteredGallery = nailGallery.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="space-y-20 md:space-y-28 pb-20">
      {/* SECTION 1: NAIL STUDIO HERO */}
      <section className="pt-8 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#8D6B78] font-semibold">
                Dedicated Atelier Sub-Experience
              </span>
              <span className="text-[#292429]/30">·</span>
              <a
                href={settings?.instagramNails || 'https://www.instagram.com/_beautilicious_nails_studio__/'}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#8D6B78] hover:underline flex items-center gap-1"
              >
                <Instagram size={13} /> @_beautilicious_nails_studio__
              </a>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#292429] leading-tight">
              Bespoke Nail Artistry & <span className="italic font-normal text-[#8D6B78]">Architectural</span> Form.
            </h1>

            <p className="text-xs sm:text-sm text-[#292429]/75 max-w-xl leading-relaxed font-sans">
              Beautilicious Nails Studio is devoted to elevating nail care to high couture. We eliminate aggressive drill scraping in favor of delicate Russian e-file cuticle conditioning, structural apex sculpting, and hand-finished artistry.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="px-7 py-3.5 bg-[#171417] text-white rounded-full text-xs font-semibold tracking-wide hover:bg-black transition-colors cursor-pointer shadow-xs"
              >
                Book Nail Appointment →
              </button>
              <a
                href={settings?.instagramNails || 'https://www.instagram.com/_beautilicious_nails_studio__/'}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 border border-[#1E1B1E]/20 rounded-full text-[#1E1B1E] text-xs font-semibold tracking-wide hover:bg-black/5 transition-colors flex items-center gap-2"
              >
                <Instagram size={14} />
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-[#1E1B1E]/10 bg-[#FAF7F2]">
              <img
                src={ASSET_IMAGES.nailArt}
                alt="Bespoke couture chrome french manicure"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ARCHITECTURE & SHAPE GUIDE */}
      <section className="bg-white rounded-3xl border border-[#1E1B1E]/10 py-16 px-6 md:px-10 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#8D6B78] block">
              PRECISION GEOMETRY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1E]">
              Signature Nail <span className="italic font-normal text-[#8D6B78]">Silhouettes</span>
            </h2>
            <p className="text-xs text-[#1E1B1E]/70 font-sans">
              Each shape is customized to harmonize with natural finger structure and personal lifestyle demands.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                name: 'Russian Tapered Almond',
                description: 'The golden standard of elegance. Elongates the fingers with sleek graceful curves.'
              },
              {
                name: 'Sculpted Soft Square',
                description: 'Clean crisp parallel sidewalls with micro-beveled corners for timeless strength.'
              },
              {
                name: 'Couture Coffin / Ballerina',
                description: 'Dramatic architectural lines tapering evenly into a sharp, straight transverse edge.'
              },
              {
                name: 'Natural Classic Oval',
                description: 'Understated organic silhouette preserving maximum natural plate reinforcement.'
              }
            ].map((shape, idx) => (
              <div key={idx} className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#1E1B1E]/8 space-y-2 hover:border-[#1E1B1E]/20 transition-all">
                <span className="text-[10px] text-[#8D6B78] font-bold block uppercase tracking-widest">
                  Style 0{idx + 1}
                </span>
                <h4 className="font-serif text-lg font-bold text-[#1E1B1E]">{shape.name}</h4>
                <p className="text-xs text-[#1E1B1E]/70 leading-relaxed font-sans">{shape.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: NAIL ART GALLERY WITH LIGHTBOX */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8D6B78] font-semibold block">
              Lookbook
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#292429]">
              Couture <span className="italic">Showcase</span>
            </h2>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap gap-2 text-xs">
            {['all', 'chrome', 'couture', 'care'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 uppercase rounded-full tracking-wider transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-[#171417] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#1E1B1E] border border-[#1E1B1E]/15 hover:border-[#1E1B1E]/40'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenLightbox(item)}
              className="group bg-white rounded-2xl border border-[#1E1B1E]/10 overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <div className="aspect-square overflow-hidden bg-[#E6D5D3]/20 relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block">
                  {item.category}
                </span>
                <h4 className="font-serif text-base font-bold text-[#1E1B1E]">{item.title}</h4>
                <p className="text-xs text-[#1E1B1E]/65 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: NAIL CARE & AFTERCARE PROTOCOL */}
      <section className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="p-8 md:p-12 bg-[#171417] text-[#FAF7F2] rounded-3xl space-y-8 shadow-md">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C4AB83] font-semibold block">
              Atelier Longevity Protocol
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-[#FAF7F2]">
              Preserving Your <span className="italic text-[#C4AB83]">Couture Set</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/75 max-w-xl font-light">
              Follow these master-approved guidelines to preserve edge luster, prevent lifting, and nourish the natural matrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-[#FAF7F2]/15 text-xs text-[#FAF7F2]/85">
            <div className="space-y-2">
              <span className="text-base text-[#C4AB83] font-semibold block">
                <span className="font-numeric font-bold mr-1">01.</span> Daily Hydration
              </span>
              <p className="leading-relaxed text-[#FAF7F2]/70">
                Apply cold-pressed jojoba or almond cuticle oil twice daily. Hydrated keratin retains elasticity and resists structural fracture.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-base text-[#C4AB83] font-semibold block">
                <span className="font-numeric font-bold mr-1">02.</span> No Mechanical Tools
              </span>
              <p className="leading-relaxed text-[#FAF7F2]/70">
                Never use nail enhancements to pry, unbox, or tap aggressively. Treat nails as delicate jewels, not utility implements.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-base text-[#C4AB83] font-semibold block">
                <span className="font-numeric font-bold mr-1">03.</span> 3–4 Week Rebalance
              </span>
              <p className="leading-relaxed text-[#FAF7F2]/70">
                Schedule your refill or soak-off between days 21 and 28. Overgrown apexes shift leverage to the tip and compromise nail beds.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#FAF7F2]/60">
              Questions regarding existing nails or safe soak-offs? Message the studio.
            </p>
            <button
              onClick={() => onOpenBooking()}
              className="px-7 py-3.5 bg-[#FAF7F2] text-[#1E1B1E] hover:bg-[#EEDCD7] rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              Reserve Refill or New Set →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
