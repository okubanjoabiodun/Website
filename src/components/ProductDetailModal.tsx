import React, { useState } from 'react';
import { X, MessageCircle, FileText, CheckCircle2, Truck, MapPin, Phone, User, Send, Minus, Plus } from 'lucide-react';
import { Product, BusinessSettings } from '../types';
import { formatNaira, buildWhatsAppLink } from '../utils/formatters';
import { api } from '../services/api';
import { useToast } from './Toast';

interface ProductDetailModalProps {
  product: Product | null;
  settings?: BusinessSettings;
  onClose: () => void;
  onSuccessOrder: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  settings,
  onClose,
  onSuccessOrder,
}) => {
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState<number>(10);
  const [deliveryRequired, setDeliveryRequired] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  if (!product) return null;

  const isBulk = product.id === 'prod-bulk' || product.name.toLowerCase().includes('bulk');
  const priceDisplay = isBulk
    ? 'Contact us for bulk pricing'
    : formatNaira(product.price, product.price_on_request);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      showToast('Please provide your name and phone number.', 'error');
      return;
    }
    if (deliveryRequired && !deliveryLocation.trim()) {
      showToast('Please enter your delivery location/address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createOrder({
        customer_name: customerName,
        phone,
        product_id: product.id,
        product_name: product.name,
        size: product.size,
        quantity: `${quantity} pieces`,
        delivery_required: deliveryRequired,
        delivery_location: deliveryRequired ? deliveryLocation : 'Customer Pickup at Depot',
        notes: message || 'Direct order from product details modal'
      });

      // Also register as a quote request for complete tracking
      await api.createQuote({
        customer_name: customerName,
        phone,
        product: product.name,
        size: product.size,
        quantity: `${quantity} pieces`,
        delivery_required: deliveryRequired,
        delivery_location: deliveryRequired ? deliveryLocation : 'Depot Pickup',
        message: message ? `${message} (Order initiated)` : 'Order submitted from product details modal'
      });

      setOrderSubmitted(true);
      showToast('Your wood request has been received! Toysn Wood and Super Cakes will contact you shortly.', 'success');
      onSuccessOrder();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit request. Please try again or message via WhatsApp.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const directWhatsAppUrl = buildWhatsAppLink(settings?.whatsapp, {
    product: product.name,
    size: product.size,
    quantity: `${quantity} pieces`,
    deliveryLocation: deliveryLocation || 'Will provide location',
    customNote: message
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E7E5E4] animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {orderSubmitted ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#1C1917]">Request Received!</h3>
              <p className="text-[#57534E] text-sm mt-2 max-w-md mx-auto">
                Thank you, <strong className="text-[#1C1917]">{customerName}</strong>. Your request for <strong className="text-[#1C1917]">{quantity} pcs of {product.name}</strong> has been saved.
                Toysn Wood and Super Cakes will call you shortly to confirm your order and delivery arrangements.
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E7E5E4] rounded-2xl p-4 text-left text-xs space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between"><span className="text-stone-500">Product:</span> <span className="font-bold">{product.name} ({product.size})</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Quantity:</span> <span className="font-bold">{quantity} pcs</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Phone:</span> <span className="font-bold">{phone}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Delivery:</span> <span className="font-bold">{deliveryRequired ? deliveryLocation : 'Depot Pickup'}</span></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#15803D] hover:bg-[#166534] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Forward to WhatsApp
              </a>
              <button
                onClick={onClose}
                className="bg-[#1C1917] hover:bg-[#292524] text-white px-6 py-3 rounded-xl font-bold text-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Top Product Showcase */}
            <div className="relative h-56 sm:h-64 bg-[#292524]">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#D97706] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-mono px-2 py-0.5 rounded">
                    {product.size}
                  </span>
                  <span className="bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                    {product.availability}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
                <p className="text-amber-300 font-extrabold text-lg mt-0.5">
                  {priceDisplay}
                </p>
              </div>
            </div>

            {/* Modal Body Form */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Description</h4>
                <p className="text-sm text-[#44403C] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Pricing rule info banner */}
              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3 text-xs text-[#78350F] leading-snug">
                Prices may change according to wood type, size, quantity and current market conditions. Contact Toysn Wood and Super Cakes for the latest price.
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                
                {/* Quantity selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2">
                    Quantity (Pieces / Bundles)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#D6D3D1] rounded-xl overflow-hidden bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-5)}
                        className="px-3.5 py-2.5 bg-[#FAF8F5] hover:bg-[#E7E5E4] text-[#1C1917] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center font-bold text-sm text-[#1C1917] focus:outline-none py-2"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(5)}
                        className="px-3.5 py-2.5 bg-[#FAF8F5] hover:bg-[#E7E5E4] text-[#1C1917] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-[#78716C]">Adjust or type exact count</span>
                  </div>
                </div>

                {/* Delivery Option */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2">
                    Fulfillment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryRequired(true)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                        deliveryRequired
                          ? 'border-[#B45309] bg-[#FEF3C7] text-[#78350F] shadow-sm'
                          : 'border-[#E7E5E4] bg-white text-[#57534E]'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-[#B45309]" />
                      Site Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryRequired(false)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                        !deliveryRequired
                          ? 'border-[#B45309] bg-[#FEF3C7] text-[#78350F] shadow-sm'
                          : 'border-[#E7E5E4] bg-white text-[#57534E]'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-[#B45309]" />
                      Self Pickup at Depot
                    </button>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Engineer Adeleke"
                        className="w-full pl-9 pr-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm text-[#1C1917] focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
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
                        className="w-full pl-9 pr-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm text-[#1C1917] focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {deliveryRequired && (
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      Delivery Location / Site Address *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                      <textarea
                        required={deliveryRequired}
                        rows={2}
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        placeholder="Enter building site address, landmark, or city"
                        className="w-full pl-9 pr-3 py-2 border border-[#D6D3D1] rounded-xl text-sm text-[#1C1917] focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">
                    Additional Message (Optional)
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specific length, timber grade, or questions"
                    className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm text-[#1C1917] focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                  />
                </div>

                {/* Submit & WhatsApp buttons */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#D97706] hover:bg-[#B45309] disabled:bg-stone-400 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>

                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#15803D] hover:bg-[#166534] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
