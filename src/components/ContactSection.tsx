import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Mail, Send, CheckCircle2, User, Clock, Share2 } from 'lucide-react';
import { BusinessSettings } from '../types';
import { api } from '../services/api';
import { buildWhatsAppLink, getCleanSocialUrl } from '../utils/formatters';
import { useToast } from './Toast';

interface ContactSectionProps {
  settings?: BusinessSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('Please fill in your name, phone number, and message.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitContact({
        name,
        phone,
        email,
        message
      });

      setIsSubmitted(true);
      showToast('Thank you! Your message has been sent to Toysn Wood and Super Cakes.', 'success');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDirect = buildWhatsAppLink(settings?.whatsapp, {
    product: 'General Inquiry / Wood materials',
    size: 'Standard'
  });

  const fbUrl = getCleanSocialUrl('facebook', settings?.facebook || 'Okubanjooluwatosin');
  const igUrl = getCleanSocialUrl('instagram', settings?.instagram || 'Okubanjooluwatosin');
  const ttUrl = getCleanSocialUrl('tiktok', settings?.tiktok || 'Okubanjooluwatosin');

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#B45309] uppercase bg-[#FEF3C7] px-3.5 py-1.5 rounded-full inline-block mb-3 border border-[#FDE68A]">
            Direct Customer Support
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1917] tracking-tight uppercase font-['Plus_Jakarta_Sans']">
            Contact Toysn Wood and Super Cakes
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#57534E]">
            Dealer in all kinds of Roofing Wood, building timber, and artisanal custom cakes. Get in touch for price inquiries, vehicle dispatch, or custom cake bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#1C1917] text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-8">
            
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] block mb-1">
                Office &amp; Customer Support
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
                Toysn Wood &amp; Super Cakes
              </h3>
              <p className="text-sm text-[#A8A29E] mt-1 font-medium">
                Roofing Wood • Planks • Artisanal Cakes
              </p>
            </div>

            <div className="space-y-5 text-sm">
              
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#292524] text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#38332E]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold block">Phone</span>
                  {settings.phone ? (
                    <a href={`tel:${settings.phone}`} className="text-white hover:text-[#F59E0B] font-bold text-base transition-colors">
                      {settings.phone}
                    </a>
                  ) : (
                    <span className="text-[#A8A29E] italic">Contact line available via WhatsApp or Message</span>
                  )}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#15803D]/30 text-emerald-400 flex items-center justify-center shrink-0 border border-[#15803D]/40">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold block">WhatsApp</span>
                  {settings.whatsapp ? (
                    <a href={whatsappDirect} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold text-base transition-colors">
                      {settings.whatsapp}
                    </a>
                  ) : (
                    <a href={whatsappDirect} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold text-base transition-colors">
                      Chat directly on WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#292524] text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#38332E]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold block">Address / Location</span>
                  <span className="text-white font-medium">
                    {settings.address || 'Lagos, Nigeria'}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#292524] text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#38332E]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold block">Email</span>
                  <a href={`mailto:${settings.email || 'toysnwoodandcakes@gmail.com'}`} className="text-white hover:text-[#F59E0B] transition-colors font-medium">
                    {settings.email || 'toysnwoodandcakes@gmail.com'}
                  </a>
                </div>
              </div>

              {/* Opening hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#292524] text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#38332E]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold block">Opening Hours</span>
                  <span className="text-white font-medium">
                    {settings.opening_hours || 'Monday - Saturday: 7:30 AM - 6:30 PM'}
                  </span>
                </div>
              </div>

            </div>

            {/* Social Media summary */}
            <div className="pt-6 border-t border-[#292524] space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#78716C] font-bold block">
                Social Media
              </span>
              <div className="flex flex-col gap-1.5 text-xs text-[#D6D3D1]">
                <div>Facebook — <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="text-[#F59E0B] hover:underline font-semibold">{settings.facebook || 'Okubanjooluwatosin'}</a></div>
                <div>Instagram — <a href={igUrl} target="_blank" rel="noopener noreferrer" className="text-[#F59E0B] hover:underline font-semibold">{settings.instagram || 'Okubanjooluwatosin'}</a></div>
                <div>TikTok — <a href={ttUrl} target="_blank" rel="noopener noreferrer" className="text-[#F59E0B] hover:underline font-semibold">{settings.tiktok || 'Okubanjooluwatosin'}</a></div>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-8 sm:p-10 rounded-3xl border border-[#E7E5E4] shadow-sm">
            <h3 className="text-2xl font-bold text-[#1C1917] mb-2">Send Us a Direct Message</h3>
            <p className="text-sm text-[#57534E] mb-6">
              Have questions about wood specs, pricing, or custom delivery? Send us a note and we will reply promptly.
            </p>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-[#1C1917]">Message Received!</h4>
                <p className="text-sm text-[#57534E] max-w-sm mx-auto">
                  Thank you! Toysn Wood and Super Cakes has received your message and will contact you via phone or email shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#1C1917] text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Architect Tosin"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 080..."
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. customer@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your inquiry, order questions, or project requirements..."
                    className="w-full px-4 py-2.5 bg-white border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D97706] hover:bg-[#B45309] disabled:bg-stone-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  id="btn-send-contact-message"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
