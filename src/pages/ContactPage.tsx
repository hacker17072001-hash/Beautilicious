import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Instagram, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { SiteSettings } from '../types';
import { createInquiry } from '../lib/api';

interface ContactPageProps {
  settings: SiteSettings | null;
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onOpenBooking }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Consultation Inquiry');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'email' | 'phone'>('whatsapp');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const phoneNum = settings?.phone || '+1 (415) 890-5241';
  const whatsappNum = settings?.whatsappNumber || '14158905241';
  const emailAddr = settings?.email || 'appointments@beautilicious.com';
  const address = settings?.address || 'Suite 402, Couture Atelier Boulevard (By Appointment Only)';

  const faqs = [
    {
      q: 'How does the appointment reservation process work?',
      a: 'You can submit your desired service, date, and time slot directly through our online reservation form. Because sessions are strictly 1-on-1, our studio concierge checks the slot and approves the booking within 24 hours. You will receive immediate WhatsApp/email confirmation.'
    },
    {
      q: 'What is a Russian dry manicure and why is it superior?',
      a: 'A Russian manicure uses precision diamond e-file bits on completely dry skin to gently buff and lift the cuticle. This permits the polish to be placed seamlessly under the cuticle line without flooded borders, delivering 3 to 4 weeks of pristine, chip-free wear.'
    },
    {
      q: 'Do you accept walk-in clients?',
      a: 'To guarantee pristine hygienic preparation and private undivided attention, we operate strictly on a scheduled appointment basis. Please book at least 24–48 hours in advance.'
    },
    {
      q: 'What is your rescheduling and cancellation policy?',
      a: settings?.cancellationPolicy || 'Appointments may be rescheduled or cancelled up to 24 hours prior without penalty. Late cancellations or no-shows incur a 50% reservation fee.'
    },
    {
      q: 'Can I bring custom reference images or runway nail inspirations?',
      a: 'Absolutely! You may submit reference image links during booking or send them directly to our WhatsApp concierge. Ketna will examine the complexity and allocate appropriate atelier time.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please provide your name, email and message');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createInquiry({
        name,
        email,
        phone,
        subject,
        message,
        preferredContact
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 space-y-20">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#8D6B78] font-semibold block">
          Concierge & Studio Visit
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#292429]">
          Connect with the <span className="italic">Atelier</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#292429]/75 font-sans leading-relaxed">
          For appointment requests, bespoke bridal consultations, or general inquiries, reach out through our contact desk or direct WhatsApp channel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Col: Contact Info & Hours */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 bg-white rounded-2xl border border-[#1E1B1E]/10 space-y-6 shadow-xs">
            <h3 className="font-serif text-2xl font-bold text-[#1E1B1E]">
              Studio Information
            </h3>

            <div className="space-y-4 text-xs text-[#1E1B1E]/80">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#8D6B78] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1E1B1E] block">Atelier Location</span>
                  <span>{address}</span>
                  <span className="block text-[#1E1B1E]/50 mt-0.5">Private address details provided upon reservation confirmation</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Phone size={16} className="text-[#8D6B78] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1E1B1E] block">Direct Studio Line</span>
                  <a href={`tel:${phoneNum}`} className="hover:text-[#8D6B78] underline">
                    {phoneNum}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Mail size={16} className="text-[#8D6B78] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1E1B1E] block">Concierge Email</span>
                  <a href={`mailto:${emailAddr}`} className="hover:text-[#8D6B78] underline">
                    {emailAddr}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Clock size={16} className="text-[#8D6B78] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1E1B1E] block">Opening Hours</span>
                  <p>Monday – Friday: 10:00 AM – 7:30 PM</p>
                  <p>Saturday: 9:00 AM – 6:30 PM</p>
                  <p className="text-[#1E1B1E]/50">Sunday: Closed for Studio Maintenance</p>
                </div>
              </div>
            </div>

            {/* Direct Instant Channels */}
            <div className="pt-4 border-t border-[#1E1B1E]/10 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#8D6B78] font-bold block">
                Instant Messaging & Portfolios
              </span>
              <a
                href={`https://wa.me/${whatsappNum}?text=Hi%20Ketna,%20I%20would%20like%20to%20inquire%20about%20Beautilicious.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-[#171417] text-[#FAF7F2] text-xs font-semibold rounded-full uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <Phone size={13} />
                <span>Message on WhatsApp</span>
              </a>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={settings?.instagramMain || 'https://www.instagram.com/_beautilicious_by_ketna_/'}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 border border-[#1E1B1E]/15 rounded-full text-[11px] text-[#1E1B1E] hover:bg-[#FAF7F2] text-center flex items-center justify-center gap-1.5"
                >
                  <Instagram size={12} />
                  <span>@_beautilicious_by_ketna_</span>
                </a>
                <a
                  href={settings?.instagramNails || 'https://www.instagram.com/_beautilicious_nails_studio__/'}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 border border-[#1E1B1E]/15 rounded-full text-[11px] text-[#1E1B1E] hover:bg-[#FAF7F2] text-center flex items-center justify-center gap-1.5"
                >
                  <Instagram size={12} />
                  <span>@_beautilicious_nails_studio__</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-8 bg-white rounded-2xl border border-[#1E1B1E]/10 space-y-6 shadow-xs">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-[#8D6B78] font-semibold block">
                Direct Inquiry Form
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1E1B1E]">
                Send a Message to Ketna
              </h3>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3 bg-[#FAF7F2] p-6 rounded-2xl border border-[#1E1B1E]/10">
                <CheckCircle2 size={36} className="mx-auto text-[#292429]" />
                <h4 className="font-serif text-xl font-bold text-[#292429]">Inquiry Received</h4>
                <p className="text-xs text-[#292429]/70 max-w-sm mx-auto">
                  Thank you for reaching out. Your message has been logged directly into our atelier inbox. We will respond within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 border border-[#292429]/30 text-xs text-[#292429] hover:bg-white uppercase tracking-wider"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[#292429] mb-1 font-medium">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#292429]/20 text-xs text-[#292429] focus:outline-none focus:border-[#292429]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[#292429] mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ananya@example.com"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#292429]/20 text-xs text-[#292429] focus:outline-none focus:border-[#292429]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[#292429] mb-1 font-medium">
                      Phone (Mobile)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98200 00000"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#292429]/20 text-xs text-[#292429] focus:outline-none focus:border-[#292429]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[#292429] mb-1 font-medium">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#292429]/20 text-xs text-[#292429] focus:outline-none focus:border-[#292429]"
                    >
                      <option value="General Consultation Inquiry">General Consultation Inquiry</option>
                      <option value="Bespoke Nail Art / Extensions Inquiry">Bespoke Nail Art / Extensions Inquiry</option>
                      <option value="Bridal & Event Package Inquiry">Bridal & Event Package Inquiry</option>
                      <option value="Skin Rituals & Facial Inquiry">Skin Rituals & Facial Inquiry</option>
                      <option value="Studio Buyout / Group Booking">Studio Buyout / Group Booking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#292429] mb-1 font-medium">
                    Preferred Response Method
                  </label>
                  <div className="flex gap-4 pt-1">
                    {[
                      { id: 'whatsapp', label: 'WhatsApp' },
                      { id: 'email', label: 'Email' },
                      { id: 'phone', label: 'Phone Call' }
                    ].map((opt) => (
                      <label key={opt.id} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value={opt.id}
                          checked={preferredContact === opt.id}
                          onChange={() => setPreferredContact(opt.id as any)}
                          className="accent-[#292429]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#292429] mb-1 font-medium">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the desired service, occasion, or any questions..."
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#292429]/20 text-xs text-[#292429] focus:outline-none focus:border-[#292429]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#171417] text-[#FAF7F2] text-xs font-semibold rounded-full uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send size={13} />
                    <span>{submitting ? 'Transmitting...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Expandable FAQs */}
      <div className="space-y-6 pt-12 border-t border-[#1E1B1E]/10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-sans font-bold tracking-[0.25em] uppercase text-[#8D6B78] block">
            COMMON INQUIRIES
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1E]">
            Frequently Asked <span className="italic font-normal text-[#8D6B78]">Questions</span>
          </h3>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#1E1B1E]/10 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-base text-[#1E1B1E] font-bold">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#8D6B78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-[#1E1B1E]/75 leading-relaxed border-t border-[#1E1B1E]/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
