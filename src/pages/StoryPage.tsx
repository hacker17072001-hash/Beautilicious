import React from 'react';
import { ArrowRight, ShieldCheck, Heart, Sparkles, CheckCircle2, Award, Gem, Clock } from 'lucide-react';
import { SiteSettings } from '../types';
import { ASSET_IMAGES } from '../assets/images';

interface StoryPageProps {
  settings: SiteSettings | null;
  onOpenBooking: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ settings, onOpenBooking }) => {
  const brandName = 'Beautilicious by Ketna';
  const ownerName = settings?.ownerName || 'Ketna';

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 space-y-24 bg-[#FAF7F2] text-[#1E1B1E]">
      
      {/* Editorial Intro with Rounded Photo */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#1E1B1E]/60 block">
            ATELIER HERITAGE & PHILOSOPHY
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E1B1E] leading-tight">
            Craftsmanship Rooted in <span className="italic font-normal text-[#8D6B78]">Patience</span> and Care.
          </h1>

          <p className="text-xs sm:text-sm text-[#1E1B1E]/75 leading-relaxed font-sans font-light">
            Founded by {ownerName}, Beautilicious by Ketna was conceived as a deliberate departure from rushed commercial salons. We believe beauty rituals should be restorative, quiet, and obsessively attentive to health.
          </p>

          <p className="text-xs sm:text-sm text-[#1E1B1E]/75 leading-relaxed font-sans font-light">
            Whether performing an intricate Russian dry manicure, precision apex reinforcement, or personalizing a bespoke bridal set, every session is a customized collaboration between client and artist right here in our private Jalgaon studio.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="px-7 py-3.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs"
            >
              <span>Reserve Atelier Visit</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="aspect-3/4 rounded-3xl overflow-hidden border border-[#1E1B1E]/10 shadow-xl bg-[#FAF7F2]">
            <img
              src={ASSET_IMAGES.founder}
              alt="Ketna, Founder of Beautilicious"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Studio Environment & Interior with Rounded Corners */}
      <section className="space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#1E1B1E]/60 block">
            THE STUDIO ATMOSPHERE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E1B1E]">
            An Intimate Sanctuary for <span className="italic font-normal text-[#8D6B78]">Mindful Pampering</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#1E1B1E]/70 leading-relaxed font-sans">
            Designed with warm curved architectural plaster, travertine stone surfaces, plush blush velvet seating, and soft natural lighting to create a soothing respite.
          </p>
        </div>

        <div className="aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden border border-[#1E1B1E]/10 shadow-lg bg-[#E6D5D3]/20 relative">
          <img
            src={ASSET_IMAGES.salonInteriorChic}
            alt="Beautilicious Boutique Studio Interior in Jalgaon"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white drop-shadow-md">
            <span className="text-xs font-semibold bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full">
              Jalgaon Atelier Suites
            </span>
          </div>
        </div>
      </section>

      {/* Core Studio Standards & Medical-Grade Sanitation (Rounded 3XL Card) */}
      <section className="bg-white rounded-3xl border border-[#1E1B1E]/10 p-8 sm:p-12 space-y-10 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#8D6B78] block">
            NON-NEGOTIABLE STANDARDS
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1E]">
            The Beautilicious <span className="italic font-normal text-[#8D6B78]">Promise</span>
          </h3>
          <p className="text-xs text-[#1E1B1E]/70 font-sans">
            Guaranteed uncompromising hygiene, world-class formulations, and private attention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#1E1B1E]/80">
          <div className="space-y-3 p-6 sm:p-7 bg-[#FAF7F2] rounded-2xl border border-[#1E1B1E]/8 hover:border-[#1E1B1E]/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#F6E8E4] flex items-center justify-center text-[#1E1B1E]">
              <Gem size={18} />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1E1B1E]">Autoclave Sterilization</h4>
            <p className="leading-relaxed text-[#1E1B1E]/70 font-sans">
              All metal implements undergo ultrasonic cleaning followed by hospital-grade autoclave pressure sterilization in sealed indicator pouches, unsealed only at your table.
            </p>
          </div>

          <div className="space-y-3 p-6 sm:p-7 bg-[#FAF7F2] rounded-2xl border border-[#1E1B1E]/8 hover:border-[#1E1B1E]/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#F6E8E4] flex items-center justify-center text-[#1E1B1E]">
              <ShieldCheck size={18} />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1E1B1E]">Non-Toxic Formulation</h4>
            <p className="leading-relaxed text-[#1E1B1E]/70 font-sans">
              We exclusively use cosmetic-grade Japanese builder gels and European skincare elixirs free from aggressive formaldehyde, DBP, toluene, and noxious odor acids.
            </p>
          </div>

          <div className="space-y-3 p-6 sm:p-7 bg-[#FAF7F2] rounded-2xl border border-[#1E1B1E]/8 hover:border-[#1E1B1E]/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#F6E8E4] flex items-center justify-center text-[#1E1B1E]">
              <Heart size={18} />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1E1B1E]">Private 1-on-1 Focus</h4>
            <p className="leading-relaxed text-[#1E1B1E]/70 font-sans">
              No overlapping client chairs or rushed assembly-line pacing. Your appointed hour belongs completely to you in our tranquil Jalgaon atelier.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onOpenBooking}
            className="px-8 py-3.5 bg-[#171417] text-white text-xs font-semibold rounded-full hover:bg-black transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <span>Schedule Your Private Session</span>
            <span>→</span>
          </button>
        </div>
      </section>
    </div>
  );
};
