import React, { useState } from 'react';
import { Cake, Sparkles, Heart, Clock, MapPin, Phone, User, Calendar, Send, CheckCircle2, MessageCircle, X } from 'lucide-react';
import { BakingProduct, BusinessSettings } from '../types';
import { formatNaira, buildWhatsAppLink } from '../utils/formatters';
import { api } from '../services/api';
import { useToast } from './Toast';

interface BakingSectionProps {
  bakingProducts: BakingProduct[];
  settings?: BusinessSettings;
  onOrderSubmitted?: () => void;
}

export const BakingSection: React.FC<BakingSectionProps> = ({
  bakingProducts,
  settings,
  onOrderSubmitted
}) => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<BakingProduct | null>(null);

  // Form states inside order modal
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cakeSize, setCakeSize] = useState('8 inches / Standard');
  const [preferredDate, setPreferredDate] = useState('');
  const [deliveryRequired, setDeliveryRequired] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    'All',
    'Birthday Cakes',
    'Celebration Cakes',
    'Wedding/Event Cakes',
    'Pastries',
    'Custom Cakes',
    'Other Baked Items'
  ];

  const filteredItems = bakingProducts.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handleOpenOrder = (item: BakingProduct) => {
    setActiveModalItem(item);
    setIsSubmitted(false);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !activeModalItem) {
      showToast('Please provide your name and phone number.', 'error');
      return;
    }
    if (deliveryRequired && !deliveryLocation.trim()) {
      showToast('Please provide your delivery location.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createBakingOrder({
        customer_name: customerName,
        phone,
        product: activeModalItem.name,
        quantity,
        cake_size: cakeSize,
        preferred_date: preferredDate,
        delivery_required: deliveryRequired,
        delivery_location: deliveryRequired ? deliveryLocation : 'Depot / Bakery Pickup',
        special_instructions: specialInstructions
      });

      setIsSubmitted(true);
      showToast('Your baking order has been placed! Super Cakes will reach out shortly.', 'success');
      if (onOrderSubmitted) onOrderSubmitted();
    } catch (err: any) {
      showToast(err.message || 'Failed to place baking order.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappBakeUrl = activeModalItem
    ? buildWhatsAppLink(settings?.whatsapp, {
        product: `Super Cakes: ${activeModalItem.name}`,
        size: cakeSize,
        quantity,
        deliveryLocation: deliveryRequired ? deliveryLocation : 'Pickup',
        customNote: `Customer: ${customerName || 'Customer'} (${phone}). ${specialInstructions}`
      })
    : '';

  return (
    <section id="baking" className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E7E5E4] relative overflow-hidden">
      {/* Decorative subtle background shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#FDE68A]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FBCFE8]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FDF2F8] text-[#BE185D] border border-[#FBCFE8] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-[#BE185D]" />
            Super Cakes &amp; Bakery Services
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1917] tracking-tight uppercase font-['Plus_Jakarta_Sans']">
            Freshly Baked With Love
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#78716C] leading-relaxed">
            In addition to premium wood and timber from Toysn Wood, Super Cakes proudly offers artisanal custom cakes, celebration cakes and delicious pastries crafted with top-shelf ingredients.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[#BE185D] text-white shadow-md'
                    : 'bg-white text-[#78716C] hover:text-[#1C1917] hover:bg-white/80 border border-[#E7E5E4]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Baking Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const displayPrice = formatNaira(item.price, item.price_on_request);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#F3E8DF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-56 bg-[#F5F2EB] overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#BE185D] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#78350F] text-[11px] font-bold px-2.5 py-1 rounded-lg border border-[#FDE68A] shadow-sm">
                    {item.availability}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1C1917] group-hover:text-[#BE185D] transition-colors mb-1.5">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F5F2EB] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#78716C] block">Price</span>
                      <span className="text-sm font-extrabold text-[#BE185D]">
                        {displayPrice}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenOrder(item)}
                      className="bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Cake className="w-4 h-4" />
                      Order Cake / Pastry
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Baking Order Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#FBCFE8] animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="p-8 sm:p-10 text-center space-y-5">
                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#1C1917]">Baking Order Received!</h3>
                <p className="text-[#57534E] text-sm leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong className="text-[#1C1917]">{customerName}</strong>! Your order for <strong className="text-[#1C1917]">{activeModalItem.name}</strong> has been logged. Our baker will call <strong className="text-[#1C1917]">{phone}</strong> to confirm flavors, designs, and delivery.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    href={whatsappBakeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#15803D] hover:bg-[#166534] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Confirm on WhatsApp
                  </a>
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="bg-[#1C1917] text-white px-6 py-3 rounded-xl font-bold text-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-[#BE185D] px-6 py-4 text-white">
                  <span className="text-xs uppercase tracking-widest text-pink-200 font-semibold block">Super Cakes Order</span>
                  <h3 className="text-xl font-extrabold">{activeModalItem.name}</h3>
                </div>

                <form onSubmit={handleOrderSubmit} className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#57534E] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Customer name"
                        className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#BE185D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#57534E] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 080..."
                        className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#BE185D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#57534E] mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#BE185D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#57534E] mb-1">
                        Cake Size / Weight
                      </label>
                      <input
                        type="text"
                        value={cakeSize}
                        onChange={(e) => setCakeSize(e.target.value)}
                        placeholder="e.g. 8 inches, 2 tiers, 10 inches"
                        className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#BE185D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#57534E] mb-1">
                      Preferred Date / Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#BE185D] focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#57534E] mb-1">
                      Fulfillment Option
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="bake-delivery"
                          checked={deliveryRequired === true}
                          onChange={() => setDeliveryRequired(true)}
                          className="accent-[#BE185D]"
                        />
                        Deliver to location
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="bake-delivery"
                          checked={deliveryRequired === false}
                          onChange={() => setDeliveryRequired(false)}
                          className="accent-[#BE185D]"
                        />
                        Pick up at shop
                      </label>
                    </div>
                  </div>

                  {deliveryRequired && (
                    <div>
                      <label className="block text-xs font-bold text-[#57534E] mb-1">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        required={deliveryRequired}
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        placeholder="Party venue or house address"
                        className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#BE185D] focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#57534E] mb-1">
                      Special Instructions / Message on Cake
                    </label>
                    <textarea
                      rows={2}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Flavor (Vanilla, Red Velvet, Chocolate), inscriptions ('Happy 40th Birthday'), colors..."
                      className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#BE185D] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#BE185D] hover:bg-[#9D174D] disabled:bg-stone-400 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Placing Order...' : 'Submit Baking Order'}
                  </button>

                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
