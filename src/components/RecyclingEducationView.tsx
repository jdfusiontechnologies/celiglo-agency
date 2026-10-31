import React, { useState } from 'react';
import { Sparkles, Trash2, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, DollarSign, Leaf } from 'lucide-react';

interface RecyclingEducationViewProps {
  onRequestCollection: () => void;
}

interface WasteCategoryItem {
  id: string;
  name: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  sloganNote: string;
  description: string;
  acceptedItems: string[];
  rejectedItems: string[];
  valueOutcome: string;
}

const CATEGORIES: WasteCategoryItem[] = [
  {
    id: 'organic',
    name: 'Organic & Food Scraps',
    color: '#16803C',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    sloganNote: 'Organic waste feeds healthy soil & compost.',
    description:
      'Kitchen leftovers, fruit peels, vegetable scraps, and clean garden clippings. When kept separate from plastics, organics decompose into nutrient-rich agricultural compost.',
    acceptedItems: ['Fruit & vegetable peelings', 'Leftover ugali, rice & food', 'Coffee grounds & tea leaves', 'Garden leaves & cut grass'],
    rejectedItems: ['Plastic wrap or nylon bags', 'Animal bones with plastic wrapping', 'Pet feces or chemical treated timber'],
    valueOutcome: 'Converted to organic bio-fertilizer and black soldier fly larvae animal feed in Kenya.',
  },
  {
    id: 'plastics',
    name: 'Plastics (PET, HDPE & Film)',
    color: '#0284C7',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-800',
    sloganNote: 'Clean, sorted plastics hold strong recycling value.',
    description:
      'Beverage bottles, jerrycans, shampoo containers, and dry plastic packaging. Rinsing them and removing bottle caps drastically increases their recycling grade.',
    acceptedItems: ['Clean drinking water bottles (PET)', 'Cooking oil jerrycans (HDPE)', 'Detergent & shampoo bottles', 'Polythene shrink wraps'],
    rejectedItems: ['Oil-soaked automotive containers', 'Hazardous medical syringes', 'Crushed non-recyclable multi-layer foil chip bags'],
    valueOutcome: 'Crushed into plastic flakes, extruded into recycled pellets for water pipes, basins, and building pavers.',
  },
  {
    id: 'paper',
    name: 'Paper & Corrugated Cardboard',
    color: '#D97706',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    sloganNote: 'Keep dry — Water ruins paper fibers!',
    description:
      'Shipping cartons, office printer paper, newspapers, and packaging boxes. Flatten cardboard boxes to save space in storage and collection vehicles.',
    acceptedItems: ['Brown cardboard delivery boxes', 'Office documents & notebook paper', 'Newspapers & brochures', 'Egg trays & paper bags'],
    rejectedItems: ['Greasy pizza boxes', 'Wax-coated coffee cups', 'Wet or mildew-damaged paper'],
    valueOutcome: 'Pulped and re-milled into new packaging cartons, toilet rolls, and egg cartons.',
  },
  {
    id: 'metals',
    name: 'Metals & Scrap Tin',
    color: '#4B5563',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    sloganNote: '100% recyclable into new steel and cookware.',
    description:
      'Beverage cans, tinned food cans, iron roofing sheets, and scrap metal cutoffs. Metals can be melted and reformed indefinitely without degrading quality.',
    acceptedItems: ['Soda & beverage aluminum cans', 'Cleaned food tins & milk cans', 'Scrap iron, wires & metal offcuts', 'Old pots and iron ware'],
    rejectedItems: ['Pressurized gas cylinders without degassing', 'Chemical paint cans with residual hazardous wet paint'],
    valueOutcome: 'Smelted in Kenyan rolling mills to manufacture reinforcing rebar, steel roofing sheets, and cooking pots.',
  },
  {
    id: 'glass',
    name: 'Glass Bottles & Jars',
    color: '#0D9488',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-800',
    sloganNote: '100% recyclable forever!',
    description:
      'Beverage bottles, cosmetic jars, and food preserve containers. Glass must be segregated into sturdy containers to protect collection workers.',
    acceptedItems: ['Clear and colored beverage bottles', 'Jam jars and sauce containers', 'Medicine vials (clean)'],
    rejectedItems: ['Broken window panes', 'Ceramics & porcelain cups', 'Light bulbs & fluorescent tubes (E-waste)'],
    valueOutcome: 'Crushed into cullet for glass bottling manufacturers or recycled into terrazzo decorative flooring.',
  },
  {
    id: 'ewaste',
    name: 'Electronic Waste (E-Waste)',
    color: '#7C3AED',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    sloganNote: 'Hazardous if burned, valuable when dismantled professionally.',
    description:
      'Decommissioned computers, phones, cables, charging adapters, and electronic appliances. Never dump electronics into household garbage.',
    acceptedItems: ['Dead laptops, CPUs & monitors', 'Old cellphones & tablet devices', 'Power cables & charging bricks', 'Inverters and dry lead batteries'],
    rejectedItems: ['Leaking mercury thermometers', 'Uncontained wet battery acid spills'],
    valueOutcome: 'Dismantled at licensed recovery depots in Nairobi for precious metals and safe disposal.',
  },
];

