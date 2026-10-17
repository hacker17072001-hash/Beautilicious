import React, { useEffect } from 'react';
import { X, ArrowRight, Instagram } from 'lucide-react';
import { GalleryItem, SiteSettings } from '../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onBookInspired: () => void;
  settings: SiteSettings | null;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  onClose,
  onBookInspired,
  settings
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-4xl w-full bg-[#FAF7F2] rounded-3xl border border-[#292429]/20 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="absolute top-3 right-3 z-10 p-2 bg-[#292429]/80 text-[#FAF7F2] hover:bg-[#292429] rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Media Preview Column */}
        <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain max-h-[60vh] md:max-h-[80vh]"
          />
        </div>

        {/* Detail Column */}
        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8D6B78] font-bold block">
                {item.category}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-[#292429] mt-1">
                {item.title}
              </h3>
              <span className="text-xs text-[#292429]/50 block mt-0.5">
                {item.studio === 'nails' ? 'Beautilicious Nails Studio' : item.studio === 'beauty' ? 'Beautilicious Beauty' : 'Atelier Special'}
              </span>
            </div>

            <p className="text-xs text-[#292429]/80 leading-relaxed font-sans font-light">
              {item.caption || 'Bespoke atelier artwork crafted with high-precision technique and non-toxic Japanese builder gel.'}
            </p>

            <div className="pt-2 border-t border-[#292429]/10 text-xs text-[#292429]/60 space-y-1">
              <p>• Handcrafted custom design</p>
              <p>• Chemical-free natural nail reinforcement</p>
              <p>• Durability: 3–4 weeks retention</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#292429]/10">
            <button
              onClick={() => {
                onClose();
                onBookInspired();
              }}
              className="w-full py-3 bg-[#292429] text-[#FAF7F2] text-xs uppercase tracking-widest hover:bg-[#3D363D] transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium"
            >
              <span>Book This Look</span>
              <ArrowRight size={14} />
            </button>

            <a
              href={settings?.instagramNails || 'https://www.instagram.com/_beautilicious_nails_studio__/'}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 border border-[#292429]/20 text-[11px] uppercase tracking-wider text-[#292429] hover:bg-[#E6D5D3]/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <Instagram size={13} />
              <span>View On Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
