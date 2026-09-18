import React, { useState } from 'react';
import { Search, X, CheckCircle2, Clock, Truck, AlertCircle, Package } from 'lucide-react';
import { Order, QuoteRequest } from '../types';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  quotes: QuoteRequest[];
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  onClose,
  orders,
  quotes,
}) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const matchedOrders = orders.filter((o) =>
    o.phone.toLowerCase().includes(cleanQuery) ||
    o.id.toLowerCase().includes(cleanQuery) ||
    o.customer_name.toLowerCase().includes(cleanQuery)
  );

  const matchedQuotes = quotes.filter((q) =>
    q.phone.toLowerCase().includes(cleanQuery) ||
    q.id.toLowerCase().includes(cleanQuery) ||
    q.customer_name.toLowerCase().includes(cleanQuery)
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanQuery) return;
    setSearched(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">Pending Review</span>;
      case 'Confirmed':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full text-xs font-bold">Confirmed</span>;
      case 'Processing':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full text-xs font-bold">Processing Timber</span>;
      case 'Out for Delivery':
        return <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Truck className="w-3 h-3" /> Out for Delivery</span>;
      case 'Completed':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-xs font-bold">Cancelled</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E7E5E4] animate-in zoom-in-95 duration-200">
        
        <div className="bg-[#1C1917] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B] flex items-center justify-center text-[#1C1917]">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Track Order or Quote Status</h3>
              <p className="text-xs text-[#A8A29E]">Check dispatch &amp; fulfillment progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              placeholder="Enter your phone number or Order ID"
              className="flex-1 px-4 py-2.5 border border-[#D6D3D1] rounded-xl text-sm focus:ring-2 focus:ring-[#B45309] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#D97706] hover:bg-[#B45309] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow transition-all cursor-pointer"
            >
              Lookup
            </button>
          </form>

          {searched && (
            <div className="space-y-4">
              {matchedOrders.length === 0 && matchedQuotes.length === 0 ? (
                <div className="text-center py-8 bg-[#FAF8F5] rounded-2xl border border-[#E7E5E4] p-6">
                  <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#1C1917]">No records found for "{query}"</p>
                  <p className="text-xs text-[#78716C] mt-1">
                    Please ensure you typed the exact phone number used when submitting your quote or delivery request.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {matchedOrders.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Orders Found ({matchedOrders.length})</h4>
                      {matchedOrders.map((ord) => (
                        <div key={ord.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E5E4] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-[#1C1917]">{ord.product_name}</span>
                            {getStatusBadge(ord.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-[#57534E]">
                            <div><span className="text-stone-400">Qty:</span> {ord.quantity}</div>
                            <div><span className="text-stone-400">Delivery:</span> {ord.delivery_location}</div>
                            <div><span className="text-stone-400">Order ID:</span> <span className="font-mono">{ord.id}</span></div>
                            <div><span className="text-stone-400">Date:</span> {new Date(ord.created_at).toLocaleDateString()}</div>
                          </div>
                          {ord.notes && (
                            <div className="text-xs bg-white p-2 rounded-lg border text-stone-600 mt-1">
                              <strong>Note:</strong> {ord.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedQuotes.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Quote Requests Found ({matchedQuotes.length})</h4>
                      {matchedQuotes.map((q) => (
                        <div key={q.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E5E4] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-[#1C1917]">{q.product} ({q.size})</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              q.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              q.status === 'Contacted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {q.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-[#57534E]">
                            <div><span className="text-stone-400">Qty:</span> {q.quantity}</div>
                            <div><span className="text-stone-400">Location:</span> {q.delivery_location}</div>
                            <div><span className="text-stone-400">Quote ID:</span> <span className="font-mono">{q.id}</span></div>
                            <div><span className="text-stone-400">Submitted:</span> {new Date(q.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
