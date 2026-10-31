import React from 'react';
import {
  Truck,
  Recycle,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { CeligloStorage } from '../data/storage';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onRequestCollection: (serviceId?: string) => void;
  onOpenTracker: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onRequestCollection,
  onOpenTracker,
}) => {
  const settings = CeligloStorage.getSettings();
  const services = CeligloStorage.getServices(true).slice(0, 4); // Marquee 4 services on homepage
  const areas = CeligloStorage.getServiceAreas(true);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-white pt-8 pb-16 lg:pt-14 lg:pb-20 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Clean Unboxed Eyebrow Metadata (Zero-Pill discipline) */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16803C]">
                <span>Celiglo Agency Limited</span>
                <span aria-hidden="true">·</span>
                <span>Kenya Environmental Services</span>
                <span aria-hidden="true">·</span>
                <span>Waste Logistics</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.15] text-balance">
                {settings.hero_headline}
              </h1>

              {/* Slogan */}
              <div className="py-3 px-5 bg-[#111111] rounded-xl border-l-4 border-[#FFD42A] shadow-sm inline-block">
                <p className="text-base sm:text-lg md:text-xl font-extrabold text-[#FFD42A] tracking-normal">
                  {settings.official_slogan}
                </p>
              </div>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#252525] leading-relaxed max-w-2xl">
                {settings.hero_subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => onRequestCollection()}
                  className="px-6 py-3.5 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98] text-center"
                >
                  Request Waste Collection
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="px-6 py-3.5 bg-white hover:bg-[#F3F4F3] text-[#16803C] border-2 border-[#16803C] font-bold text-sm rounded-xl transition-colors text-center"
                >
                  Explore Services
                </button>

                <button
                  onClick={onOpenTracker}
                  className="px-4 py-3.5 text-xs font-semibold text-[#6B7280] hover:text-[#111111] transition-colors text-center underline sm:no-underline"
                >
                  Track Existing Request
                </button>
              </div>

              {/* Adjacency Proof Strip (Clean, unboxed metadata) */}
              <div className="pt-6 border-t border-[#E5E7EB] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6B7280]">
                <div className="flex items-center gap-1.5 font-medium text-[#252525]">
                  <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
                  <span>Doorstep &amp; Commercial Pickups</span>
                </div>
                <span aria-hidden="true">·</span>
                <div className="flex items-center gap-1.5 font-medium text-[#252525]">
                  <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
                  <span>Licensed Transfer Depots</span>
                </div>
                <span aria-hidden="true">·</span>
                <div className="flex items-center gap-1.5 font-medium text-[#252525]">
                  <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
                  <span>Real-Time Code Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Focal Carrier Photo (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E5E7EB] bg-neutral-100 aspect-[4/3] lg:aspect-auto lg:h-[480px]">
                <img
                  src="/src/assets/images/celiglo_hero_truck_1792757709754.jpg"
                  alt="Celiglo Agency waste collection vehicle in urban Kenya"
                  className="w-full h-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFD42A] font-semibold">
                    Fleet Operations &amp; Sanitization
                  </span>
                  <p className="text-base font-bold">
                    Professional, leak-proof transport preserving neighborhood hygiene.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPANY INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EAF5ED] rounded-3xl p-8 sm:p-12 border border-[#16803C]/20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
              Who We Are
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              {settings.company_intro_headline}
            </h2>
            <p className="text-sm text-[#252525] leading-relaxed">
              {settings.company_intro_text}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <button
              onClick={() => onNavigate('about')}
              className="px-6 py-3 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Read Our Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
              Our Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111]">
              Environmental Waste Services
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Explore our core waste collection and material recovery offerings.
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-[#16803C] hover:text-[#0f5c2b] flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>View Complete Service Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Marquee Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className="bg-white border border-[#E5E7EB] hover:border-[#16803C] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="h-44 w-full relative overflow-hidden bg-neutral-100">
                <img
                  src={srv.image_path}
                  alt={srv.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-mono font-bold text-[#FFD42A]">
                  0{idx + 1}.
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-[#111111] leading-snug">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed">
                    {srv.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB]">
                  <button
                    onClick={() => onRequestCollection(srv.id)}
                    className="w-full py-2 bg-[#F3F4F3] group-hover:bg-[#FFD42A] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Request Service</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE CELIGLO (Confirmed Real Benefits) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
            Trust &amp; Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Why Partner With Celiglo Agency Limited
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            We build lasting relationships through reliable pickups, honest communication, and safe environmental disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {settings.benefits.map((benefit, idx) => (
            <div key={benefit.id || idx} className="p-8 bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl space-y-4">
              <span className="text-3xl font-extrabold text-[#16803C] font-mono">0{idx + 1}</span>
              <h3 className="text-xl font-bold text-[#111111]">{benefit.title}</h3>
              <p className="text-xs text-[#252525] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WASTE SORTING EDUCATION TEASER ("Don't Mix It, Sort It, Taka Ni Pesa.") */}
      <section className="bg-[#111111] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFD42A]">
                The Celiglo Recycling Education
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                &ldquo;Don&apos;t Mix It, Sort It, Taka Ni Pesa.&rdquo;
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                When you sort waste into clean, segregated streams—organics, clean plastics, paper, and scrap metals—you protect worker health, prevent pollution in Kenyan neighborhoods, and turn everyday refuse into economic value.
              </p>

              <div className="space-y-3 text-xs text-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16803C]" />
                  <span>Green stream: kitchen food scraps and garden trimmings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Blue stream: clean dry plastic bottles and containers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFD42A]" />
                  <span>Yellow stream: cardboard boxes, magazines and packaging</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('recycling')}
                  className="px-6 py-3 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore Interactive Sorting Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-xl">
                <img
                  src="/src/assets/images/celiglo_sorting_bins_1792757709684.jpg"
                  alt="Color-coded sorting bins"
                  className="w-full h-80 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COLLECTION PROCESS (4 Steps with Mandatory Disclaimer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
            Seamless Logistics
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            How Our Waste Collection Works
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            From your online request to compliant transfer, our transparent 4-stage workflow.
          </p>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl p-6 space-y-3 relative">
            <span className="text-xs font-bold font-mono text-[#16803C] bg-white px-2 py-1 rounded">
              Step 01
            </span>
            <h3 className="font-bold text-base text-[#111111]">Submit a Request</h3>
            <p className="text-xs text-[#252525] leading-relaxed">
              Fill out our simple form with your location, preferred date, and waste stream details.
            </p>
          </div>

          <div className="bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl p-6 space-y-3 relative">
            <span className="text-xs font-bold font-mono text-[#16803C] bg-white px-2 py-1 rounded">
              Step 02
            </span>
            <h3 className="font-bold text-base text-[#111111]">Receive Confirmation</h3>
            <p className="text-xs text-[#252525] leading-relaxed">
              Operations verifies vehicle capacity in your area and contacts you with the confirmed quote and slot.
            </p>
          </div>

          <div className="bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl p-6 space-y-3 relative">
            <span className="text-xs font-bold font-mono text-[#16803C] bg-white px-2 py-1 rounded">
              Step 03
            </span>
            <h3 className="font-bold text-base text-[#111111]">Agree on Schedule</h3>
            <p className="text-xs text-[#252525] leading-relaxed">
              Once approved, a dedicated fleet captain and collection truck is assigned to your reference code.
            </p>
          </div>

          <div className="bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl p-6 space-y-3 relative">
            <span className="text-xs font-bold font-mono text-[#16803C] bg-white px-2 py-1 rounded">
              Step 04
            </span>
            <h3 className="font-bold text-base text-[#111111]">Complete Collection</h3>
            <p className="text-xs text-[#252525] leading-relaxed">
              Our uniformed crew securely loads, sanitizes the pickup bay, and safely hauls to licensed facilities.
            </p>
          </div>
        </div>

        {/* Mandatory Policy Warning Box */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 sm:p-6 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-900 font-bold text-sm">
                Important Customer Booking Notice:
              </strong>
              <span>
                {settings.booking_disclaimer} Please retain your unique reference code to track the review status.
              </span>
            </div>
          </div>
          <button
            onClick={() => onRequestCollection()}
            className="px-5 py-2.5 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-lg shrink-0 transition-colors shadow-sm"
          >
            Start a Request Now
          </button>
        </div>
      </section>

      {/* 7. SERVICE COVERAGE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
              Operational Areas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              Confirmed Service Coverage
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              We operate scheduled pickup routes across confirmed Kenyan hubs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="text-xs font-semibold text-[#16803C] hover:underline self-start md:self-auto"
          >
            Inquire about expansion to your area &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {areas.map((a) => (
            <div
              key={a.id}
              className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-start gap-3"
            >
              <MapPin className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280] block">
                  {a.county} County
                </span>
                <p className="font-bold text-xs sm:text-sm text-[#111111]">
                  {a.area_name}
                </p>
                {a.notes && (
                  <p className="text-[10px] text-[#16803C] mt-0.5 font-medium">{a.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TESTIMONIALS & CLIENT EXPERIENCES */}
      <section className="bg-[#F3F4F3] py-16 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
              Customer Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              What Our Clients Say
            </h2>
            <p className="text-xs text-[#6B7280]">
              Real feedback from residential estate leaders and corporate facility managers in Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings.testimonials.map((testi, idx) => (
              <div key={testi.id || idx} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
                <p className="text-xs text-[#252525] leading-relaxed italic">
                  &ldquo;{testi.quote}&rdquo;
                </p>
                <div className="pt-2 border-t border-[#E5E7EB] text-xs">
                  <p className="font-bold text-[#111111]">{testi.name}</p>
                  <p className="text-[#6B7280]">{testi.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAST ACTION CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFD42A]">
              Get Started Today
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready for Clean, Dependable Waste Collection?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300">
              Submit a request in under 2 minutes. Our team will verify your route and connect you with a dedicated driver.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={() => onRequestCollection()}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Request Collection
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\+/g, '')}?text=Hello%20Celiglo%20Agency%20Limited,%20I%20would%20like%20to%20request%20waste%20collection.`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#FFD42A]" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
