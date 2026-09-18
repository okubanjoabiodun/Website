import React, { useState, useMemo } from 'react';
import { Search, Filter, MessageCircle, FileText, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { Product, BusinessSettings } from '../types';
import { formatNaira, buildWhatsAppLink } from '../utils/formatters';

interface ProductsSectionProps {
  products: Product[];
  settings?: BusinessSettings;
  onSelectProduct: (product: Product) => void;
  onOpenQuote: (productName?: string, size?: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  settings,
  onSelectProduct,
  onOpenQuote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Roofing Wood', 'Planks', 'Bansaw Wood', 'Other Timber'];

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.size.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        // support both 'x' and '×' characters for searches like "2x4" and "2×4"
        item.name.replace(/×/g, 'x').toLowerCase().includes(term.replace(/×/g, 'x')) ||
        item.size.replace(/×/g, 'x').toLowerCase().includes(term.replace(/×/g, 'x'));

      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  return (
    <section id="products" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#B45309] uppercase bg-[#FEF3C7] px-3.5 py-1.5 rounded-full inline-block mb-3 border border-[#FDE68A]">
            Direct Timber Supply
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1917] tracking-tight uppercase font-['Plus_Jakarta_Sans']">
            Our Wood Products
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#57534E]">
            Quality wood for roofing, construction and building projects.
          </p>
        </div>

        {/* Pricing disclaimer note rule */}
        <div className="mb-10 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm max-w-4xl mx-auto">
          <Info className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#78350F] leading-relaxed">
            <strong className="font-bold text-[#92400E]">Official Pricing Policy: </strong>
            Prices may change according to wood type, size, quantity and current market conditions. Contact Toysn Wood and Super Cakes for the latest price. Confirmed prices are displayed for 2×2 (₦2,000) and 2×3 (₦3,000); all other sizes are provided on request to give you the most accurate real-time quote.
          </div>
        </div>

        {/* Search & Category Filter bar */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 2×2, 2×3, 2×4, roofing wood, planks, bansaw..."
              className="w-full bg-white border border-[#D6D3D1] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#B45309] focus:border-transparent shadow-sm"
              id="product-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 bg-stone-100 rounded-md px-1.5 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1C1917] text-white shadow-md'
                      : 'bg-white text-[#57534E] hover:text-[#1C1917] hover:bg-[#E7E5E4] border border-[#E7E5E4]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E5E4] p-8 max-w-md mx-auto shadow-sm">
            <AlertCircle className="w-12 h-12 text-[#A8A29E] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#1C1917]">No products match your search</h3>
            <p className="text-sm text-[#78716C] mt-1 mb-4">
              Try searching for "2x2", "2x4", "Roofing", or clear your filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="bg-[#D97706] text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const whatsappLink = buildWhatsAppLink(settings?.whatsapp, {
                product: product.name,
                size: product.size,
                quantity: '1 bundle / pieces'
              });

              const isBulk = product.id === 'prod-bulk' || product.name.toLowerCase().includes('bulk');
              const displayPrice = isBulk
                ? 'Contact us for bulk pricing'
                : formatNaira(product.price, product.price_on_request);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E7E5E4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  id={`product-card-${product.id}`}
                >
                  {/* Image container */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative h-56 bg-[#F5F5F4] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Category pill */}
                    <div className="absolute top-3 left-3 bg-[#1C1917]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
                      {product.category}
                    </div>

                    {/* Availability pill */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm ${
                        product.availability === 'In Stock'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : product.availability === 'Low Stock'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-stone-100 text-stone-800 border border-stone-300'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {product.availability}
                      </span>
                    </div>

                    {/* View details banner on hover */}
                    <div className="absolute bottom-3 left-3 right-3 text-center bg-white/95 text-[#1C1917] py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 shadow-md">
                      View Details &amp; Custom Order <ExternalLink className="w-3.5 h-3.5 text-[#B45309]" />
                    </div>
                  </div>

                  {/* Body content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="text-lg font-bold text-[#1C1917] group-hover:text-[#B45309] transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h3>
                        {product.size && (
                          <span className="text-xs font-mono font-bold bg-[#F5F2EB] text-[#78350F] px-2 py-0.5 rounded border border-[#E7E0D3]">
                            {product.size}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-[#78716C] line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-3 border-t border-[#F5F2EB] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#78716C] font-medium">Price:</span>
                        <span className={`font-extrabold ${
                          product.price_on_request || !product.price
                            ? 'text-[#B45309] text-sm'
                            : 'text-[#1C1917] text-lg'
                        }`}>
                          {displayPrice}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onOpenQuote(product.name, product.size)}
                          className="w-full bg-[#1C1917] hover:bg-[#292524] text-white py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                          id={`btn-quote-${product.id}`}
                        >
                          <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
                          Request Quote
                        </button>

                        <a
                          href={settings?.whatsapp ? whatsappLink : '#quote'}
                          onClick={(e) => {
                            if (!settings?.whatsapp) {
                              e.preventDefault();
                              onOpenQuote(product.name, product.size);
                            }
                          }}
                          target={settings?.whatsapp ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="w-full bg-[#15803D] hover:bg-[#166534] text-white py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                          id={`btn-wa-${product.id}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
