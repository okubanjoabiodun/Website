import React, { useState } from 'react';
import { Truck, Package, MapPin, PhoneCall, Calendar, CheckCircle2, Send, Clock, ShieldCheck } from 'lucide-react';
import { BusinessSettings } from '../types';
import { api } from '../services/api';
import { useToast } from './Toast';

interface DeliverySectionProps {
  settings?: BusinessSettings;
  onSuccessOrder?: () => void;
}

export const DeliverySection: React.FC<DeliverySectionProps> = ({ settings, onSuccessOrder }) => {
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [product, setProduct] = useState('2×2 Roofing Wood');
  const [quantity, setQuantity] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !deliveryLocation.trim() || !quantity.trim()) {
      showToast('Please fill in your name, phone, quantity and delivery location.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createOrder({
        customer_name: customerName,
        phone,
        product_name: product,
        quantity,
        delivery_required: true,
        delivery_location: deliveryLocation,
        preferred_delivery_date: preferredDate,
        notes: instructions
      });

      setIsSubmitted(true);
      showToast('Delivery request submitted! Toysn Wood and Super Cakes will confirm your dispatch details shortly.', 'success');
      if (onSuccessOrder) onSuccessOrder();
    } catch (err: any) {
      showToast(err.message || 'Could not submit delivery request. Please check connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="delivery" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            Fast Site Logistics
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1917] tracking-tight uppercase font-['Plus_Jakarta_Sans']">
            We Deliver
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#57534E]">
            Order your wood materials and fresh cakes from Toysn Wood and Super Cakes and have them delivered directly to your site or doorstep.
          </p>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          
          <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#B45309]" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-[#1C1917]">🚚 Delivery Available</h4>
              <p className="text-xs text-[#78716C] mt-0.5">Prompt vehicle dispatch to sites</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-[#B45309]" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-[#1C1917]">📦 Bulk Orders Welcome</h4>
              <p className="text-xs text-[#78716C] mt-0.5">Truckloads &amp; commercial timber</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-[#B45309]" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-[#1C1917]">📍 Location Confirmed</h4>
              <p className="text-xs text-[#78716C] mt-0.5">Confirmed before dispatch</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 text-[#B45309]" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-[#1C1917]">📞 Easy Confirmation</h4>
              <p className="text-xs text-[#78716C] mt-0.5">Quick call/WhatsApp validation</p>
            </div>
          </div>

        </div>

        {/* Delivery Form Container */}
        <div className="bg-white rounded-3xl border border-[#E7E5E4] shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="bg-[#1C1917] px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#F59E0B]" />
              <span className="font-bold text-base">Request Wood Delivery to Your Site</span>
            </div>
            <span className="text-xs text-[#D6D3D1]">No hidden fees</span>
          </div>

          <div className="p-6 sm:p-10">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#1C1917]">Delivery Request Received!</h3>
                <p className="text-[#57534E] text-sm max-w-md mx-auto">
                  Thank you, <strong className="text-[#1C1917]">{customerName}</strong>. Our logistics manager will review your delivery address ({deliveryLocation}) and call you on <strong className="text-[#1C1917]">{phone}</strong> to confirm your vehicle schedule.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#1C1917] text-white px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer"
                >
                  Submit Another Delivery Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Note about delivery fees (do not invent fixed fee unless admin provides one) */}
                <div className="bg-[#FAF8F5] border border-[#E7E5E4] rounded-xl p-3.5 text-xs text-[#57534E] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                  <div>
                    {settings?.delivery_fee_note ? (
                      <span>{settings.delivery_fee_note}</span>
                    ) : (
                      <span>Delivery charges depend on site location distance, volume of wood, and vehicle required. Our dispatch manager confirms the exact delivery arrangement with you before vehicle loading.</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Mr. Babatunde / Site Manager"
                      className="w-full px-4 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 08012345678"
                      className="w-full px-4 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                      Wood Product *
                    </label>
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none bg-white font-medium"
                    >
                      <option value="2×2 Roofing Wood (₦2,000)">2×2 Roofing Wood (₦2,000)</option>
                      <option value="2×3 Roofing Wood (₦3,000)">2×3 Roofing Wood (₦3,000)</option>
                      <option value="2×4 Roofing Timber (Price on Request)">2×4 Roofing Timber (Price on Request)</option>
                      <option value="1×12 Wood Planks (Price on Request)">1×12 (1*12) Wood Planks (Price on Request)</option>
                      <option value="2×6 Roofing Wood & Fascia (Price on Request)">2×6 Roofing Wood &amp; Fascia</option>
                      <option value="3×4 Heavy Timber (Price on Request)">3×4 Heavy Timber</option>
                      <option value="Bansaw Wood (Price on Request)">Bansaw Wood (Price on Request)</option>
                      <option value="Bulk Construction Wood Supply">Bulk Construction Wood Supply</option>
                      <option value="Other Roofing Wood / Hardwood">Other Roofing Wood / Hardwood</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                      Quantity (Pieces / Bundles / Truckload) *
                    </label>
                    <input
                      type="text"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 50 pieces, 20 bundles, 1 truck"
                      className="w-full px-4 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                      Delivery Address / Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="Street, Landmark, Town, State"
                      className="w-full px-4 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                      Preferred Delivery Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                    Additional Instructions / Site Access
                  </label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Specific site directions, gate codes, unloading requirements or questions"
                    className="w-full px-4 py-2 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D97706] hover:bg-[#B45309] disabled:bg-stone-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  id="btn-submit-delivery-request"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting Request...' : 'Request Delivery'}
                </button>

              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
