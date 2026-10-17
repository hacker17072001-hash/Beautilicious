import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Sparkles, CheckCircle2, AlertCircle, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import { Service, SiteSettings, Booking } from '../types';
import { createBooking, checkAvailability } from '../lib/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  preSelectedServiceId?: string;
  settings: SiteSettings | null;
}

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
  '07:00 PM'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
  preSelectedServiceId,
  settings
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedArtist, setSelectedArtist] = useState<string>('Ketna (Founder / Master Artist)');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requests, setRequests] = useState('');
  const [refImageUrl, setRefImageUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [slotChecking, setSlotChecking] = useState(false);
  const [slotAvailable, setSlotAvailable] = useState<boolean | null>(null);
  const [slotReason, setSlotReason] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Set default minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (preSelectedServiceId) {
      setSelectedServiceId(preSelectedServiceId);
      setStep(2);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [preSelectedServiceId, services]);

  // When date or time changes, check availability
  useEffect(() => {
    if (selectedDate && selectedTime) {
      let active = true;
      setSlotChecking(true);
      setSlotAvailable(null);
      setSlotReason(null);

      checkAvailability(selectedDate, selectedTime, selectedArtist)
        .then((res) => {
          if (!active) return;
          setSlotAvailable(res.available);
          setSlotReason(res.reason || null);
          setSlotChecking(false);
        })
        .catch(() => {
          if (!active) return;
          setSlotAvailable(true);
          setSlotChecking(false);
        });

      return () => {
        active = false;
      };
    }
  }, [selectedDate, selectedTime, selectedArtist]);

  if (!isOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !selectedDate || !selectedTime || !selectedServiceId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createBooking({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        serviceId: selectedServiceId,
        date: selectedDate,
        timeSlot: selectedTime,
        artist: selectedArtist,
        specialRequests: requests,
        referenceImageUrl: refImageUrl
      });

      setCompletedBooking(res.booking);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setName('');
    setEmail('');
    setPhone('');
    setRequests('');
    setCompletedBooking(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#292429]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl border border-[#292429]/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FAF7F2] border-b border-[#292429]/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#8D6B78] font-semibold block">
              Atelier Reservation
            </span>
            <h2 className="font-serif text-2xl text-[#292429]">
              {step === 4 ? 'Reservation Summary' : 'Private Appointment'}
            </h2>
          </div>
          <button
            onClick={resetForm}
            className="p-2 text-[#292429]/60 hover:text-[#292429] hover:bg-[#E6D5D3]/40 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step indicator (when not completed) */}
        {step < 4 && (
          <div className="px-6 py-3 bg-[#E6D5D3]/20 border-b border-[#292429]/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <span className={`font-medium ${step >= 1 ? 'text-[#292429] font-bold' : 'text-[#292429]/40'}`}>
                1. Service
              </span>
              <span>/</span>
              <span className={`font-medium ${step >= 2 ? 'text-[#292429] font-bold' : 'text-[#292429]/40'}`}>
                2. Schedule & Artist
              </span>
              <span>/</span>
              <span className={`font-medium ${step >= 3 ? 'text-[#292429] font-bold' : 'text-[#292429]/40'}`}>
                3. Your Details
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-[#292429]/70">
                Select your preferred bespoke treatment or nail design service:
              </p>
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {services.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-4 border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#292429] bg-[#E6D5D3]/30 shadow-sm'
                          : 'border-[#292429]/10 bg-white hover:border-[#292429]/40'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] tracking-wider uppercase text-[#8D6B78] font-medium">
                            {srv.studio === 'nails' ? 'Nail Studio' : srv.studio === 'beauty' ? 'Beauty Studio' : 'Atelier Special'}
                          </span>
                          <span className="text-xs text-[#292429]/40">·</span>
                          <span className="text-xs font-numeric text-[#292429]/60">{srv.durationMinutes} min</span>
                        </div>
                        <h4 className="font-serif text-lg text-[#292429] truncate">{srv.name}</h4>
                        <p className="text-xs text-[#292429]/70 line-clamp-1">{srv.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-numeric text-base font-bold text-[#292429]">
                          {srv.priceType === 'starting_at' && <span className="text-xs font-normal">from </span>}
                          {srv.currency}{srv.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!selectedServiceId}
                  className="px-6 py-2.5 bg-[#292429] text-[#FAF7F2] text-xs uppercase tracking-widest hover:bg-[#3D363D] transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date, Time & Artist */}
          {step === 2 && (
            <div className="space-y-5">
              {currentService && (
                <div className="p-3 bg-[#E6D5D3]/20 border border-[#292429]/10 text-xs flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase text-[#8D6B78] font-semibold block">Selected Service</span>
                    <span className="font-serif text-base text-[#292429]">{currentService.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#8D6B78] hover:underline"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Artist Selection */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#292429] mb-1.5">
                  Artist Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Ketna (Founder / Master Artist)',
                    'Senior Studio Stylist'
                  ].map((artist) => (
                    <button
                      key={artist}
                      type="button"
                      onClick={() => setSelectedArtist(artist)}
                      className={`p-3 text-left border text-xs transition-colors cursor-pointer ${
                        selectedArtist === artist
                          ? 'border-[#292429] bg-[#292429] text-[#FAF7F2]'
                          : 'border-[#292429]/15 bg-white text-[#292429] hover:border-[#292429]/40'
                      }`}
                    >
                      <span className="font-medium block">{artist}</span>
                      <span className={`text-[10px] ${selectedArtist === artist ? 'text-[#FAF7F2]/70' : 'text-[#292429]/60'}`}>
                        {artist.includes('Ketna') ? 'Bespoke precision & couture direction' : 'Certified Russian & Japanese gel specialist'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date selection */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#292429] mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  min={minDateStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#292429]/20 text-sm text-[#292429] focus:outline-none focus:border-[#292429]"
                />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-[#292429]">
                      Available Time Slots
                    </label>
                    {slotChecking && (
                      <span className="text-[11px] text-[#8D6B78] animate-pulse">Checking slot availability...</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-3 text-xs text-center border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#292429] bg-[#292429] text-[#FAF7F2] font-medium'
                              : 'border-[#292429]/15 bg-white text-[#292429] hover:border-[#292429]/50'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  {slotAvailable === false && (
                    <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-2 border border-amber-200">
                      {slotReason || 'This slot is unavailable. Please select another time or artist.'}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#292429]/70 hover:text-[#292429] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!selectedDate || !selectedTime || slotAvailable === false}
                  className="px-6 py-2.5 bg-[#292429] text-[#FAF7F2] text-xs uppercase tracking-widest hover:bg-[#3D363D] transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact & Notes */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-[#E6D5D3]/20 border border-[#292429]/10 text-xs flex justify-between items-center">
                <div>
                  <span className="font-semibold text-[#292429]">{currentService?.name}</span>
                  <span className="text-[#292429]/70 block">{selectedDate} at {selectedTime} with {selectedArtist}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#8D6B78] hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292429] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full p-2.5 bg-white border border-[#292429]/20 text-xs text-[#292429] focus:outline-none focus:border-[#292429]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292429] mb-1">
                    Phone (Mobile for SMS/WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full p-2.5 bg-white border border-[#292429]/20 text-xs text-[#292429] focus:outline-none focus:border-[#292429]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292429] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full p-2.5 bg-white border border-[#292429]/20 text-xs text-[#292429] focus:outline-none focus:border-[#292429]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292429] mb-1">
                  Nail Art Notes / Special Requests
                </label>
                <textarea
                  rows={2}
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  placeholder="e.g. Existing gel removal needed, almond shape preference, micro-chrome french style..."
                  className="w-full p-2.5 bg-white border border-[#292429]/20 text-xs text-[#292429] focus:outline-none focus:border-[#292429]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292429] mb-1">
                  Optional Inspiration Image Link
                </label>
                <input
                  type="url"
                  value={refImageUrl}
                  onChange={(e) => setRefImageUrl(e.target.value)}
                  placeholder="https://... (Instagram post link or image reference)"
                  className="w-full p-2.5 bg-white border border-[#292429]/20 text-xs text-[#292429] focus:outline-none focus:border-[#292429]"
                />
              </div>

              <div className="pt-2 text-[11px] text-[#292429]/60 leading-relaxed">
                By submitting, your appointment reservation request will be recorded in our atelier ledger.
                {settings?.cancellationPolicy && (
                  <span className="block mt-1 italic text-[#8D6B78]">{settings.cancellationPolicy}</span>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#292429]/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#292429]/70 hover:text-[#292429] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#292429] text-[#FAF7F2] text-xs uppercase tracking-widest hover:bg-[#3D363D] transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  {loading ? 'Securing Slot...' : 'Confirm Appointment Request'}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Booking Confirmation Output */}
          {step === 4 && completedBooking && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-[#E6D5D3] rounded-full mx-auto flex items-center justify-center text-[#292429]">
                <CheckCircle2 size={36} className="text-[#292429]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs tracking-widest uppercase text-[#8D6B78] font-semibold">
                  Reservation Reference
                </span>
                <h3 className="font-numeric text-3xl font-bold tracking-wider text-[#292429]">
                  {completedBooking.referenceNumber}
                </h3>
                <div className="inline-block px-3 py-1 bg-[#FAF7F2] border border-[#C4AB83] text-xs text-[#292429] font-medium">
                  {completedBooking.status === 'confirmed' ? 'Status: Confirmed' : 'Status: Requested (Awaiting Owner Review)'}
                </div>
              </div>

              <div className="max-w-md mx-auto p-4 bg-white border border-[#292429]/15 text-left text-xs space-y-2">
                <div className="flex justify-between pb-2 border-b border-[#292429]/10">
                  <span className="text-[#292429]/60">Client:</span>
                  <span className="font-semibold text-[#292429]">{completedBooking.customerName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#292429]/10">
                  <span className="text-[#292429]/60">Service:</span>
                  <span className="font-semibold text-[#292429]">{completedBooking.serviceName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#292429]/10">
                  <span className="text-[#292429]/60">Date & Time:</span>
                  <span className="font-semibold text-[#292429]"><span className="font-numeric">{completedBooking.date}</span> at <span className="font-numeric">{completedBooking.timeSlot}</span></span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#292429]/10">
                  <span className="text-[#292429]/60">Artist:</span>
                  <span className="font-semibold text-[#292429]">{completedBooking.artist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#292429]/60">Estimated Total:</span>
                  <span className="font-semibold font-numeric text-[#292429]">{completedBooking.priceEstimate}</span>
                </div>
              </div>

              <p className="text-xs text-[#292429]/70 max-w-md mx-auto">
                A confirmation summary has been logged. For urgent questions or reference photos, you may message Ketna on WhatsApp quoting your reservation code.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${settings?.whatsappNumber || '14158905241'}?text=Hi%20Ketna,%20I%20just%20submitted%20booking%20request%20${completedBooking.referenceNumber}%20for%20${encodeURIComponent(completedBooking.serviceName)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#292429] text-[#FAF7F2] text-xs uppercase tracking-widest hover:bg-[#3D363D] transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  <span>Notify via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-2.5 border border-[#292429]/30 text-xs uppercase tracking-widest text-[#292429] hover:bg-[#E6D5D3]/30 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
