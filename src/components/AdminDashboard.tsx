import React, { useState } from 'react';
import { 
  Trees, 
  Package, 
  Cake, 
  Truck, 
  FileText, 
  Mail, 
  Settings, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  MessageCircle, 
  Save, 
  RefreshCw, 
  ExternalLink,
  Phone,
  MapPin,
  Clock,
  Eye
} from 'lucide-react';
import { 
  Product, 
  BakingProduct, 
  Order, 
  QuoteRequest, 
  ContactMessage, 
  BusinessSettings 
} from '../types';
import { api } from '../services/api';
import { formatNaira, buildWhatsAppLink } from '../utils/formatters';
import { useToast } from './Toast';

interface AdminDashboardProps {
  token: string;
  settings: BusinessSettings;
  products: Product[];
  bakingProducts: BakingProduct[];
  orders: Order[];
  quotes: QuoteRequest[];
  contacts: ContactMessage[];
  onRefreshData: () => Promise<void>;
  onLogout: () => void;
  onClose: () => void;
}

type TabType = 'orders' | 'quotes' | 'products' | 'baking' | 'messages' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  settings,
  products,
  bakingProducts,
  orders,
  quotes,
  contacts,
  onRefreshData,
  onLogout,
  onClose,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<BusinessSettings>({ ...settings });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Product editing / creation state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [prodForm, setProdForm] = useState<Partial<Product>>({});

  // Baking editing / creation state
  const [editingBaking, setEditingBaking] = useState<BakingProduct | null>(null);
  const [isNewBaking, setIsNewBaking] = useState(false);
  const [bakingForm, setBakingForm] = useState<Partial<BakingProduct>>({});

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshData();
    setIsRefreshing(false);
    showToast('Dashboard data updated', 'info');
  };

  // --- Orders Handlers ---
  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await api.updateOrderStatus(id, status, undefined, token);
      showToast(`Order marked as ${status}`, 'success');
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // --- Quotes Handlers ---
  const handleUpdateQuoteStatus = async (id: string, status: QuoteRequest['status']) => {
    try {
      await api.updateQuoteStatus(id, status, token);
      showToast(`Quote marked as ${status}`, 'success');
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update quote status', 'error');
    }
  };

  // --- Settings Handlers ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.updateSettings(settingsForm, token);
      showToast('Business settings successfully saved!', 'success');
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // --- Product Handlers ---
  const handleOpenNewProduct = () => {
    setIsNewProduct(true);
    setEditingProduct(null);
    setProdForm({
      name: '',
      size: '2×2',
      category: 'Roofing Wood',
      price: 2000,
      price_on_request: false,
      description: '',
      image_url: '/images/wood_timber_stack.jpg',
      availability: 'In Stock'
    });
  };

  const handleOpenEditProduct = (prod: Product) => {
    setIsNewProduct(false);
    setEditingProduct(prod);
    setProdForm({ ...prod });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNewProduct) {
        await api.createProduct(prodForm as any, token);
        showToast('Wood product created successfully', 'success');
      } else if (editingProduct) {
        await api.updateProduct(editingProduct.id, prodForm, token);
        showToast('Wood product updated successfully', 'success');
      }
      setEditingProduct(null);
      setIsNewProduct(false);
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id, token);
      showToast('Product deleted', 'success');
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // --- Baking Handlers ---
  const handleOpenNewBaking = () => {
    setIsNewBaking(true);
    setEditingBaking(null);
    setBakingForm({
      name: '',
      category: 'Birthday Cakes',
      price: null,
      price_on_request: true,
      description: '',
      image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      availability: 'Made to Order'
    });
  };

  const handleOpenEditBaking = (item: BakingProduct) => {
    setIsNewBaking(false);
    setEditingBaking(item);
    setBakingForm({ ...item });
  };

  const handleSaveBaking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNewBaking) {
        await api.createBakingProduct(bakingForm as any, token);
        showToast('Baking item created', 'success');
      } else if (editingBaking) {
        await api.updateBakingProduct(editingBaking.id, bakingForm, token);
        showToast('Baking item updated', 'success');
      }
      setEditingBaking(null);
      setIsNewBaking(false);
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save baking item', 'error');
    }
  };

  const handleDeleteBaking = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this baking item?')) return;
    try {
      await api.deleteBakingProduct(id, token);
      showToast('Baking item removed', 'success');
      await onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove baking item', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0C0A09] text-white flex flex-col overflow-hidden">
      
      {/* Top Bar */}
      <header className="bg-[#1C1917] border-b border-[#292524] px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D97706] text-white flex items-center justify-center font-bold">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg uppercase tracking-tight">TOYSN WOOD &amp; SUPER CAKES</span>
              <span className="bg-[#D97706]/20 text-[#F59E0B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D97706]/40">
                Toys Admin
              </span>
            </div>
            <p className="text-[11px] text-[#A8A29E] hidden sm:block">
              Manage inventory, prices, delivery orders &amp; contact info
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 bg-[#292524] hover:bg-[#38332E] text-[#D6D3D1] hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-[#292524] hover:bg-[#38332E] text-[#D6D3D1] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            View Website
          </button>

          <button
            onClick={onLogout}
            className="p-2 bg-red-950/70 hover:bg-red-900 border border-red-800/80 text-red-200 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Sign out of Admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#141211] border-r border-[#292524] p-3 sm:p-4 shrink-0 flex md:flex-col overflow-x-auto md:overflow-y-auto gap-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#D97706] text-white shadow'
                : 'text-[#A8A29E] hover:text-white hover:bg-[#1C1917]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4" />
              <span>Orders &amp; Deliveries</span>
            </div>
            <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-[#D97706] text-white shadow'
                : 'text-[#A8A29E] hover:text-white hover:bg-[#1C1917]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>Quote Requests</span>
            </div>
            <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {quotes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#D97706] text-white shadow'
                : 'text-[#A8A29E] hover:text-white hover:bg-[#1C1917]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Wood Products</span>
            </div>
            <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('baking')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'baking'
                ? 'bg-[#BE185D] text-white shadow'
                : 'text-[#A8A29E] hover:text-white hover:bg-[#1C1917]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Cake className="w-4 h-4" />
              <span>Baking Items</span>
            </div>
            <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {bakingProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-[#D97706] text-white shadow'
                : 'text-[#A8A29E] hover:text-white hover:bg-[#1C1917]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4" />
              <span>Contact Messages</span>
            </div>
            <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {contacts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#D97706] text-white shadow'
                : 'text-[#A8A29E] hover:text-white hover:bg-[#1C1917]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Business Settings</span>
            </div>
          </button>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 bg-[#1C1917] p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* ================= TAB 1: ORDERS & DELIVERIES ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Orders &amp; Delivery Requests</h2>
                  <p className="text-xs text-[#A8A29E]">Manage customer orders, site delivery addresses and logistics status</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="bg-[#292524] rounded-2xl border border-[#38332E] p-12 text-center text-[#A8A29E]">
                  <Truck className="w-12 h-12 mx-auto mb-3 text-stone-500" />
                  <p className="font-bold text-base text-white">No orders placed yet</p>
                  <p className="text-xs mt-1">Orders submitted from product cards or the "We Deliver" section will show here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    const waLink = buildWhatsAppLink(ord.phone, {
                      product: ord.product_name,
                      quantity: ord.quantity,
                      customNote: `Hello ${ord.customer_name}, this is Toysn Wood and Super Cakes regarding your order #${ord.id}.`
                    });

                    return (
                      <div key={ord.id} className="bg-[#292524] border border-[#38332E] rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#38332E]">
                          <div>
                            <span className="text-[11px] text-[#A8A29E] font-mono">Order ID: {ord.id}</span>
                            <h3 className="text-lg font-bold text-white">{ord.customer_name}</h3>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#A8A29E]">Status:</span>
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                              className="bg-[#1C1917] border border-[#44403C] text-xs font-bold rounded-lg px-2.5 py-1 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-[#A8A29E] block">Product</span>
                            <span className="font-bold text-white text-sm">{ord.product_name}</span>
                            {ord.size && <span className="text-[11px] text-amber-400 block font-mono">{ord.size}</span>}
                          </div>
                          <div>
                            <span className="text-[#A8A29E] block">Quantity</span>
                            <span className="font-bold text-white text-sm">{ord.quantity}</span>
                          </div>
                          <div>
                            <span className="text-[#A8A29E] block">Delivery Location</span>
                            <span className="font-semibold text-white">{ord.delivery_location}</span>
                          </div>
                          <div>
                            <span className="text-[#A8A29E] block">Contact Phone</span>
                            <a href={`tel:${ord.phone}`} className="font-bold text-amber-400 hover:underline">
                              {ord.phone}
                            </a>
                          </div>
                        </div>

                        {ord.preferred_delivery_date && (
                          <div className="text-xs text-[#D6D3D1] flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>Preferred Delivery Date: <strong>{ord.preferred_delivery_date}</strong></span>
                          </div>
                        )}

                        {ord.notes && (
                          <div className="bg-[#1C1917] p-3 rounded-xl border border-[#38332E] text-xs text-[#D6D3D1]">
                            <strong className="text-amber-400">Customer Note:</strong> {ord.notes}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-[#A8A29E]">
                          <span>Received: {new Date(ord.created_at).toLocaleString()}</span>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#15803D] hover:bg-[#166534] text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Message Customer on WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: QUOTE REQUESTS ================= */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Price Quote Requests</h2>
                  <p className="text-xs text-[#A8A29E]">Incoming requests for custom timber sizes, bansaw cuts, and large orders</p>
                </div>
              </div>

              {quotes.length === 0 ? (
                <div className="bg-[#292524] rounded-2xl border border-[#38332E] p-12 text-center text-[#A8A29E]">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-stone-500" />
                  <p className="font-bold text-base text-white">No quote requests yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quotes.map((q) => {
                    const waLink = buildWhatsAppLink(q.whatsapp || q.phone, {
                      product: q.product,
                      size: q.size,
                      quantity: q.quantity,
                      customNote: `Hello ${q.customer_name}, this is Toysn Wood and Super Cakes replying with your requested price quote.`
                    });

                    return (
                      <div key={q.id} className="bg-[#292524] border border-[#38332E] rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#38332E]">
                          <div>
                            <span className="text-[11px] text-[#A8A29E] font-mono">Quote ID: {q.id}</span>
                            <h3 className="text-lg font-bold text-white">{q.customer_name}</h3>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#A8A29E]">Status:</span>
                            <select
                              value={q.status}
                              onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value as any)}
                              className="bg-[#1C1917] border border-[#44403C] text-xs font-bold rounded-lg px-2.5 py-1 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-[#A8A29E] block">Product &amp; Size</span>
                            <span className="font-bold text-white text-sm">{q.product}</span>
                            <span className="text-[11px] text-amber-400 block font-mono">{q.size}</span>
                          </div>
                          <div>
                            <span className="text-[#A8A29E] block">Quantity</span>
                            <span className="font-bold text-white text-sm">{q.quantity}</span>
                          </div>
                          <div>
                            <span className="text-[#A8A29E] block">Delivery Location</span>
                            <span className="font-semibold text-white">{q.delivery_location || 'Pickup'}</span>
                          </div>
                          <div>
                            <span className="text-[#A8A29E] block">Phone / WhatsApp</span>
                            <span className="font-bold text-amber-400">{q.phone}</span>
                            {q.whatsapp && q.whatsapp !== q.phone && (
                              <span className="text-[10px] text-[#A8A29E] block">WA: {q.whatsapp}</span>
                            )}
                          </div>
                        </div>

                        {q.message && (
                          <div className="bg-[#1C1917] p-3 rounded-xl border border-[#38332E] text-xs text-[#D6D3D1]">
                            <strong className="text-amber-400">Customer Note:</strong> {q.message}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-[#A8A29E]">
                          <span>Submitted: {new Date(q.created_at).toLocaleString()}</span>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#15803D] hover:bg-[#166534] text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Send Quote on WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: WOOD PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Wood Inventory &amp; Pricing</h2>
                  <p className="text-xs text-[#A8A29E]">
                    Update 2×2 Wood (₦2,000), 2×3 Wood (₦3,000), or toggle "Price on Request"
                  </p>
                </div>
                <button
                  onClick={handleOpenNewProduct}
                  className="bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Wood Product
                </button>
              </div>

              {/* Product Edit / Create Modal or Card */}
              {(isNewProduct || editingProduct) && (
                <div className="bg-[#292524] border-2 border-[#D97706] rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#38332E]">
                    <h3 className="font-extrabold text-white text-base">
                      {isNewProduct ? 'Add New Wood Product' : `Edit: ${editingProduct?.name}`}
                    </h3>
                    <button
                      onClick={() => {
                        setIsNewProduct(false);
                        setEditingProduct(null);
                      }}
                      className="text-stone-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#A8A29E] mb-1">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={prodForm.name || ''}
                          onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#A8A29E] mb-1">Wood Size *</label>
                        <input
                          type="text"
                          required
                          value={prodForm.size || ''}
                          onChange={(e) => setProdForm({ ...prodForm, size: e.target.value })}
                          className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#A8A29E] mb-1">Category *</label>
                        <select
                          value={prodForm.category || 'Roofing Wood'}
                          onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                        >
                          <option value="Roofing Wood">Roofing Wood</option>
                          <option value="Planks">Planks</option>
                          <option value="Timber">Timber</option>
                          <option value="Bansaw Wood">Bansaw Wood</option>
                          <option value="Building Wood">Building Wood</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <div>
                        <label className="block text-xs font-bold text-[#A8A29E] mb-1">Price in Naira (₦)</label>
                        <input
                          type="number"
                          disabled={prodForm.price_on_request}
                          value={prodForm.price ?? ''}
                          onChange={(e) => setProdForm({ ...prodForm, price: parseInt(e.target.value) || 0 })}
                          placeholder="e.g. 2000"
                          className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white disabled:opacity-40"
                        />
                      </div>

                      <div className="pt-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-amber-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prodForm.price_on_request || false}
                            onChange={(e) => setProdForm({ ...prodForm, price_on_request: e.target.checked })}
                            className="w-4 h-4 accent-[#D97706]"
                          />
                          Price on Request (no fixed price)
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#A8A29E] mb-1">Stock Availability</label>
                        <select
                          value={prodForm.availability || 'In Stock'}
                          onChange={(e) => setProdForm({ ...prodForm, availability: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Available on Order">Available on Order</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8A29E] mb-1">Image URL</label>
                      <input
                        type="url"
                        value={prodForm.image_url || ''}
                        onChange={(e) => setProdForm({ ...prodForm, image_url: e.target.value })}
                        className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8A29E] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={prodForm.description || ''}
                        onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewProduct(false);
                          setEditingProduct(null);
                        }}
                        className="px-4 py-2 bg-[#1C1917] hover:bg-[#38332E] text-white rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#D97706] hover:bg-[#B45309] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-[#292524] rounded-2xl border border-[#38332E] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#D6D3D1]">
                    <thead className="bg-[#1C1917] text-[#A8A29E] uppercase font-bold border-b border-[#38332E]">
                      <tr>
                        <th className="p-3.5">Product</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Size</th>
                        <th className="p-3.5">Current Price</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#38332E]">
                      {products.map((p) => {
                        const priceDisplay = formatNaira(p.price, p.price_on_request);

                        return (
                          <tr key={p.id} className="hover:bg-[#302B27] transition-colors">
                            <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                              <img src={p.image_url} alt="" className="w-8 h-8 rounded-lg object-cover bg-black shrink-0" />
                              <span>{p.name}</span>
                            </td>
                            <td className="p-3.5">{p.category}</td>
                            <td className="p-3.5 font-mono text-amber-400">{p.size}</td>
                            <td className="p-3.5 font-bold text-white">{priceDisplay}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.availability === 'In Stock' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-stone-800 text-stone-300'
                              }`}>
                                {p.availability}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 bg-[#1C1917] hover:bg-amber-600 text-white rounded-lg transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 bg-[#1C1917] hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 4: BAKING ITEMS ================= */}
          {activeTab === 'baking' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Super Cakes Menu</h2>
                  <p className="text-xs text-[#A8A29E]">Manage celebration cakes, wedding cakes, pastries and prices</p>
                </div>
                <button
                  onClick={handleOpenNewBaking}
                  className="bg-[#BE185D] hover:bg-[#9D174D] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Baking Item
                </button>
              </div>

              {/* Baking form */}
              {(isNewBaking || editingBaking) && (
                <div className="bg-[#292524] border-2 border-[#BE185D] rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#38332E]">
                    <h3 className="font-extrabold text-white text-base">
                      {isNewBaking ? 'Add New Baking Item' : `Edit: ${editingBaking?.name}`}
                    </h3>
                    <button
                      onClick={() => {
                        setIsNewBaking(false);
                        setEditingBaking(null);
                      }}
                      className="text-stone-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveBaking} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#A8A29E] mb-1">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={bakingForm.name || ''}
                          onChange={(e) => setBakingForm({ ...bakingForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#A8A29E] mb-1">Category *</label>
                        <select
                          value={bakingForm.category || 'Birthday Cakes'}
                          onChange={(e) => setBakingForm({ ...bakingForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                        >
                          <option value="Birthday Cakes">Birthday Cakes</option>
                          <option value="Celebration Cakes">Celebration Cakes</option>
                          <option value="Wedding/Event Cakes">Wedding/Event Cakes</option>
                          <option value="Pastries">Pastries</option>
                          <option value="Custom Cakes">Custom Cakes</option>
                          <option value="Other Baked Items">Other Baked Items</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <div>
                        <label className="block text-xs font-bold text-[#A8A29E] mb-1">Price (₦) (Optional)</label>
                        <input
                          type="number"
                          disabled={bakingForm.price_on_request}
                          value={bakingForm.price ?? ''}
                          onChange={(e) => setBakingForm({ ...bakingForm, price: parseInt(e.target.value) || 0 })}
                          placeholder="e.g. 15000"
                          className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white disabled:opacity-40"
                        />
                      </div>

                      <div className="pt-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-pink-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bakingForm.price_on_request || false}
                            onChange={(e) => setBakingForm({ ...bakingForm, price_on_request: e.target.checked })}
                            className="w-4 h-4 accent-[#BE185D]"
                          />
                          Price on Request (Default)
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#A8A29E] mb-1">Availability</label>
                        <select
                          value={bakingForm.availability || 'Made to Order'}
                          onChange={(e) => setBakingForm({ ...bakingForm, availability: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                        >
                          <option value="Available Daily">Available Daily</option>
                          <option value="Made to Order">Made to Order</option>
                          <option value="24hrs Notice Required">24hrs Notice Required</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8A29E] mb-1">Image URL</label>
                      <input
                        type="url"
                        value={bakingForm.image_url || ''}
                        onChange={(e) => setBakingForm({ ...bakingForm, image_url: e.target.value })}
                        className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8A29E] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={bakingForm.description || ''}
                        onChange={(e) => setBakingForm({ ...bakingForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewBaking(false);
                          setEditingBaking(null);
                        }}
                        className="px-4 py-2 bg-[#1C1917] hover:bg-[#38332E] text-white rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#BE185D] hover:bg-[#9D174D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        Save Baking Item
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table */}
              <div className="bg-[#292524] rounded-2xl border border-[#38332E] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#D6D3D1]">
                    <thead className="bg-[#1C1917] text-[#A8A29E] uppercase font-bold border-b border-[#38332E]">
                      <tr>
                        <th className="p-3.5">Product</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Price</th>
                        <th className="p-3.5">Availability</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#38332E]">
                      {bakingProducts.map((b) => (
                        <tr key={b.id} className="hover:bg-[#302B27] transition-colors">
                          <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                            <img src={b.image_url} alt="" className="w-8 h-8 rounded-lg object-cover bg-black shrink-0" />
                            <span>{b.name}</span>
                          </td>
                          <td className="p-3.5">{b.category}</td>
                          <td className="p-3.5 font-bold text-pink-400">
                            {formatNaira(b.price, b.price_on_request)}
                          </td>
                          <td className="p-3.5">{b.availability}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditBaking(b)}
                              className="p-1.5 bg-[#1C1917] hover:bg-[#BE185D] text-white rounded-lg transition-colors cursor-pointer"
                              title="Edit Item"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBaking(b.id)}
                              className="p-1.5 bg-[#1C1917] hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 5: CONTACT MESSAGES ================= */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Direct Inquiries &amp; Messages</h2>
                <p className="text-xs text-[#A8A29E]">Messages sent through the Contact Us form</p>
              </div>

              {contacts.length === 0 ? (
                <div className="bg-[#292524] rounded-2xl border border-[#38332E] p-12 text-center text-[#A8A29E]">
                  <Mail className="w-12 h-12 mx-auto mb-3 text-stone-500" />
                  <p className="font-bold text-base text-white">No contact messages received yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map((msg) => (
                    <div key={msg.id} className="bg-[#292524] border border-[#38332E] rounded-2xl p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 border-b border-[#38332E] pb-2">
                        <div>
                          <span className="font-bold text-base text-white">{msg.name}</span>
                          <div className="text-xs text-[#A8A29E]">
                            Phone: <a href={`tel:${msg.phone}`} className="text-amber-400 font-bold hover:underline">{msg.phone}</a>
                            {msg.email && ` | Email: ${msg.email}`}
                          </div>
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-[#D6D3D1] leading-relaxed bg-[#1C1917] p-3 rounded-xl border border-[#38332E]">
                        {msg.message}
                      </p>

                      <div className="flex justify-end pt-1">
                        <a
                          href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#15803D] hover:bg-[#166534] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Reply on WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 6: BUSINESS SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Business Settings</h2>
                <p className="text-xs text-[#A8A29E]">
                  Update your contact phone, WhatsApp number, site address, and social links
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-[#292524] border border-[#38332E] rounded-3xl p-6 sm:p-8 space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1">
                      Business Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      placeholder="+234 904 684 3759"
                      className="w-full px-3.5 py-2.5 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1">
                      WhatsApp Number (For Direct Orders)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      placeholder="+234 904 684 3759"
                      className="w-full px-3.5 py-2.5 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1">
                      Office / Yard Address
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      placeholder="e.g. Lagos, Nigeria"
                      className="w-full px-3.5 py-2.5 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      placeholder="toysnwoodandcakes@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-[#1C1917] border border-[#38332E] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Social Media Links Editable */}
                <div className="pt-3 border-t border-[#38332E] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
                    Social Media Usernames / URLs
                  </h4>
                  <p className="text-xs text-[#A8A29E]">
                    The owner can easily change or update their exact handles here.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#A8A29E] mb-1">Facebook</label>
                      <input
                        type="text"
                        value={settingsForm.facebook || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                        placeholder="Okubanjooluwatosin"
                        className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-xs text-white focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#A8A29E] mb-1">Instagram</label>
                      <input
                        type="text"
                        value={settingsForm.instagram || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                        placeholder="Okubanjooluwatosin"
                        className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-xs text-white focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#A8A29E] mb-1">TikTok</label>
                      <input
                        type="text"
                        value={settingsForm.tiktok || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tiktok: e.target.value })}
                        placeholder="Okubanjooluwatosin"
                        className="w-full px-3 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-xs text-white focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Note & Hours */}
                <div className="pt-3 border-t border-[#38332E] space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1">
                      Delivery Note / Policy (Shown to Customers)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.delivery_fee_note || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, delivery_fee_note: e.target.value })}
                      placeholder="Delivery rates depend on site location distance..."
                      className="w-full px-3.5 py-2 bg-[#1C1917] border border-[#38332E] rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={settingsForm.opening_hours || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, opening_hours: e.target.value })}
                      placeholder="Monday - Saturday: 7:30 AM - 6:30 PM"
                      className="w-full px-3.5 py-2.5 bg-[#1C1917] border border-[#38332E] rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="w-full bg-[#D97706] hover:bg-[#B45309] disabled:bg-stone-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    {isSavingSettings ? 'Saving Changes...' : 'Save Business Settings'}
                  </button>
                </div>

              </form>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
