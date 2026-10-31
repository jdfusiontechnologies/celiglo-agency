import React, { useState } from 'react';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

interface PrivacyTermsViewProps {
  initialTab?: 'privacy' | 'terms';
  onBack: () => void;
}

export const PrivacyTermsView: React.FC<PrivacyTermsViewProps> = ({ initialTab = 'privacy', onBack }) => {
  const [tab, setTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16803C] hover:text-[#0f5c2b]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </button>

        {/* Tab switcher */}
        <div className="flex border-b border-[#E5E7EB] gap-6 text-sm font-semibold">
          <button
            onClick={() => setTab('privacy')}
            className={`pb-3 relative transition-colors ${
              tab === 'privacy' ? 'text-[#16803C]' : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Privacy Notice
            {tab === 'privacy' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16803C]" />}
          </button>
          <button
            onClick={() => setTab('terms')}
            className={`pb-3 relative transition-colors ${
              tab === 'terms' ? 'text-[#16803C]' : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Terms of Service
            {tab === 'terms' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16803C]" />}
          </button>
        </div>

        {tab === 'privacy' ? (
          <div className="prose prose-sm max-w-none space-y-6 text-[#252525]">
            <h1 className="text-3xl font-extrabold text-[#111111]">
              Privacy Notice &amp; Data Protection
            </h1>
            <p className="text-xs text-[#6B7280]">
              Effective Date: January 1, 2026 · Compliant with the Kenya Data Protection Act, 2019
            </p>

            <div className="p-4 bg-[#EAF5ED] border border-[#16803C]/20 rounded-xl text-xs text-[#0f5c2b]">
              <strong>Celiglo Agency Limited</strong> respects your personal information. When you book a waste collection or contact us, we collect only the necessary details required to coordinate reliable pickup routes and communicate operational updates.
            </div>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#111111]">1. Information We Collect</h3>
              <p className="text-xs leading-relaxed">
                When you request a waste collection service, we collect:
              </p>
              <ul className="text-xs list-disc pl-5 space-y-1">
                <li>Your full name and contact telephone number (mobile/WhatsApp)</li>
                <li>Email address (optional, for electronic receipts and service updates)</li>
                <li>Physical pickup address, estate name, house number, or geographic landmark</li>
                <li>Waste stream category, estimated load volume, and property access instructions</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#111111]">2. How We Use Your Data</h3>
              <p className="text-xs leading-relaxed">
                Your data is used strictly for:
              </p>
              <ul className="text-xs list-disc pl-5 space-y-1">
                <li>Dispatching collection vehicles and driver navigation</li>
                <li>Issuing real-time collection reference codes and status updates</li>
                <li>Contacting you to confirm scheduling or access permissions</li>
                <li>Fulfilling legal waste management manifests and regulatory reporting</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#111111]">3. Non-Disclosure &amp; Security</h3>
              <p className="text-xs leading-relaxed">
                We never sell, rent, or trade your contact records. All client data is protected behind authenticated database systems. Passwords and sensitive credentials are encrypted using industry-standard hashing.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#111111]">4. Contact Our Data Compliance Team</h3>
              <p className="text-xs leading-relaxed">
                To request data deletion or review your logged information, contact:
                <br />
                <strong>Email:</strong> jdfusiontechnologies@gmail.com · <strong>Hotline:</strong> +254 700 000 000
              </p>
            </section>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none space-y-6 text-[#252525]">
            <h1 className="text-3xl font-extrabold text-[#111111]">
              Terms of Waste Collection Service
            </h1>
            <p className="text-xs text-[#6B7280]">
              Last Updated: October 2026 · Celiglo Agency Limited
            </p>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950">
              <strong>Mandatory Service Notice:</strong> Submitting a collection request via our website does NOT constitute an automatically confirmed booking. All collection requests are initially placed in &ldquo;Pending&rdquo; status and must be verified, priced, and scheduled by authorized Celiglo Agency Limited staff.
            </div>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#111111]">1. Request Lifecycle &amp; Approval</h3>
              <p className="text-xs leading-relaxed">
                All requests follow the formal workflow: <em>Pending &rarr; Confirmed &rarr; Scheduled &rarr; Collected &rarr; Completed</em>. A booking is only legally scheduled once an operations dispatcher confirms your time slot and agrees on any applicable service charges.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#111111]">2. Waste Sorting &amp; Safety Compliance</h3>
              <p className="text-xs leading-relaxed">
                In alignment with &ldquo;DON&apos;T MIX IT, SORT IT, TAKA NI PESA.&rdquo;, clients are strongly urged to segregate wet organic waste from dry recyclable plastics, metals, and paper.
              </p>
              <ul className="text-xs list-disc pl-5 space-y-1">
                <li>Uncontained sharp objects (broken glass, needles, razor blades) must be securely boxed.</li>
                <li>Explosive chemicals, pressurized canisters, and radioactive elements cannot be accepted.</li>
                <li>Our crews reserve the right to decline unsorted hazardous contamination that threatens worker safety.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#111111]">3. Access &amp; Site Conditions</h3>
              <p className="text-xs leading-relaxed">
                Clients must provide safe access for collection trucks and personnel. If access is obstructed (locked compound without attendant, impassable private roads), the pickup may be rescheduled.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#111111]">4. Cancellations</h3>
              <p className="text-xs leading-relaxed">
                Clients may cancel or request rescheduling by providing their unique Reference Code via phone or WhatsApp at least 4 hours before the scheduled dispatch window.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
