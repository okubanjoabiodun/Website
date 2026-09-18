import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, FileText, Phone, ShieldCheck, Search, Truck } from 'lucide-react';
import { BusinessSettings } from '../types';
import { buildWhatsAppLink } from '../utils/formatters';

interface NavbarProps {
  settings?: BusinessSettings;
  onOpenQuote: (initialProduct?: string, initialSize?: string) => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenQuote,
  onOpenAdmin,
  onOpenTracking,
  activeSection
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Products', href: '#products' },
    { name: 'Roofing Wood', href: '#roofing-wood' },
    { name: 'Bansaw Wood', href: '#bansaw-wood' },
    { name: 'Baking', href: '#baking' },
    { name: 'About Us', href: '#about' },
    { name: 'Delivery', href: '#delivery' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = buildWhatsAppLink(settings?.whatsapp, {
    product: 'Roofing Wood & Planks inquiry',
    size: 'Standard'
  });

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1C1917]/95 backdrop-blur-md shadow-lg border-b border-[#292524] text-white'
          : 'bg-[#1C1917] text-white border-b border-[#292524]'
      }`}
    >
      {/* Top micro-bar for quick phone and prompt settings */}
      <div className="bg-[#292524] px-4 py-1.5 text-xs text-[#D6D3D1] border-b border-[#38332E]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium text-[#E7E5E4]">
              <Truck className="w-3.5 h-3.5 text-[#D97706]" />
              Reliable Delivery Across Locations
            </span>
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="hover:text-white flex items-center gap-1 transition-colors">
                <Phone className="w-3 h-3 text-[#D97706]" />
                {settings.phone}
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenTracking}
              className="text-[#FBBF24] hover:text-[#FDE68A] transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <Search className="w-3 h-3" />
              Track Order / Quote Status
            </button>
            <span className="text-[#57534E]">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#A8A29E] hover:text-white transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              title="Toys Admin Portal"
            >
              <ShieldCheck className="w-3 h-3 text-[#B45309]" />
              Toys Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group focus:outline-none"
            id="brand-logo"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#92400E] to-[#B45309] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-[#F59E0B]/30">
              <svg className="w-6 h-6 text-amber-100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block uppercase font-['Plus_Jakarta_Sans']">
                Toysn <span className="text-[#F59E0B]">Wood</span> <span className="text-stone-300">&amp;</span> <span className="text-amber-400">Super Cakes</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-[#A8A29E] uppercase block">
                Roofing Wood • Planks • Artisanal Cakes
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-[#F59E0B] bg-[#292524]'
                      : 'text-[#D6D3D1] hover:text-white hover:bg-[#292524]/60'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenQuote()}
              className="bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              id="nav-get-quote-btn"
            >
              <FileText className="w-4 h-4" />
              Get a Quote
            </button>
            <a
              href={settings?.whatsapp ? whatsappUrl : '#quote'}
              onClick={(e) => {
                if (!settings?.whatsapp) {
                  e.preventDefault();
                  onOpenQuote();
                }
              }}
              target={settings?.whatsapp ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              id="nav-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenQuote()}
              className="bg-[#D97706] text-white p-2 rounded-lg text-xs font-bold"
              aria-label="Get Quote"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#292524] text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#1C1917] border-t border-[#292524] px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#292524]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="bg-[#D97706] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Get a Quote
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#15803D] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>

          <div className="space-y-1 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-200 hover:text-white hover:bg-[#292524] active:bg-[#38332E]"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#292524] flex items-center justify-between text-xs text-[#A8A29E]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="flex items-center gap-1.5 text-[#FBBF24] font-medium"
            >
              <Search className="w-4 h-4" />
              Track Order / Quote
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-1 text-gray-400 hover:text-white"
            >
              <ShieldCheck className="w-4 h-4 text-[#B45309]" />
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
