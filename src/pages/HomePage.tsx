import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Star, 
  ChevronLeft,
  ChevronRight,
  Gem,
  Leaf,
  Users,
  Award,
  Sparkle
} from 'lucide-react';
import { Service, GalleryItem, SiteSettings } from '../types';
import { ASSET_IMAGES } from '../assets/images';

interface HomePageProps {
  services: Service[];
  gallery: GalleryItem[];
  settings: SiteSettings | null;
  onNavigate: (tab: string) => void;
  onOpenBooking: (serviceId?: string) => void;
  onOpenLightbox: (item: GalleryItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  services,
  gallery,
  settings,
  onNavigate,
  onOpenBooking,
  onOpenLightbox
}) => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Curated 6 Services matching the exact design
  const servicesList = [
    {
      id: 'srv-manicure',
      name: 'Manicure',
      desc: 'Clean, shape and nourish for healthy, beautiful nails.',
      image: ASSET_IMAGES.serviceManicure,
      icon: (
        <svg className="w-5 h-5 text-[#1E1B1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
        </svg>
      )
    },
    {
      id: 'srv-pedicure',
      name: 'Pedicure',
      desc: 'Relaxing care for happy, refreshed feet.',
      image: ASSET_IMAGES.servicePedicure,
      icon: (
        <svg className="w-5 h-5 text-[#1E1B1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
          <path d="M17 14a5 5 0 0 1-10 0v2a5 5 0 0 0 10 0v-2z" />
        </svg>
      )
    },
    {
      id: 'srv-extensions',
      name: 'Nail Extensions',
      desc: 'Add length. Add style. Add confidence.',
      image: ASSET_IMAGES.nailArt,
      icon: (
        <svg className="w-5 h-5 text-[#1E1B1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3h6v4H9zM7 7h10v14H7z" />
          <path d="M12 11v6" />
        </svg>
      )
    },
    {
      id: 'srv-nailart',
      name: 'Nail Art',
      desc: 'Unique designs to express your style.',
      image: ASSET_IMAGES.heroFloralNails,
      icon: (
        <svg className="w-5 h-5 text-[#1E1B1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z" />
        </svg>
      )
    },
    {
      id: 'srv-nailspa',
      name: 'Nail Spa',
      desc: 'A luxurious self-care experience.',
      image: ASSET_IMAGES.serviceNailSpa,
      icon: (
        <svg className="w-5 h-5 text-[#1E1B1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9z" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
    },
    {
      id: 'srv-gelpolish',
      name: 'Gel Polish',
      desc: 'Long-lasting shine and perfection.',
      image: ASSET_IMAGES.founder,
      icon: (
        <svg className="w-5 h-5 text-[#1E1B1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 21h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
          <path d="M10 13h4" />
        </svg>
      )
    }
  ];

  // 6 Curated Featured Nail Art Works matching the exact 6 thumbnail styles
  const featuredArtWorks: GalleryItem[] = [
    {
      id: 'feat-1',
      title: 'Gold Star Micro Sparkle',
      category: 'Minimal Chic',
      studio: 'nails',
      imageUrl: ASSET_IMAGES.serviceManicure,
      caption: 'Sheer nude builder gel layered with micro gold leaf stars and glossy top coat.',
      featured: true,
      order: 1,
      likesCount: 182,
      createdAt: '2026-10-10'
    },
    {
      id: 'feat-2',
      title: 'Deep Burgundy Velvet Gloss',
      category: 'Couture Glaze',
      studio: 'nails',
      imageUrl: ASSET_IMAGES.servicePedicure,
      caption: 'Rich autumn wine red with mirror shine apex architecture.',
      featured: true,
      order: 2,
      likesCount: 245,
      createdAt: '2026-10-11'
    },
    {
      id: 'feat-3',
      title: 'Hand-Tied Coquette Ribbon',
      category: 'Handcrafted Art',
      studio: 'nails',
      imageUrl: ASSET_IMAGES.nailArt,
      caption: 'Delicate hand-painted micro black bows on glazed marshmallow pink base.',
      featured: true,
      order: 3,
      likesCount: 310,
      createdAt: '2026-10-12'
    },
    {
      id: 'feat-4',
      title: 'Daisy Garden Micro Blooms',
      category: 'Floral Detail',
      studio: 'nails',
      imageUrl: ASSET_IMAGES.heroFloralNails,
      caption: 'Hand-painted white daisy florals with raised micro pearls on natural almond shape.',
      featured: true,
      order: 4,
      likesCount: 420,
      createdAt: '2026-10-13'
    },
    {
      id: 'feat-5',
      title: 'Matcha Olive Swirl Marble',
      category: 'Modern Abstract',
      studio: 'nails',
      imageUrl: ASSET_IMAGES.studioInterior,
      caption: 'Organic matcha and pistachio green swirl accents on glazed milky porcelain base.',
      featured: true,
      order: 5,
      likesCount: 195,
      createdAt: '2026-10-14'
    },
    {
      id: 'feat-6',
      title: 'Ocean Glaze French Bloom',
      category: 'Couture Gel',
      studio: 'nails',
      imageUrl: ASSET_IMAGES.serviceNailSpa,
      caption: 'Cobalt and royal blue glazed French tips adorned with subtle 3D ceramic florals.',
      featured: true,
      order: 6,
      likesCount: 260,
      createdAt: '2026-10-15'
    }
  ];

  // Client Testimonials matching the exact card contents in screenshot
  const testimonials = [
    {
      quote: 'Amazing experience! The staff is so friendly and my nails have never looked better!',
      name: 'Simran Kaur',
      location: 'Jalgaon',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      quote: 'Beautiful studio, great hygiene and super talented nail artists. Highly recommend!',
      name: 'Aditi Sharma',
      location: 'Jalgaon',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    },
    {
      quote: 'My go-to place for nail care. Always leave feeling pampered!',
      name: 'Neha Verma',
      location: 'Jalgaon',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <div className="space-y-20 md:space-y-28 pb-20 bg-[#FAF7F2] text-[#1E1B1E] selection:bg-[#EEDCD7] selection:text-[#1E1B1E]">
      
      {/* SECTION 1: HERO (EXACT REPLICA) */}
      <section className="pt-6 sm:pt-10 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Typography, CTA, Trust Bar */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#1E1B1E]/70 block">
              BEAUTY AT YOUR FINGERTIPS
            </span>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-[#1E1B1E] leading-[1.08] tracking-tight">
              Polished<br />
              Confidence<br />
              Everyday
            </h1>

            <p className="text-sm sm:text-base text-[#1E1B1E]/75 max-w-lg leading-relaxed font-sans font-light">
              Premium nail care, stunning designs, and a relaxing self-care experience — because you deserve it.
            </p>

            {/* Action Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenBooking()}
                className="px-7 py-3.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 shadow-sm active:scale-[0.98]"
              >
                <span>Book Your Appointment</span>
                <span>→</span>
              </button>
            </div>

            {/* 4-Column Feature/Trust Bar */}
            <div className="pt-8 border-t border-[#1E1B1E]/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Gem size={14} className="text-[#1E1B1E]" />
                  <h4 className="text-xs font-bold text-[#1E1B1E]">Hygienic & Safe</h4>
                </div>
                <p className="text-[11px] text-[#1E1B1E]/60">Your safety first</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Leaf size={14} className="text-[#1E1B1E]" />
                  <h4 className="text-xs font-bold text-[#1E1B1E]">Premium Products</h4>
                </div>
                <p className="text-[11px] text-[#1E1B1E]/60">Loved by professionals</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-[#1E1B1E]" />
                  <h4 className="text-xs font-bold text-[#1E1B1E]">Expert Nail Artists</h4>
                </div>
                <p className="text-[11px] text-[#1E1B1E]/60">Trained & certified</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-[#1E1B1E]" />
                  <h4 className="text-xs font-bold text-[#1E1B1E]">5 Star Experience</h4>
                </div>
                <p className="text-[11px] text-[#1E1B1E]/60">Clients love us</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Cursive Sticker */}
          <div className="lg:col-span-5 relative">
            {/* Handwritten Script Sticker at top right */}
            <div className="absolute -top-6 -right-2 sm:-top-8 sm:-right-4 z-20 pointer-events-none select-none text-right">
              <div className="font-script text-2xl sm:text-3xl md:text-4xl text-[#1E1B1E] leading-tight rotate-6">
                <p>Good</p>
                <p>Nails</p>
                <p>Happier</p>
                <p>You ♡</p>
              </div>
            </div>

            {/* Main Photo Card */}
            <div className="relative aspect-4/5 sm:aspect-square lg:aspect-4/5 rounded-3xl overflow-hidden shadow-xl border border-[#1E1B1E]/10 bg-[#FAF7F2]">
              <img
                src={ASSET_IMAGES.heroFloralNails}
                alt="Polished luxury nails with delicate white daisy florals"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR SERVICES - "TREAT YOURSELF" */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#1E1B1E]/60 block mb-1">
              OUR SERVICES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1E]">
              Treat Yourself
            </h2>
          </div>

          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-[#1E1B1E] hover:underline flex items-center gap-1.5 cursor-pointer pb-1"
          >
            <span>View All Services</span>
            <span>→</span>
          </button>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {servicesList.map((service) => (
            <div
              key={service.id}
              onClick={() => onOpenBooking(service.id)}
              className="bg-white rounded-2xl p-3 border border-[#1E1B1E]/8 hover:border-[#1E1B1E]/25 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Rounded Service Photo */}
                <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={service.image}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Icon & Title */}
                <div className="space-y-1 px-1">
                  <div className="mb-1 text-[#1E1B1E]">
                    {service.icon}
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1E1B1E] group-hover:text-[#8D6B78] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-[11px] text-[#1E1B1E]/65 leading-snug line-clamp-2">
                    {service.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: WHY CHOOSE NAILÉ - "MORE THAN JUST A NAIL SALON" */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Salon Interior Photo with Overlaid Script */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden shadow-xl border border-[#1E1B1E]/10 bg-[#FAF7F2]">
              <img
                src={ASSET_IMAGES.salonInteriorChic}
                alt="Modern aesthetic nail salon interior with plush pink armchairs"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Overlaid script on the top left */}
              <div className="absolute top-6 left-6 select-none pointer-events-none">
                <div className="font-script text-2xl sm:text-3xl text-white/95 leading-tight drop-shadow-md -rotate-3">
                  <p>GOOD</p>
                  <p>NAILS</p>
                  <p>BRIGHTER</p>
                  <p>DAYS</p>
                  <p>♡</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Features and Pill CTA */}
          <div className="lg:col-span-6 space-y-6 relative">
            {/* Top Right Script Sticker */}
            <div className="hidden sm:block absolute -top-4 right-0 pointer-events-none select-none text-right">
              <div className="font-script text-2xl md:text-3xl text-[#1E1B1E] leading-tight rotate-3">
                <p>Self</p>
                <p>Care</p>
                <p>Looks</p>
                <p>Good</p>
                <p>On You</p>
                <p>♡</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#1E1B1E]/60 block mb-1">
                WHY CHOOSE BEAUTILICIOUS BY KETNA
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E1B1E] leading-tight">
                More Than<br />
                Just a Nail Salon
              </h2>
            </div>

            {/* 4 Feature Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F6E8E4] flex items-center justify-center shrink-0 text-[#1E1B1E]">
                  <Award size={18} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#1E1B1E]">Trained Professionals</h4>
                  <p className="text-[11px] text-[#1E1B1E]/65 leading-snug">
                    Skilled nail artists, passionate about perfection.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F6E8E4] flex items-center justify-center shrink-0 text-[#1E1B1E]">
                  <ShieldCheck size={18} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#1E1B1E]">Premium & Safe Products</h4>
                  <p className="text-[11px] text-[#1E1B1E]/65 leading-snug">
                    Top-quality, non-toxic products for your care.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F6E8E4] flex items-center justify-center shrink-0 text-[#1E1B1E]">
                  <Sparkles size={18} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#1E1B1E]">Relaxing Ambience</h4>
                  <p className="text-[11px] text-[#1E1B1E]/65 leading-snug">
                    A calm, clean and aesthetic space to unwind.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F6E8E4] flex items-center justify-center shrink-0 text-[#1E1B1E]">
                  <Heart size={18} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#1E1B1E]">Customized Designs</h4>
                  <p className="text-[11px] text-[#1E1B1E]/65 leading-snug">
                    From classic to bold, we bring your ideas to life.
                  </p>
                </div>
              </div>
            </div>

            {/* Soft pink button */}
            <div className="pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="px-7 py-3.5 bg-[#EEDCD7] text-[#1E1B1E] hover:bg-[#E5C9C3] rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-[0.98]"
              >
                <span>Book Your Self-Care Time</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURED WORK - "NAIL ART THAT SPEAKS" */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#1E1B1E]/60 block mb-1">
              FEATURED WORK
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1E]">
              Nail Art That Speaks
            </h2>
          </div>

          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-bold text-[#1E1B1E] hover:underline flex items-center gap-1.5 cursor-pointer pb-1"
          >
            <span>View Gallery</span>
            <span>→</span>
          </button>
        </div>

        {/* 6 Featured Work Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {featuredArtWorks.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenLightbox(item)}
              className="group aspect-square rounded-2xl overflow-hidden bg-white border border-[#1E1B1E]/10 cursor-pointer shadow-xs hover:shadow-md transition-all relative"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                <span className="text-[9px] uppercase tracking-wider text-[#C4AB83] font-bold">{item.category}</span>
                <p className="font-serif text-xs font-semibold truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: SPECIAL OFFER BANNER (EXACT REPLICA) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-[#EEDCD7] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content (6 cols) */}
            <div className="md:col-span-6 space-y-4">
              <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#1E1B1E]/70 block">
                SPECIAL OFFER
              </span>

              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E1B1E] leading-tight">
                Pamper. Save. Shine.
              </h2>

              <p className="text-xs sm:text-sm text-[#1E1B1E]/80 max-w-md font-sans">
                Get 20% off on your first visit. Because beautiful nails are always a good idea.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenBooking()}
                  className="px-7 py-3.5 bg-[#171417] text-white hover:bg-black rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <span>Claim Your Offer</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Center: Glossy Nail Polish Bottle Dripping (3 cols) */}
            <div className="md:col-span-4 flex items-center justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white/60 shadow-lg">
                <img
                  src={ASSET_IMAGES.polishDripping}
                  alt="Pastel blush pink creamy nail polish dripping bottle"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Handwritten Script Sticker (2 cols) */}
            <div className="md:col-span-2 text-right hidden md:block select-none pointer-events-none">
              <div className="font-script text-2xl sm:text-3xl text-[#1E1B1E] leading-tight -rotate-3">
                <p>Small</p>
                <p>Details</p>
                <p>Big</p>
                <p>Happiness</p>
                <p>♡</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHAT OUR CLIENTS SAY - "REAL PEOPLE. BEAUTIFUL NAILS." */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#1E1B1E]/60 block mb-1">
              WHAT OUR CLIENTS SAY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1E]">
              Real People. Beautiful Nails.
            </h2>
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTestimonialIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1))}
              aria-label="Previous review"
              className="w-8 h-8 rounded-full border border-[#1E1B1E]/20 flex items-center justify-center hover:bg-[#1E1B1E] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setTestimonialIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0))}
              aria-label="Next review"
              className="w-8 h-8 rounded-full border border-[#1E1B1E]/20 flex items-center justify-center hover:bg-[#1E1B1E] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#1E1B1E]/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <p className="text-xs sm:text-sm text-[#1E1B1E]/80 leading-relaxed font-sans">
                "{t.quote}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-[#1E1B1E]/8">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#1E1B1E]/15"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1B1E]">{t.name}</h4>
                    <span className="text-[10px] text-[#8D6B78] font-medium">{t.location}</span>
                  </div>
                </div>

                <div className="flex text-[#C4AB83] gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={13} fill="#C4AB83" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>



    </div>
  );
};
