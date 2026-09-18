import React from 'react';
import { Scissors, MessageCircle, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BusinessSettings } from '../types';
import { buildWhatsAppLink } from '../utils/formatters';

interface BansawWoodSectionProps {
  settings?: BusinessSettings;
  onOpenQuote: (productName?: string, size?: string) => void;
}

export const BansawWoodSection: React.FC<BansawWoodSectionProps> = ({ settings, onOpenQuote }) => {
  const whatsappUrl = buildWhatsAppLink(settings?.whatsapp, {
    product: 'Bansaw Wood',
    size: 'Custom Specifications',
    quantity: 'Specify pieces'
  });

  return (
    <section id="bansaw-wood" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E7E5E4] shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Visual Image */}
            <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-full">
              <img
                src="/images/bansaw_wood_timber.jpg"
                alt="Toysn Wood Bansaw Wood"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-[#B45309] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  Industrial Millwork
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">Machine-Sawn Precision Timber</h3>
                <p className="text-xs text-stone-200 mt-1">Smoother faces, uniform widths and reduced wood wastage for your construction site.</p>
              </div>
            </div>

            {/* Content & Inquiry */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Scissors className="w-3.5 h-3.5" />
                  Bansaw Mill Cut Wood
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight uppercase font-['Plus_Jakarta_Sans']">
                  Bansaw Wood
                </h2>

                <p className="text-base text-[#57534E] leading-relaxed">
                  Quality bansaw wood for building, construction and other wood projects. Our bansaw timber is machine-sawn with narrow kerf bandsaw blades, delivering superior straightness, flat profiles, and exact sizing for builders, furniture makers, and roof contractors.
                </p>

                {/* Features list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-[#44403C]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Exact dimensional accuracy</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#44403C]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Even &amp; clean cut surfaces</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#44403C]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Heavy structural framing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#44403C]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Custom orders cut to order</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E5E4] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#78716C] uppercase font-bold block">Current Price</span>
                    <span className="text-2xl font-black text-[#B45309]">
                      Price on Request
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#78716C] block">Market Based Rates</span>
                    <span className="text-xs font-medium text-emerald-700">Immediate Quote Available</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E7E5E4] flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => onOpenQuote('Bansaw Wood', 'Custom Specifications')}
                  className="bg-[#D97706] hover:bg-[#B45309] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  id="btn-bansaw-request-price"
                >
                  <FileText className="w-4 h-4" />
                  Request Price
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#15803D] hover:bg-[#166534] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  id="btn-bansaw-whatsapp"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
