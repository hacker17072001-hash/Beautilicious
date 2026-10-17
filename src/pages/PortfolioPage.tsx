import React, { useState } from 'react';
import { GalleryItem, SiteSettings } from '../types';
import { Eye, ArrowRight, Instagram } from 'lucide-react';

interface PortfolioPageProps {
  gallery: GalleryItem[];
  settings: SiteSettings | null;
  onOpenLightbox: (item: GalleryItem) => void;
  onOpenBooking: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  gallery,
  settings,
  onOpenLightbox,
  onOpenBooking
}) => {
  const [selectedStudio, setSelectedStudio] = useState<'all' | 'nails' | 'beauty'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories present in gallery
  const categories = Array.from(new Set(gallery.map((g) => g.category)));

  const filteredItems = gallery.filter((item) => {
    if (selectedStudio !== 'all' && item.studio !== selectedStudio && item.studio !== 'both') {
      return false;
    }
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 space-y-12">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#1E1B1E]/60 block">
          EDITORIAL LOOKBOOK
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E1B1E]">
          Nail Art That Speaks
        </h1>
        <p className="text-xs sm:text-sm text-[#1E1B1E]/75 font-sans leading-relaxed">
          A curated exhibition of bespoke nail artistry, precision cuticle detailing, and dewy aesthetic glow treatments performed at our Jalgaon studio.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-4 pt-4 border-t border-[#1E1B1E]/10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-[#1E1B1E]/60 font-medium">Studio:</span>
          {[
            { id: 'all', label: 'All Portfolio' },
            { id: 'nails', label: 'Nails Atelier' },
            { id: 'beauty', label: 'Beauty & Skin' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStudio(tab.id as any)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wider transition-all cursor-pointer ${
                selectedStudio === tab.id
                  ? 'bg-[#171417] text-white shadow-xs'
                  : 'bg-white text-[#1E1B1E] border border-[#1E1B1E]/15 hover:border-[#1E1B1E]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs cursor-pointer ${
              selectedCategory === 'all'
                ? 'border-b-2 border-[#8D6B78] font-bold text-[#292429]'
                : 'text-[#292429]/60 hover:text-[#292429]'
            }`}
          >
            All Work ({gallery.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs cursor-pointer ${
                selectedCategory === cat
                  ? 'border-b-2 border-[#8D6B78] font-bold text-[#292429]'
                  : 'text-[#292429]/60 hover:text-[#292429]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#292429]/10 text-xs text-[#292429]/60">
          No portfolio pieces found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenLightbox(item)}
              className="group bg-white rounded-2xl border border-[#1E1B1E]/10 overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-4/3 overflow-hidden bg-[#FAF7F2] relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <span className="px-4 py-2 bg-black/80 backdrop-blur-sm text-xs font-semibold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <Eye size={13} /> View Detail
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#8D6B78] font-medium uppercase tracking-wider">
                    <span>{item.category}</span>
                    <span className="text-[#292429]/40">{item.studio === 'nails' ? 'Nails Studio' : item.studio === 'beauty' ? 'Beauty Studio' : 'Both'}</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#292429] mt-1">{item.title}</h3>
                  <p className="text-xs text-[#292429]/70 line-clamp-2 mt-1 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Social Links Banner */}
      <div className="p-8 sm:p-10 bg-[#EEDCD7] rounded-3xl border border-[#1E1B1E]/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <h4 className="font-serif text-2xl font-bold text-[#1E1B1E]">
            Explore Our Daily Instagram Chronicles
          </h4>
          <p className="text-xs text-[#1E1B1E]/70 font-sans">
            Fresh runway interpretations, before & after cuticle restorations, and behind-the-scenes artistry in Jalgaon.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={settings?.instagramMain || 'https://www.instagram.com/_beautilicious_by_ketna_/'}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-white border border-[#1E1B1E]/15 rounded-full text-xs font-semibold text-[#1E1B1E] hover:bg-black hover:text-white transition-all flex items-center gap-2 shadow-2xs"
          >
            <Instagram size={14} />
            <span>@_beautilicious_by_ketna_</span>
          </a>
          <a
            href={settings?.instagramNails || 'https://www.instagram.com/_beautilicious_nails_studio__/'}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-white border border-[#1E1B1E]/15 rounded-full text-xs font-semibold text-[#1E1B1E] hover:bg-black hover:text-white transition-all flex items-center gap-2 shadow-2xs"
          >
            <Instagram size={14} />
            <span>@_beautilicious_nails_studio__</span>
          </a>
        </div>
      </div>
    </div>
  );
};
