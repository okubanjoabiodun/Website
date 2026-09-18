import React, { useState, useEffect } from 'react';
import { X, FileText, Send, CheckCircle2, MessageCircle, Truck, Phone, User, MapPin } from 'lucide-react';
import { BusinessSettings } from '../types';
import { api } from '../services/api';
import { buildWhatsAppLink } from '../utils/formatters';
import { useToast } from './Toast';

interface QuoteModalProps {
  isOpen: boolean;
  initialProduct?: string;
  initialSize?: string;
  settings?: BusinessSettings;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  initialProduct = '',
  initialSize = '',
  settings,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [product, setProduct] = useState(initialProduct || '2×2 Roofing Wood');
  const [woodSize, setWoodSize] = useState(initialSize || '2×2');
  const [quantity, setQuantity] = useState('100 pieces');
  const [deliveryRequired, setDeliveryRequired] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialProduct) setProduct(initialProduct);
    if (initialSize) setWoodSize(initialSize);
  }, [initialProduct, initialSize]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !product.trim() || !quantity.trim()) {
      showToast('Please provide your name, phone, product, and quantity.', 'error');
      return;
    }
    if (deliveryRequired && !deliveryLocation.trim()) {
      showToast('Please specify your delivery location.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createQuote({
        customer_name: fullName,
        phone,
        whatsapp: whatsapp || phone,
        product,
        size: woodSize,
        quantity,
        delivery_required: deliveryRequired,
        delivery_location: deliveryRequired ? deliveryLocation : 'Self Pickup',
        message
      });

      setIsSubmitted(true);
      showToast('Thank you! Your quote request has been received. Toysn Wood and Super Cakes will contact you shortly.', 'success');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Error submitting quote. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappForwardUrl = buildWhatsAppLink(settings?.whatsapp, {
    product,
    size: woodSize,
    quantity,
    deliveryLocation: deliveryRequired ? deliveryLocation : 'Depot Pickup',
    customNote: `Customer: ${fullName} (${phone}). ${message}`
  });

  const resetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E7E5E4] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1C1917] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D97706] flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold uppercase tracking-tight">Request a Quote</h3>
              <p className="text-xs text-[#A8A29E]">Get confirmed prices &amp; delivery estimates</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-[#1C1917]">Quote Request Received!</h4>
                <p className="text-sm text-[#57534E] mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you! Your quote request has been received. <strong className="text-[#1C1917]">Toysn Wood and Super Cakes</strong> will contact you shortly.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E7E5E4] rounded-2xl p-4 text-xs text-left space-y-2 max-w-md mx-auto">
                <div className="flex justify-between"><span className="text-[#78716C]">Product:</span> <span className="font-bold">{product}</span></div>
                <div className="flex justify-between"><span className="text-[#78716C]">Wood Size:</span> <span className="font-bold">{woodSize}</span></div>
                <div className="flex justify-between"><span className="text-[#78716C]">Quantity:</span> <span className="font-bold">{quantity}</span></div>
                <div className="flex justify-between"><span className="text-[#78716C]">Destination:</span> <span className="font-bold">{deliveryRequired ? deliveryLocation : 'Depot Pickup'}</span></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={whatsappForwardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#15803D] hover:bg-[#166534] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Also Send to WhatsApp
                </a>
                <button
                  onClick={resetAndClose}
                  className="bg-[#1C1917] hover:bg-[#292524] text-white px-6 py-3 rounded-xl font-bold text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Oluwatosin Adeleke"
                      className="w-full pl-9 pr-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
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
                      className="w-full pl-9 pr-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                  WhatsApp Number (Optional, if different)
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. 080... or +234..."
                    className="w-full pl-9 pr-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                    Product *
                  </label>
                  <select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none bg-white font-medium"
                  >
                    <option value="2×2 Roofing Wood">2×2 Roofing Wood (₦2,000)</option>
                    <option value="2×3 Roofing Wood">2×3 Roofing Wood (₦3,000)</option>
                    <option value="2×4 Roofing Timber">2×4 Roofing Timber</option>
                    <option value="1×12 Wood Planks">1×12 (1*12) Wood Planks</option>
                    <option value="2×6 Roofing Wood & Fascia">2×6 Roofing Wood &amp; Fascia</option>
                    <option value="3×4 Heavy Timber Wood">3×4 Heavy Timber Wood</option>
                    <option value="Bansaw Wood">Bansaw Wood</option>
                    <option value="Other Roofing Wood">Other Roofing Wood</option>
                    <option value="Bulk Orders">Bulk Orders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                    Wood Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={woodSize}
                    onChange={(e) => setWoodSize(e.target.value)}
                    placeholder="e.g. 2×2, 2×4, 12ft length"
                    className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                  Quantity *
                </label>
                <input
                  type="text"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50 pieces, 20 bundles, 1 trailer"
                  className="w-full px-3 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-2">
                  Delivery Required?
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="quote-delivery"
                      checked={deliveryRequired === true}
                      onChange={() => setDeliveryRequired(true)}
                      className="accent-[#B45309] w-4 h-4"
                    />
                    Yes, deliver to location
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="quote-delivery"
                      checked={deliveryRequired === false}
                      onChange={() => setDeliveryRequired(false)}
                      className="accent-[#B45309] w-4 h-4"
                    />
                    No, I will pick up
                  </label>
                </div>
              </div>

              {deliveryRequired && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                    Delivery Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                    <textarea
                      required={deliveryRequired}
                      rows={2}
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="Construction site address, town, or state"
                      className="w-full pl-9 pr-3 py-2 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1">
                  Message / Special Notes
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Need advice on wood type, specific length cuts, or timetable..."
                  className="w-full px-3 py-2 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D97706] hover:bg-[#B45309] disabled:bg-stone-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  id="btn-submit-quote-request"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending Request...' : 'Submit Quote Request'}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
