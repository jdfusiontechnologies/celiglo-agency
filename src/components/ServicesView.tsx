import React, { useState } from 'react';
import { CeligloStorage } from '../data/storage';
import { ServiceItem } from '../types';
import { CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Building2, Home, Truck } from 'lucide-react';

interface ServicesViewProps {
  onRequestService: (serviceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onRequestService }) => {
  const [filter, setFilter] = useState<'all' | 'residential' | 'commercial' | 'specialized'>('all');
  const services = CeligloStorage.getServices(false); // get all to show active/inactive state

  const filteredServices = services.filter((s) => {
    if (filter === 'all') return true;
    return s.category === filter;
  });

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16803C] bg-[#EAF5ED] px-3 py-1 rounded-md">
            Environmental Service Catalogue
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight">
            Comprehensive Waste Solutions for Kenya
          </h1>
          <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
            From daily household pickups to high-volume commercial container haulage and responsible material sorting, Celiglo Agency Limited provides dependable, environmentally conscious waste stewardship.
          </p>
        </div>

        {/* Pricing & Booking Policy Notice */}
        <div className="bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#16803C] shrink-0 mt-0.5" />
            <div className="text-xs text-[#252525]">
              <strong className="block text-[#111111] font-bold text-sm">
                Transparent Site Quotations &amp; Booking Policy
              </strong>
              <span>
                To ensure fairness and accurate scheduling, collection fees are determined by location, volume, and waste type. Submitting a request is free and subject to confirmation by authorized Celiglo Agency staff before dispatch.
              </span>
            </div>
          </div>
          <button
            onClick={() => onRequestService(services[0]?.id || '')}
            className="px-4 py-2.5 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-lg shrink-0 transition-colors shadow-sm"
          >
            Request a Free Quote
          </button>
        </div>

        {/* Filter Controls (Allowed buttons in Zero-Pill discipline) */}
        <div className="flex items-center justify-center gap-1.5 p-1.5 bg-[#F3F4F3] rounded-xl max-w-md mx-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-[#111111] shadow-sm'
                : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            All Services ({services.length})
          </button>
          <button
            onClick={() => setFilter('residential')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              filter === 'residential'
                ? 'bg-white text-[#111111] shadow-sm'
                : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Residential
          </button>
          <button
            onClick={() => setFilter('commercial')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              filter === 'commercial'
                ? 'bg-white text-[#111111] shadow-sm'
                : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Commercial
          </button>
          <button
            onClick={() => setFilter('specialized')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              filter === 'specialized'
                ? 'bg-white text-[#111111] shadow-sm'
                : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Specialized &amp; Bulk
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className={`flex flex-col bg-white rounded-2xl border transition-all overflow-hidden ${
                service.is_active
                  ? 'border-[#E5E7EB] hover:border-[#16803C] hover:shadow-lg'
                  : 'border-dashed border-neutral-300 opacity-60'
              }`}
            >
              {/* Image Banner */}
              <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
                <img
                  src={service.image_path}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Active status indicator */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      service.is_active
                        ? 'bg-[#16803C] text-white'
                        : 'bg-neutral-600 text-white'
                    }`}
                  >
                    {service.is_active ? 'Active Offering' : 'Temporarily Inactive'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-mono text-[#FFD42A] uppercase tracking-wider block">
                    0{index + 1}. {service.category}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug drop-shadow-sm">
                    {service.name}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <p className="text-xs text-[#252525] leading-relaxed">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                    <span className="text-[11px] uppercase tracking-wider text-[#6B7280] font-bold block">
                      Confirmed Features:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#252525]">
                      {service.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C] mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-[#E5E7EB]">
                  {service.is_active ? (
                    <button
                      onClick={() => onRequestService(service.id)}
                      className="w-full py-2.5 px-4 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                    >
                      <span>Request This Service</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 bg-[#F3F4F3] text-[#6B7280] font-semibold text-xs rounded-lg cursor-not-allowed"
                    >
                      Currently Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Contracting Banner */}
        <div className="bg-[#16803C] text-white rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need a Custom Estate or Commercial Contract?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              We create customized regular collection timetables and supply waste segregation bins for property managers, schools, factories, and residential associations.
            </p>
          </div>
          <button
            onClick={() => onRequestService(services[0]?.id || '')}
            className="px-6 py-3 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-sm rounded-xl shadow transition-colors shrink-0 whitespace-nowrap"
          >
            Request Corporate Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
