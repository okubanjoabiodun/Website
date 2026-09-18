import React from 'react';
import { Trees, Phone, MessageCircle, MapPin, Mail, Lock, ArrowUp } from 'lucide-react';
import { BusinessSettings } from '../types';
import { getCleanSocialUrl } from '../utils/formatters';

interface FooterProps {
  settings?: BusinessSettings;
  onOpenAdmin: () => void;
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin, onOpenQuote }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fbUrl = getCleanSocialUrl('facebook', settings?.facebook || 'Okubanjooluwatosin');
  const igUrl = getCleanSocialUrl('instagram', settings?.instagram || 'Okubanjooluwatosin');
  const ttUrl = getCleanSocialUrl('tiktok', settings?.tiktok || 'Okubanjooluwatosin');

  return (
    <footer className="bg-[#141211] text-[#A8A29E] border-t border-[#292524] text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#78350F] flex items-center justify-center text-white shadow-md">
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white uppercase font-['Cinzel'] block">
                  TOYSN WOOD &amp; SUPER CAKES
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#F59E0B] block">
                  Roofing Wood • Timber • Artisanal Cakes
                </span>
              </div>
            </div>

            <p className="text-xs text-[#78716C] leading-relaxed max-w-sm">
              Your trusted partner for high-grade roofing wood, planks, building timber, bansaw mill cuts, and bespoke celebratory cakes by Super Cakes with fast site and doorstep delivery across Nigeria.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenQuote}
                className="bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
              >
                Request a Quick Quote
              </button>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-white font-extrabold uppercase text-xs tracking-wider mb-4">
              Explore Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#products" className="hover:text-white transition-colors">Wood Catalog</a></li>
              <li><a href="#roofing-wood" className="hover:text-white transition-colors">Roofing Wood (2×2, 2×3...)</a></li>
              <li><a href="#bansaw-wood" className="hover:text-white transition-colors">Bansaw Wood</a></li>
              <li><a href="#delivery" className="hover:text-white transition-colors">Site Delivery</a></li>
              <li><a href="#baking" className="hover:text-white transition-colors">Super Cakes Bakery</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Social Profiles */}
          <div>
            <h4 className="text-white font-extrabold uppercase text-xs tracking-wider mb-4">
              Social Media
            </h4>
            <p className="text-[11px] text-[#78716C] mb-3">
              Official profiles:
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#F59E0B] transition-colors flex items-center gap-1.5">
                  <span>Facebook:</span> <strong className="text-white">{settings.facebook || 'Okubanjooluwatosin'}</strong>
                </a>
              </li>
              <li>
                <a href={igUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#F59E0B] transition-colors flex items-center gap-1.5">
                  <span>Instagram:</span> <strong className="text-white">{settings.instagram || 'Okubanjooluwatosin'}</strong>
                </a>
              </li>
              <li>
                <a href={ttUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#F59E0B] transition-colors flex items-center gap-1.5">
                  <span>TikTok:</span> <strong className="text-white">{settings.tiktok || 'Okubanjooluwatosin'}</strong>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-extrabold uppercase text-xs tracking-wider mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-xs">
              {settings?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-white font-medium">{settings.phone}</a>
                </li>
              )}
              {settings?.whatsapp && (
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-medium text-emerald-400">{settings.whatsapp}</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>{settings?.address || 'Lagos, Nigeria'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                <span>{settings?.email || 'toysnwoodandcakes@gmail.com'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Pricing disclaimer note */}
        <div className="bg-[#1C1917] p-4 rounded-2xl border border-[#292524] mb-8 text-[11px] text-[#78716C] leading-relaxed flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Market Price Notice:</strong> Wood prices are subject to change based on current market conditions, wood species, and supply quantities. Toysn Wood and Super Cakes guarantees transparent quotes before order dispatch.
          </span>
          <button
            onClick={scrollToTop}
            className="shrink-0 flex items-center gap-1 text-white hover:text-[#F59E0B] font-bold text-xs cursor-pointer"
          >
            Back to Top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#292524] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} Toysn Wood and Super Cakes. All rights reserved. Dealer in all kinds of Roofing Wood.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-[#78716C] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-white/5"
              id="footer-admin-link"
            >
              <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
              Toys Admin
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
