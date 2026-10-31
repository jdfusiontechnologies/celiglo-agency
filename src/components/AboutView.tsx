import React from 'react';
import { ShieldCheck, Recycle, Users, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AboutViewProps {
  onRequestCollection: () => void;
  onNavigate: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onRequestCollection, onNavigate }) => {
  return (
    <div className="py-12 bg-white space-y-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16803C] bg-[#EAF5ED] px-3 py-1 rounded-md">
              About Celiglo Agency Limited
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight leading-tight">
              Pioneering Responsible Waste Management in Kenya
            </h1>
            <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
              Celiglo Agency Limited is a dedicated environmental sanitation and waste logistics company founded to bring dignity, efficiency, and resource value to waste management. We serve residential neighborhoods, commercial business complexes, academic institutions, and estates with transparent, scheduled collections.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onRequestCollection}
                className="px-6 py-3 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-sm rounded-lg shadow-sm transition-all"
              >
                Request Waste Collection
              </button>
              <button
                onClick={() => onNavigate('recycling')}
                className="px-6 py-3 bg-[#F3F4F3] hover:bg-[#E5E7EB] text-[#252525] font-semibold text-sm rounded-lg transition-colors"
              >
                Learn Our Sorting Philosophy
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E5E7EB]">
            <img
              src="/src/assets/images/celiglo_eco_team_1792757712236.jpg"
              alt="Celiglo Agency Team Member"
              className="w-full h-[440px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
              <div className="text-white space-y-1">
                <p className="text-xs font-mono uppercase tracking-wider text-[#FFD42A]">
                  Field Operations &amp; Dispatch
                </p>
                <p className="text-lg font-bold">
                  Professionalism, safety gear, and reliable communication at every pickup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Story Behind Our Slogan */}
      <div className="bg-[#111111] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16803C] bg-white/10 px-3 py-1 rounded-md">
              Our Core Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFD42A] tracking-tight">
              DON&apos;T MIX IT, SORT IT, TAKA NI PESA.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              In everyday Swahili, &ldquo;Taka ni Pesa&rdquo; carries an essential truth: waste is only garbage when it is carelessly mixed together. When organics, plastics, cardboard, and scrap metals are segregated at home or at the workplace, they become valuable industrial inputs that drive Kenya&apos;s circular economy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
              <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-[#FFD42A] uppercase tracking-wider block">DON&apos;T MIX IT</span>
                <p className="text-xs text-neutral-400">
                  Mixing wet organic refuse with clean paper and plastics ruins recyclable value and creates unpleasant landfill hazards.
                </p>
              </div>
              <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-[#FFD42A] uppercase tracking-wider block">SORT IT</span>
                <p className="text-xs text-neutral-400">
                  Separating waste by stream allows direct material recovery, easier collection, and cleaner urban environments.
                </p>
              </div>
              <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-[#FFD42A] uppercase tracking-wider block">TAKA NI PESA</span>
                <p className="text-xs text-neutral-400">
                  Recyclables create revenue, support local jobs, and conserve precious natural resources for future generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmed Benefits (No unverified claims) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Our Commitment to Clients
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Ground-level operational standards verified through daily practice in Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#16803C] text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111111]">Responsible Handling</h3>
            <p className="text-xs text-[#252525] leading-relaxed">
              We never participate in illegal roadside dumping or burning. All collected waste is transported to designated municipal transfer stations or partner recycling depots.
            </p>
            <ul className="space-y-1.5 text-xs text-[#6B7280]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C]" />
                Enclosed, leak-proof transport
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C]" />
                Full chain-of-custody documentation
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#16803C] text-white flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111111]">Professional Communication</h3>
            <p className="text-xs text-[#252525] leading-relaxed">
              No guesswork about when your bin will be cleared. We confirm every collection, assign dedicated vehicle captains, and provide reference tracking for peace of mind.
            </p>
            <ul className="space-y-1.5 text-xs text-[#6B7280]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C]" />
                Direct WhatsApp and SMS alerts
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C]" />
                Courteous, uniformed personnel
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#16803C] text-white flex items-center justify-center">
              <Recycle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111111]">Maximum Resource Recovery</h3>
            <p className="text-xs text-[#252525] leading-relaxed">
              We assist gated estates, schools, and offices in setting up color-coded sorting stations so that plastics, cartons, and metals are recycled rather than buried.
            </p>
            <ul className="space-y-1.5 text-xs text-[#6B7280]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C]" />
                Sorting advice &amp; bag supplies
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C]" />
                Recycling partnership channels
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
