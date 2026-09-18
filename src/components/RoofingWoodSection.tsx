import React from 'react';
import { Layers, ShieldCheck, Check, ArrowRight, FileText, PhoneCall } from 'lucide-react';
import { formatNaira } from '../utils/formatters';

interface RoofingWoodSectionProps {
  onOpenQuote: (productName?: string, size?: string) => void;
}

export const RoofingWoodSection: React.FC<RoofingWoodSectionProps> = ({ onOpenQuote }) => {
  const woodSizes = [
    {
      size: '2×2',
      title: '2×2 Roofing Wood',
      confirmedPrice: 2000,
      priceOnRequest: false,
      use: 'Ceiling batten, nogging & light structural roof framing',
      tag: 'Confirmed Price',
      image: '/images/wood_timber_stack.jpg'
    },
    {
      size: '2×3',
      title: '2×3 Roofing Wood',
      confirmedPrice: 3000,
      priceOnRequest: false,
      use: 'Purlins, ceiling joists & durable roof skeletal frames',
      tag: 'Confirmed Price',
      image: '/images/wood_timber_stack.jpg'
    },
    {
      size: '2×4',
      title: '2×4 Roofing Timber',
      confirmedPrice: null,
      priceOnRequest: true,
      use: 'Standard roof rafters, primary trusses & framework',
      tag: 'Price on Request',
      image: '/images/wood_timber_stack.jpg'
    },
    {
      size: '1×12',
      title: '1×12 (1*12) Wood Planks',
      confirmedPrice: null,
      priceOnRequest: true,
      use: 'Concrete formwork/decking, fascia boards, scaffolding & carpentry',
      tag: 'Price on Request',
      image: '/images/wood_planks_stack.jpg'
    },
    {
      size: '2×6',
      title: '2×6 Fascia & Rafter Timber',
      confirmedPrice: null,
      priceOnRequest: true,
      use: 'Fascia boards, heavy roof framework & load beams',
      tag: 'Price on Request',
      image: '/images/wood_timber_stack.jpg'
    },
    {
      size: '3×4',
      title: '3×4 Structural Timber',
      confirmedPrice: null,
      priceOnRequest: true,
      use: 'Heavy tie beams, wall plates & king post supports',
      tag: 'Price on Request',
      image: '/images/wood_timber_stack.jpg'
    },
    {
      size: 'Other',
      title: 'Other Roofing Wood & Hardwood',
      confirmedPrice: null,
      priceOnRequest: true,
      use: 'Custom millwork, Afara, Opepe, Mahogany & specials',
      tag: 'Price on Request',
      image: '/images/wood_planks_stack.jpg'
    }
  ];

  return (
    <section id="roofing-wood" className="py-16 sm:py-24 bg-[#1C1917] text-white relative overflow-hidden border-b border-[#292524]">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B45309]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 bg-[#292524] text-[#F59E0B] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-[#44403C]">
            <Layers className="w-3.5 h-3.5" />
            Specialized Building Timber
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase font-['Plus_Jakarta_Sans']">
            Roofing Wood
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#D6D3D1] leading-relaxed">
            We supply different types and sizes of roofing wood suitable for construction and roofing projects. From battens and purlins to heavy load-bearing rafters, Toysn Wood provides seasoned, straight-grained wood that ensures your roof stands strong for decades.
          </p>
        </div>

        {/* Roofing Wood Sizes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
          {woodSizes.map((item) => {
            const isConfirmed = !item.priceOnRequest && item.confirmedPrice !== null;
            return (
              <div
                key={item.size}
                className="bg-[#292524] rounded-2xl p-5 border border-[#38332E] hover:border-[#F59E0B]/50 transition-all shadow-md flex flex-col justify-between group"
              >
                <div>
                  {/* Real timber yard photo preview */}
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3.5 bg-stone-900 border border-[#38332E]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/90 via-[#1C1917]/20 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-xl font-black font-mono text-white group-hover:text-[#F59E0B] transition-colors drop-shadow">
                      {item.size}
                    </span>
                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm border ${
                      isConfirmed
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80'
                        : 'bg-[#1C1917]/90 text-[#D6D3D1] border-[#44403C]'
                    }`}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-[#A8A29E] leading-relaxed mb-4">{item.use}</p>
                </div>

                <div className="pt-3 border-t border-[#38332E] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Price</div>
                    <div className="text-base font-extrabold text-amber-400">
                      {isConfirmed ? formatNaira(item.confirmedPrice) : 'Price on Request'}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenQuote(item.title, item.size)}
                    className="bg-[#1C1917] hover:bg-[#D97706] text-white hover:text-white p-2.5 rounded-xl transition-all cursor-pointer group-hover:bg-[#D97706]"
                    title={`Request quote for ${item.size}`}
                    aria-label={`Request quote for ${item.size}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Callout Box */}
        <div className="bg-gradient-to-r from-[#292524] via-[#332A22] to-[#292524] border border-[#78350F]/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Need a specific size or quantity?
            </h3>
            <p className="text-sm text-[#D6D3D1] max-w-xl">
              Contact us for availability and current pricing. We accommodate custom project cuts, bulk contractor deliveries, and diverse timber species.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenQuote('Roofing Wood', 'Custom Size')}
              className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              id="cta-request-roofing-wood"
            >
              <FileText className="w-4 h-4" />
              Request Roofing Wood
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
