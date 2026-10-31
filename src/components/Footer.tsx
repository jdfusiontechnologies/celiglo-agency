import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (tab: string) => void;
  onRequestCollection: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onRequestCollection,
  onOpenTracker,
}) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (tab: string) => {
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-white border-t-4 border-[#16803C]">
      {/* Top Banner Callout */}
      <div className="bg-[#16803C] text-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD42A] shrink-0" />
            <p className="text-base sm:text-lg font-extrabold tracking-wide text-white">
              {settings.official_slogan}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onRequestCollection}
              className="px-4 py-2 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-xs uppercase tracking-wider rounded transition-all shadow"
            >
              Book Waste Collection
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\+/g, '')}?text=Hello%20Celiglo%20Agency%20Limited,%20I%20would%20like%20to%20inquire%20about%20waste%20management%20services.`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider rounded transition-colors inline-flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#FFD42A]" />
              WhatsApp Dispatch
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-neutral-800">
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Celiglo Agency Limited is a premier Kenyan environmental services and waste management corporation. We empower households, corporate institutions, and commercial establishments with dependable collection, sorting, and responsible resource recovery.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD42A]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <button
                  onClick={() => handleLinkClick('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('services')}
                  className="hover:text-white transition-colors"
                >
                  Services Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('recycling')}
                  className="hover:text-white transition-colors"
                >
                  Waste Sorting Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services & Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD42A]">
              Customer Actions
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <button
                  onClick={onRequestCollection}
                  className="hover:text-[#FFD42A] transition-colors flex items-center gap-1 font-medium"
                >
                  Request Waste Collection
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-[#FFD42A] transition-colors flex items-center gap-1"
                >
                  Track Collection Reference
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('services')}
                  className="hover:text-white transition-colors"
                >
                  Residential Pickup
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('services')}
                  className="hover:text-white transition-colors"
                >
                  Commercial & Bulk Refuse
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('recycling')}
                  className="hover:text-white transition-colors"
                >
                  Recycling Sorting Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Kenya Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD42A]">
              Kenya Operations Hub
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
                <span>{settings.physical_address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#16803C] shrink-0" />
                <span className="tabular-nums">{settings.phone_primary}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#16803C] shrink-0" />
                <span className="truncate">{settings.email_primary}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
                <span>{settings.service_hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>
            &copy; {currentYear} Celiglo Agency Limited. All rights reserved. Registered environmental and waste management company in Kenya.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleLinkClick('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Notice
            </button>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <button
              onClick={() => handleLinkClick('terms')}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
