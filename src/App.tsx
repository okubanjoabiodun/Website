import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductsSection } from './components/ProductsSection';
import { RoofingWoodSection } from './components/RoofingWoodSection';
import { BansawWoodSection } from './components/BansawWoodSection';
import { DeliverySection } from './components/DeliverySection';
import { BakingSection } from './components/BakingSection';
import { AboutSection } from './components/AboutSection';
import { SocialSection } from './components/SocialSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Modals
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuoteModal } from './components/QuoteModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';

import { 
  Product, 
  BakingProduct, 
  Order, 
  QuoteRequest, 
  ContactMessage, 
  BusinessSettings 
} from './types';
import { api } from './services/api';
import { MessageCircle, Search } from 'lucide-react';
import { buildWhatsAppLink } from './utils/formatters';

const DEFAULT_SETTINGS: BusinessSettings = {
  business_name: 'Toysn Wood and Super Cakes',
  description: 'Dealer in all kinds of roofing wood, planks and building timber, plus fresh artisanal custom cakes and event bakes by Super Cakes.',
  phone: '08000000000',
  whatsapp: '2348000000000',
  address: 'Lagos, Nigeria',
  email: 'toysnwoodandcakes@gmail.com',
  facebook: 'Okubanjooluwatosin',
  instagram: 'Okubanjooluwatosin',
  tiktok: 'Okubanjooluwatosin',
  delivery_fee_note: 'Delivery fee is determined by distance, vehicle capacity and volume of wood ordered. Confirmed before vehicle dispatch.',
  opening_hours: 'Monday - Saturday: 7:30 AM - 6:30 PM'
};

function MainApp() {
  const { showToast } = useToast();

  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [bakingProducts, setBakingProducts] = useState<BakingProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteInitialProduct, setQuoteInitialProduct] = useState('');
  const [quoteInitialSize, setQuoteInitialSize] = useState('');
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('toys_admin_token') || localStorage.getItem('joyous_admin_token');
  });

  const loadAllData = useCallback(async () => {
    try {
      const data = await api.getInitialData();
      if (data.settings) setSettings(data.settings);
      if (data.products) setProducts(data.products);
      if (data.baking) setBakingProducts(data.baking);
      if (data.orders) setOrders(data.orders);
      if (data.quotes) setQuotes(data.quotes);
      if (data.contacts) setContacts(data.contacts);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Quote opener helper
  const handleOpenQuote = (productName?: string, size?: string) => {
    setQuoteInitialProduct(productName || '');
    setQuoteInitialSize(size || '');
    setIsQuoteOpen(true);
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('toys_admin_token', token);
    setIsAdminDashboardOpen(true);
    showToast('Toys Admin logged in', 'success');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('toys_admin_token');
    localStorage.removeItem('joyous_admin_token');
    setIsAdminDashboardOpen(false);
    showToast('Logged out of Toys Admin', 'info');
  };

  const handleOpenAdminTrigger = () => {
    if (adminToken) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Floating direct WhatsApp
  const floatingWhatsAppUrl = buildWhatsAppLink(settings?.whatsapp, {
    product: 'Toysn Wood & Super Cakes Inquiry',
    size: 'Wood & Planks / Super Cakes'
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] selection:bg-[#F59E0B] selection:text-[#1C1917] font-['Plus_Jakarta_Sans'] antialiased">
      
      {/* Sticky Header Navigation */}
      <Navbar
        settings={settings}
        onOpenQuote={() => handleOpenQuote()}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
      />

      <main>
        {/* Hero Section */}
        <Hero
          settings={settings}
          onOpenQuote={() => handleOpenQuote()}
        />

        {/* Products Catalog with Filters, Search, and Confirmed 2x2/2x3 pricing */}
        <ProductsSection
          products={products}
          settings={settings}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onOpenQuote={handleOpenQuote}
        />

        {/* Dedicated Roofing Wood & Planks Section (2x2, 2x3, 2x4, 1x12, 2x6, 3x4, Other) */}
        <RoofingWoodSection
          onOpenQuote={handleOpenQuote}
        />

        {/* Dedicated Bansaw Wood Section */}
        <BansawWoodSection
          settings={settings}
          onOpenQuote={handleOpenQuote}
        />

        {/* We Deliver Section with delivery request form */}
        <DeliverySection
          settings={settings}
          onSuccessOrder={loadAllData}
        />

        {/* Dedicated Joyous Baking Section */}
        <BakingSection
          bakingProducts={bakingProducts}
          settings={settings}
          onOrderSubmitted={loadAllData}
        />

        {/* About Joyous Woods & Why Choose Us */}
        <AboutSection />

        {/* Social Media Section */}
        <SocialSection
          settings={settings}
        />

        {/* Contact Page & Form */}
        <ContactSection
          settings={settings}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={handleOpenAdminTrigger}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        {/* Track Order Floating Button */}
        <button
          onClick={() => setIsTrackingOpen(true)}
          className="bg-[#1C1917] hover:bg-[#292524] text-white p-3.5 rounded-full shadow-2xl border border-[#38332E] flex items-center gap-2 group transition-all cursor-pointer active:scale-95"
          title="Track Order / Quote Status"
          aria-label="Track Order / Quote Status"
        >
          <Search className="w-5 h-5 text-[#F59E0B]" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap pr-1">
            Track Order
          </span>
        </button>
      </div>

      {/* Floating WhatsApp Quick Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={settings?.whatsapp ? floatingWhatsAppUrl : '#contact'}
          onClick={(e) => {
            if (!settings?.whatsapp) {
              e.preventDefault();
              handleOpenQuote('General Inquiry');
            }
          }}
          target={settings?.whatsapp ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="bg-[#15803D] hover:bg-[#166534] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 group cursor-pointer"
          title="Chat with Toysn Wood & Super Cakes on WhatsApp"
          aria-label="Chat with Toysn Wood & Super Cakes on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-current text-white" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap pl-2">
            WhatsApp Us
          </span>
        </a>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
          onSuccessOrder={loadAllData}
        />
      )}

      {/* Request a Quote Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        initialProduct={quoteInitialProduct}
        initialSize={quoteInitialSize}
        settings={settings}
        onClose={() => setIsQuoteOpen(false)}
        onSuccess={loadAllData}
      />

      {/* Order / Quote Status Lookup Modal */}
      <OrderLookupModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        quotes={quotes}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Full Admin Dashboard Modal */}
      {isAdminDashboardOpen && adminToken && (
        <AdminDashboard
          token={adminToken}
          settings={settings}
          products={products}
          bakingProducts={bakingProducts}
          orders={orders}
          quotes={quotes}
          contacts={contacts}
          onRefreshData={loadAllData}
          onLogout={handleAdminLogout}
          onClose={() => setIsAdminDashboardOpen(false)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