export const RecyclingEducationView: React.FC<RecyclingEducationViewProps> = ({ onRequestCollection }) => {
  const [selectedCat, setSelectedCat] = useState<WasteCategoryItem>(CATEGORIES[0]);

  // Interactive "Taka ni Pesa" Estimator state
  const [monthlyWasteKg, setMonthlyWasteKg] = useState<number>(120);
  const estimatedDivertedKg = Math.round(monthlyWasteKg * 0.72);
  const co2PreventedKg = Math.round(estimatedDivertedKg * 1.4);
  const potentialValueKes = Math.round(estimatedDivertedKg * 18);

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16803C] bg-[#EAF5ED] px-3 py-1 rounded-md">
            Environmental Literacy & Circular Economy
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight">
            Waste Sorting &amp; Recycling Guide
          </h1>
          <div className="py-3 px-6 bg-[#111111] text-[#FFD42A] rounded-xl font-extrabold text-base sm:text-lg inline-block border-2 border-[#16803C]">
            DON&apos;T MIX IT, SORT IT, TAKA NI PESA.
          </div>
          <p className="text-base text-[#6B7280] leading-relaxed">
            When waste is dumped in one single bag, it contaminates valuable resources, clogs drainage systems, and harms our communities. By sorting at the source, you protect our environment and turn waste into real economic value.
          </p>
        </div>

        {/* The Golden Rule Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#EAF5ED] border border-[#16803C]/20 rounded-2xl p-6 space-y-2">
            <span className="text-2xl font-mono font-bold text-[#16803C]">01</span>
            <h3 className="text-lg font-bold text-[#111111]">Separate at the Source</h3>
            <p className="text-xs text-[#252525] leading-relaxed">
              Have at least two designated bins: one for moist organic waste and one for clean dry recyclables (plastics, paper, metals).
            </p>
          </div>
          <div className="bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl p-6 space-y-2">
            <span className="text-2xl font-mono font-bold text-[#111111]">02</span>
            <h3 className="text-lg font-bold text-[#111111]">Rinse &amp; Dry Recyclables</h3>
            <p className="text-xs text-[#252525] leading-relaxed">
              A quick rinse of milk packets and beverage bottles prevents bad odors and keeps cardboard clean enough for high-grade pulping.
            </p>
          </div>
          <div className="bg-[#FFFBEB] border border-amber-200 rounded-2xl p-6 space-y-2">
            <span className="text-2xl font-mono font-bold text-amber-700">03</span>
            <h3 className="text-lg font-bold text-[#111111]">Taka Ni Pesa</h3>
            <p className="text-xs text-[#252525] leading-relaxed">
              Recycling creates green employment for collection crews, sorters, and local manufacturers right here in Kenya.
            </p>
          </div>
        </div>

        {/* Interactive Waste Categories Explorer */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
                Detailed Waste Stream Guide
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280]">
                Select a category to view what can be collected and recycled.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedCat.id === cat.id
                      ? 'bg-[#16803C] text-white shadow-sm'
                      : 'bg-[#F3F4F3] text-[#252525] hover:bg-[#E5E7EB]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Category Display */}
          <div className="bg-[#F3F4F3] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E5E7EB]">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${selectedCat.badgeBg} ${selectedCat.badgeText}`}>
                  Waste Stream: {selectedCat.name}
                </span>
                <h3 className="text-2xl font-bold text-[#111111] mt-2">
                  {selectedCat.name}
                </h3>
                <p className="text-xs text-[#16803C] font-semibold mt-0.5">
                  &ldquo;{selectedCat.sloganNote}&rdquo;
                </p>
              </div>
              <button
                onClick={onRequestCollection}
                className="self-start sm:self-auto px-4 py-2 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] text-xs font-bold rounded-lg shadow-sm"
              >
                Schedule Pickup for this Stream
              </button>
            </div>

            <p className="text-sm text-[#252525] leading-relaxed max-w-3xl">
              {selectedCat.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Accepted */}
              <div className="bg-white p-5 rounded-xl border border-emerald-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  What We Collect &amp; Sort (YES)
                </h4>
                <ul className="space-y-2 text-xs text-[#252525]">
                  {selectedCat.acceptedItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rejected */}
              <div className="bg-white p-5 rounded-xl border border-rose-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  What to Keep Out (Contaminants)
                </h4>
                <ul className="space-y-2 text-xs text-[#252525]">
                  {selectedCat.rejectedItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Value Outcome */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-[#16803C] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                  The &ldquo;Taka ni Pesa&rdquo; Circular Impact:
                </span>
                <p className="text-xs text-[#6B7280] leading-relaxed mt-0.5">
                  {selectedCat.valueOutcome}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive "Taka ni Pesa" Value Calculator */}
        <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 border border-neutral-800 space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFD42A] block">
              Interactive Environmental Calculator
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Calculate Your Monthly Waste Diversion &amp; Value
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              See what happens when you adopt our slogan: &ldquo;Don&apos;t Mix It, Sort It, Taka Ni Pesa.&rdquo; at your home or business premises.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Input Slider */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300 font-semibold">Estimated Monthly Waste Generated:</span>
                <span className="text-lg font-mono font-bold text-[#FFD42A] tabular-nums">
                  {monthlyWasteKg} kg
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={monthlyWasteKg}
                onChange={(e) => setMonthlyWasteKg(Number(e.target.value))}
                className="w-full accent-[#16803C] h-2 bg-neutral-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                <span>20 kg (Small Household)</span>
                <span>300 kg (Apartment)</span>
                <span>1,000 kg (Commercial)</span>
              </div>
            </div>

            {/* Calculated Metrics */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl text-center space-y-1">
                <Leaf className="w-5 h-5 text-[#16803C] mx-auto" />
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium block">
                  Waste Diverted From Landfill
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {estimatedDivertedKg} <span className="text-sm font-normal text-neutral-400">kg</span>
                </p>
                <p className="text-[10px] text-neutral-500">72% average diversion rate</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl text-center space-y-1">
                <RefreshCw className="w-5 h-5 text-sky-400 mx-auto" />
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium block">
                  CO₂ Emissions Avoided
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {co2PreventedKg} <span className="text-sm font-normal text-neutral-400">kg</span>
                </p>
                <p className="text-[10px] text-neutral-500">Compared to open dumping/burning</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl text-center space-y-1">
                <DollarSign className="w-5 h-5 text-[#FFD42A] mx-auto" />
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium block">
                  Circular Value Potential
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#FFD42A] font-mono tabular-nums">
                  ~KES {potentialValueKes}
                </p>
                <p className="text-[10px] text-neutral-500">Economic raw material savings</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800 text-xs">
            <span className="text-neutral-400 italic">
              Ready to start sorting? Book our scheduled collection truck today.
            </span>
            <button
              onClick={onRequestCollection}
              className="px-5 py-2.5 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              Request Collection Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
