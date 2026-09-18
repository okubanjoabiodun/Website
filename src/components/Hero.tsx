import React from 'react';
import { ShieldCheck, CheckCircle2, MessageCircle, FileText, ShoppingBag, ArrowRight } from 'lucide-react';
import { BusinessSettings } from '../types';
import { buildWhatsAppLink } from '../utils/formatters';

interface HeroProps {
  settings?: BusinessSettings;
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onOpenQuote }) => {
  const whatsappUrl = buildWhatsAppLink(settings?.whatsapp, {
    product: 'Roofing Wood & Planks',
    size: 'Assorted / 2x2, 2x3, 2x4'
  });

  const scrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.querySelector('#products');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-[#1C1917] text-white overflow-hidden pt-8 pb-16 lg:py-24 border-b border-[#292524]">
      {/* Subtle warm wood grain ambient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#78350F]/20 via-[#1C1917]/90 to-[#1C1917] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#292524] border border-[#B45309]/40 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-[#FBBF24]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Trusted Wood Supplier &amp; Fast Dispatch in Nigeria
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.1] font-['Plus_Jakarta_Sans']">
              Quality Roofing Wood <br className="hidden sm:inline" />
              <span className="text-[#F59E0B]">You Can Trust</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#D6D3D1] max-w-2xl leading-relaxed">
              <strong className="text-white font-semibold">Toysn Wood and Super Cakes</strong> — Dealer in all kinds of roofing wood, planks and quality building timber, alongside mouthwatering artisanal cakes and event treats by Super Cakes.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#products"
                onClick={scrollToProducts}
                className="bg-[#D97706] hover:bg-[#B45309] text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                id="hero-shop-wood-btn"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Wood
              </a>

              <button
                onClick={onOpenQuote}
                className="bg-[#292524] hover:bg-[#38332E] text-[#FAF8F5] border border-[#57534E] px-6 py-3.5 rounded-xl font-bold text-base transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                id="hero-request-quote-btn"
              >
                <FileText className="w-5 h-5 text-[#F59E0B]" />
                Request a Quote
              </button>

              <a
                href={settings?.whatsapp ? whatsappUrl : '#quote'}
                onClick={(e) => {
                  if (!settings?.whatsapp) {
                    e.preventDefault();
                    onOpenQuote();
                  }
                }}
                target={settings?.whatsapp ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="bg-[#15803D] hover:bg-[#166534] text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                id="hero-whatsapp-btn"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Small trust indicators */}
            <div className="pt-6 border-t border-[#292524] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#E7E5E4]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Quality Wood</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#E7E5E4]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Competitive Prices</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#E7E5E4]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Delivery Available</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#E7E5E4]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Reliable Service</span>
              </div>
            </div>
          </div>

          {/* Hero visual image card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#44403C] shadow-2xl bg-[#292524] group">
              <img
                src="/images/wood_timber_stack.jpg"
                alt="Toysn Wood and Super Cakes Roofing Timber and Building Planks"
                className="w-full h-[360px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-black/20" />

              {/* Floating verified price pill */}
              <div className="absolute top-4 left-4 bg-[#1C1917]/90 backdrop-blur-md border border-[#F59E0B]/40 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-lg">
                <span className="text-[#F59E0B]">Confirmed Price:</span> 2×2 at ₦2,000 &bull; 2×3 at ₦3,000
              </div>

              {/* Bottom tag inside image */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#1C1917]/95 backdrop-blur-md border border-[#44403C] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Roofing &amp; Bansaw Timber</h4>
                  <p className="text-xs text-[#A8A29E]">Straight cut, seasoned, ready for building</p>
                </div>
                <button
                  onClick={onOpenQuote}
                  className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Order Wood <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
