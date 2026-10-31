import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  User,
  Truck,
  ShieldCheck,
  AlertCircle,
  Phone,
  FileCheck2,
  ArrowRight,
  Lock
} from 'lucide-react';
import { CeligloStorage } from '../data/storage';
import { CollectionRequest, RequestStatus } from '../types';

interface TrackRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReference?: string;
  onRequestNew?: () => void;
  onLoginRequest?: () => void;
}

const LIFECYCLE_STEPS: { status: RequestStatus; label: string; desc: string }[] = [
  { status: 'Request Received', label: '1. Request Received', desc: 'Logged in system, awaiting dispatch review' },
  { status: 'Processing', label: '2. Processing', desc: 'Route checked and feasibility verified' },
  { status: 'In Progress', label: '3. In Progress', desc: 'Driver & vehicle assigned and active' },
  { status: 'Ready for Collection or Delivery', label: '4. Ready for Collection', desc: 'Vehicle on route to your location' },
  { status: 'Collected or Delivered', label: '5. Collected', desc: 'Waste safely loaded and weighed' },
  { status: 'Completed', label: '6. Completed', desc: 'Delivered to licensed recycling/disposal facility' },
];

export const TrackRequestModal: React.FC<TrackRequestModalProps> = ({
  isOpen,
  onClose,
  initialReference = '',
  onRequestNew,
  onLoginRequest,
}) => {
  const [searchInput, setSearchInput] = useState(initialReference);
  const [phoneVerify, setPhoneVerify] = useState('');
  const [searchedRequest, setSearchedRequest] = useState<CollectionRequest | null>(null);
  const [searched, setSearched] = useState(false);
  const [securityBlock, setSecurityBlock] = useState(false);

  const session = CeligloStorage.getCurrentSession();
  const settings = CeligloStorage.getSettings();

  useEffect(() => {
    if (initialReference) {
      setSearchInput(initialReference);
      handleSearchWithCode(initialReference);
    }
  }, [initialReference]);

  if (!isOpen) return null;

  const handleSearchWithCode = (code: string) => {
    if (!code.trim()) return;
    const req = CeligloStorage.getRequestByReference(code.trim());

    if (!req) {
      setSearchedRequest(null);
      setSearched(true);
      setSecurityBlock(false);
      return;
    }

    // Security check: if user is logged in as Customer, verify ownership
    if (session?.user && session.user.role === 'customer') {
      const isOwner =
        req.customer_id === session.user.id ||
        req.customer_phone.replace(/\s+/g, '') === session.user.phone.replace(/\s+/g, '') ||
        req.customer_email?.toLowerCase() === session.user.email.toLowerCase();

      if (!isOwner) {
        setSecurityBlock(true);
        setSearchedRequest(null);
        setSearched(true);
        return;
      }
    }

    setSecurityBlock(false);
    setSearchedRequest(req);
    setSearched(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchWithCode(searchInput);
  };

  const getStepState = (stepStatus: RequestStatus, currentStatus: RequestStatus) => {
    if (currentStatus === 'Cancelled') return 'cancelled';
    if (currentStatus === 'Awaiting Customer Action' && stepStatus === 'In Progress') return 'active';

    const order: RequestStatus[] = [
      'Request Received',
      'Processing',
      'In Progress',
      'Ready for Collection or Delivery',
      'Collected or Delivered',
      'Completed',
    ];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepStatus);

    if (currentIndex >= stepIndex) return 'completed';
    return 'upcoming';
  };

  const getNextStepInstructions = (status: RequestStatus): string => {
    switch (status) {
      case 'Request Received':
        return 'Our dispatch team is reviewing your address and route capacity. You will receive an SMS when your slot is confirmed.';
      case 'Processing':
        return 'Your collection order is approved. A dedicated vehicle captain will be assigned shortly.';
      case 'In Progress':
        return 'Your vehicle captain is preparing route clearance. Please ensure access to your estate or compound.';
      case 'Awaiting Customer Action':
        return 'Action Required: Please verify site access with estate security or call dispatch at +254 700 000 000.';
      case 'Ready for Collection or Delivery':
        return 'The collection vehicle is within your neighborhood corridor. Please ensure waste liners or bins are ready for loading.';
      case 'Collected or Delivered':
        return 'Your waste stream has been loaded onto our truck and is in transit to the material recovery depot.';
      case 'Completed':
        return 'Collection fully completed and documented. All recyclables have been routed for recovery. DON\'T MIX IT, SORT IT, TAKA NI PESA.';
      case 'Cancelled':
        return 'This collection order has been cancelled. Contact support if you need to reactivate or rebook.';
      default:
        return 'Monitoring order progress.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#111111] text-white px-6 py-5 flex items-center justify-between border-b border-neutral-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFD42A] block mb-0.5">
              Automated Tracking System
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#16803C]" />
              Track Collection &amp; Service Status
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#252525]">
              Enter Your Unique Tracking Reference Code:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g. CEL-2026-8192"
                  className="w-full pl-9 pr-3 py-2.5 text-sm font-bold font-mono border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C] focus:ring-1 focus:ring-[#16803C] uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-sm rounded-lg transition-colors"
              >
                Track
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <span>Enter the booking reference sent to your email or SMS notification (e.g. CEL-2026-XXXX).</span>
            </div>
          </form>

          {/* Access Control Protection Screen */}
          {securityBlock && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl space-y-3 text-red-900 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-red-700">
                <Lock className="w-5 h-5" />
                Access Restricted (Data Privacy Protection)
              </div>
              <p>
                This tracking code belongs to another customer account. Under our strict customer privacy policy, you may only inspect your own collection and service orders.
              </p>
              <p className="font-semibold">
                Please check your own reference code in your Customer Dashboard.
              </p>
            </div>
          )}

          {/* Results Display */}
          {searched && searchedRequest && !securityBlock ? (
            <div className="space-y-6 pt-4 border-t border-[#E5E7EB]">
              {/* Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F3F4F3] p-4 rounded-xl border border-[#E5E7EB]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold block">
                    Verified Tracking Reference
                  </span>
                  <p className="text-2xl font-mono font-extrabold text-[#111111]">
                    {searchedRequest.reference_code}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Customer: <strong className="text-[#252525]">{searchedRequest.customer_name}</strong> · ({searchedRequest.customer_type})
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      searchedRequest.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : searchedRequest.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : searchedRequest.status === 'Awaiting Customer Action'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-[#EAF5ED] text-[#16803C]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {searchedRequest.status}
                  </span>
                  <span className="text-[10px] text-[#6B7280] mt-1 font-mono">
                    Last update: {new Date(searchedRequest.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Next Steps Guidance Callout */}
              <div className="p-4 bg-[#EAF5ED] border border-[#16803C]/30 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#16803C] block">
                  Next Steps for Customer:
                </span>
                <p className="text-xs font-semibold text-[#0f5c2b] leading-relaxed">
                  {getNextStepInstructions(searchedRequest.status)}
                </p>
              </div>

              {/* Status Timeline */}
              {searchedRequest.status === 'Cancelled' ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">This collection request was cancelled.</strong>
                    <span>
                      {searchedRequest.internal_notes || 'Please contact Celiglo dispatch if you wish to reschedule.'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#252525]">
                    Configured Service Workflow:
                  </h4>
                  <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
                    {LIFECYCLE_STEPS.map((step) => {
                      const state = getStepState(step.status, searchedRequest.status);
                      const isCurrent = searchedRequest.status === step.status;

                      return (
                        <div key={step.status} className="relative flex items-start gap-3 text-xs">
                          <div
                            className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                              state === 'completed'
                                ? 'bg-[#16803C] border-[#16803C] text-white'
                                : 'bg-white border-[#E5E7EB] text-[#6B7280]'
                            }`}
                          >
                            {state === 'completed' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                            )}
                          </div>
                          <div>
                            <p
                              className={`font-bold ${
                                isCurrent
                                  ? 'text-[#16803C] text-sm'
                                  : state === 'completed'
                                  ? 'text-[#111111]'
                                  : 'text-[#6B7280]'
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[#6B7280]">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status History Audit Trail (Timestamped updates by staff) */}
              <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#16803C]" />
                  Verified Progress History ({searchedRequest.status_history?.length || 0} Events)
                </h4>
                <div className="space-y-2">
                  {searchedRequest.status_history?.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#16803C]">
                          &rarr; {entry.to_status}
                        </span>
                        <span className="font-mono text-[#6B7280] tabular-nums">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#252525]">{entry.notes}</p>
                      <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-1">
                        <span>Staff: {entry.staff_name}</span>
                        {entry.proof_reference && (
                          <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Proof Ref: {entry.proof_reference}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F3F4F3] rounded-xl p-4">
                <div className="space-y-1">
                  <span className="text-[#6B7280] font-semibold">Service Type:</span>
                  <p className="font-bold text-[#111111]">{searchedRequest.service_name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#6B7280] font-semibold">Scheduled Date:</span>
                  <p className="font-bold text-[#111111]">{searchedRequest.preferred_date}</p>
                </div>
                <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-semibold">Address / Landmark:</span>
                  <p className="text-[#111111]">{searchedRequest.collection_address}</p>
                </div>
                {searchedRequest.assigned_staff_name && (
                  <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[#E5E7EB] bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                    <span className="text-[#16803C] font-bold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Assigned Driver &amp; Route Captain:
                    </span>
                    <p className="font-bold text-[#111111]">{searchedRequest.assigned_staff_name}</p>
                  </div>
                )}
              </div>

              {/* Slogan */}
              <div className="text-center text-xs font-extrabold text-[#16803C] bg-[#EAF5ED] p-2.5 rounded-lg">
                &ldquo;{settings.official_slogan}&rdquo;
              </div>
            </div>
          ) : searched && !securityBlock ? (
            <div className="p-8 text-center space-y-3 bg-[#F3F4F3] rounded-xl border border-[#E5E7EB]">
              <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
              <h4 className="text-base font-bold text-[#111111]">Reference Code Not Found</h4>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                No active collection record matched &ldquo;{searchInput}&rdquo;. Please verify your tracking code or submit a new collection booking.
              </p>
              {onRequestNew && (
                <button
                  onClick={() => {
                    onClose();
                    onRequestNew();
                  }}
                  className="mt-2 px-4 py-2 bg-[#FFD42A] text-[#111111] font-bold text-xs rounded-lg shadow-sm"
                >
                  Submit a New Request
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
