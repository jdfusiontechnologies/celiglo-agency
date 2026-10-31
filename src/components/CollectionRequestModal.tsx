import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Copy, Check, Calendar, MapPin, Truck, Phone, User, Mail, ShieldAlert } from 'lucide-react';
import { CeligloStorage } from '../data/storage';
import { CustomerType, CollectionRequest } from '../types';

interface CollectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  onTrackRequest?: (refCode: string) => void;
}

export const CollectionRequestModal: React.FC<CollectionRequestModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  onTrackRequest,
}) => {
  const services = CeligloStorage.getServices(true);
  const areas = CeligloStorage.getServiceAreas(true);
  const settings = CeligloStorage.getSettings();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('residential');
  const [serviceId, setServiceId] = useState(preselectedServiceId || (services[0]?.id || ''));
  const [wasteType, setWasteType] = useState('Segregated household & sorted recyclables');
  const [serviceAreaId, setServiceAreaId] = useState(areas[0]?.id || '');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [estimatedQuantity, setEstimatedQuantity] = useState('2-4 bags (standard household)');
  const [instructions, setInstructions] = useState('');
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<CollectionRequest | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full name (at least 3 characters).';
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      newErrors.phone = 'Please provide a valid phone number (e.g. 0712 345 678 or +254 712 345 678).';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address or leave it blank.';
    }

    if (!serviceId) {
      newErrors.serviceId = 'Please select a waste management service.';
    }

    if (!wasteType.trim()) {
      newErrors.wasteType = 'Please specify the waste category.';
    }

    if (!collectionAddress.trim() || collectionAddress.trim().length < 5) {
      newErrors.collectionAddress = 'Please specify the collection street, estate, building or landmark.';
    }

    if (!preferredDate) {
      newErrors.preferredDate = 'Please select a preferred collection date.';
    }

    if (!estimatedQuantity.trim()) {
      newErrors.estimatedQuantity = 'Please select or describe the estimated quantity.';
    }

    if (!consent) {
      newErrors.consent = 'You must confirm that you understand submitted requests are pending staff approval.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const selectedService = services.find((s) => s.id === serviceId);
    const selectedArea = areas.find((a) => a.id === serviceAreaId);

    try {
      const created = CeligloStorage.createRequest({
        customer_name: fullName.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim() || undefined,
        customer_type: customerType,
        service_id: serviceId,
        service_name: selectedService ? selectedService.name : 'Waste Collection',
        waste_type: wasteType.trim(),
        service_area_id: serviceAreaId || undefined,
        service_area_name: selectedArea ? `${selectedArea.area_name} (${selectedArea.county})` : undefined,
        collection_address: collectionAddress.trim(),
        preferred_date: preferredDate,
        estimated_quantity: estimatedQuantity.trim(),
        instructions: instructions.trim() || undefined,
      });

      setSubmittedRequest(created);
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An unexpected error occurred while saving your request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferenceCode = () => {
    if (!submittedRequest) return;
    navigator.clipboard.writeText(submittedRequest.reference_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const resetAndClose = () => {
    setSubmittedRequest(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#111111] text-white px-6 py-5 flex items-center justify-between border-b border-neutral-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFD42A] block mb-0.5">
              Celiglo Agency Limited
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#16803C]" />
              Request Waste Collection Service
            </h3>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        {submittedRequest ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-[#EAF5ED] text-[#16803C] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-[#111111]">
                Collection Request Submitted!
              </h4>
              <p className="text-sm text-[#6B7280] max-w-md mx-auto">
                Thank you, <strong className="text-[#252525]">{submittedRequest.customer_name}</strong>. Your collection request has been recorded in our dispatch database.
              </p>
            </div>

            {/* Reference Box */}
            <div className="bg-[#F3F4F3] border border-[#E5E7EB] rounded-xl p-5 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
                Your Unique Request Reference Code
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#16803C] tracking-wider">
                  {submittedRequest.reference_code}
                </span>
                <button
                  onClick={copyReferenceCode}
                  className="p-2 bg-white border border-[#E5E7EB] hover:border-[#16803C] rounded-lg text-[#252525] transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold"
                  title="Copy reference code"
                >
                  {copied ? <Check className="w-4 h-4 text-[#16803C]" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-[#6B7280]">
                Save this code to check your collection approval and scheduled driver anytime.
              </p>
            </div>

            {/* Mandatory Company Policy Callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 mb-0.5">Approval & Booking Notice</p>
                <p className="leading-relaxed">
                  {settings.booking_disclaimer} Our dispatch team will verify your service area and reach out via phone ({submittedRequest.customer_phone}) to confirm your exact collection time slot.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white border border-[#E5E7EB] rounded-xl p-4">
              <div>
                <span className="text-[#6B7280] block">Service:</span>
                <span className="font-semibold text-[#111111]">{submittedRequest.service_name}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block">Preferred Date:</span>
                <span className="font-semibold text-[#111111]">{submittedRequest.preferred_date}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-[#E5E7EB]">
                <span className="text-[#6B7280] block">Collection Address:</span>
                <span className="font-medium text-[#111111]">{submittedRequest.collection_address}</span>
              </div>
            </div>

            {/* Completion Notification Policy Notice */}
            <div className="bg-[#EAF5ED] border border-[#16803C]/30 rounded-xl p-3.5 text-xs text-[#0f5c2b] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16803C] shrink-0" />
              <span>
                An automated confirmation will be sent to your {submittedRequest.customer_email ? 'email and phone' : 'phone'} once your collection process has been completed.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (onTrackRequest) {
                    onTrackRequest(submittedRequest.reference_code);
                  }
                  resetAndClose();
                }}
                className="w-full sm:w-1/2 py-3 px-4 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-sm rounded-lg transition-colors text-center"
              >
                Track This Request Live
              </button>
              <button
                onClick={resetAndClose}
                className="w-full sm:w-1/2 py-3 px-4 bg-[#F3F4F3] hover:bg-[#E5E7EB] text-[#252525] font-semibold text-sm rounded-lg transition-colors text-center"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[78vh] overflow-y-auto">
            {/* Disclaimer notice */}
            <div className="bg-[#EAF5ED] border border-[#16803C]/30 rounded-xl p-3.5 text-xs text-[#0f5c2b] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
              <span>
                <strong>&ldquo;{settings.official_slogan}&rdquo;</strong> — Complete the form below to request waste collection for your residence or commercial premises.
              </span>
            </div>

            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errors.form}
              </div>
            )}

            {/* Customer Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#252525] mb-2">
                1. Customer Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCustomerType('residential')}
                  className={`p-3 rounded-lg border text-sm font-semibold text-left transition-all flex items-center justify-between ${
                    customerType === 'residential'
                      ? 'border-[#16803C] bg-[#EAF5ED] text-[#16803C]'
                      : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-neutral-400'
                  }`}
                >
                  <span>Residential (Household/Estate)</span>
                  {customerType === 'residential' && <Check className="w-4 h-4 text-[#16803C]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('commercial')}
                  className={`p-3 rounded-lg border text-sm font-semibold text-left transition-all flex items-center justify-between ${
                    customerType === 'commercial'
                      ? 'border-[#16803C] bg-[#EAF5ED] text-[#16803C]'
                      : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-neutral-400'
                  }`}
                >
                  <span>Commercial / Institutional</span>
                  {customerType === 'commercial' && <Check className="w-4 h-4 text-[#16803C]" />}
                </button>
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. David Kamau"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C] focus:ring-1 focus:ring-[#16803C]"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Phone Number (Kenya) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +254 712 345 678"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C] focus:ring-1 focus:ring-[#16803C]"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Email Address <span className="text-xs text-[#6B7280] font-normal">(Optional for updates)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C] focus:ring-1 focus:ring-[#16803C]"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Service & Waste Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E7EB]">
              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Requested Service <span className="text-red-600">*</span>
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C] bg-white"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.serviceId && <p className="text-xs text-red-600 mt-1">{errors.serviceId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Service Area / Coverage Zone
                </label>
                <select
                  value={serviceAreaId}
                  onChange={(e) => setServiceAreaId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C] bg-white"
                >
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.county}: {a.area_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Waste Category & Description <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value)}
                  placeholder="e.g. Sorted dry plastics & cardboard, organic kitchen waste, garden trimmings"
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                />
                <p className="text-[11px] text-[#16803C] mt-1 font-medium">
                  Remember: &ldquo;Don&apos;t Mix It, Sort It, Taka Ni Pesa.&rdquo;
                </p>
                {errors.wasteType && <p className="text-xs text-red-600 mt-1">{errors.wasteType}</p>}
              </div>
            </div>

            {/* Location & Scheduling */}
            <div className="space-y-4 pt-2 border-t border-[#E5E7EB]">
              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Collection Address / Location Landmark <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={collectionAddress}
                    onChange={(e) => setCollectionAddress(e.target.value)}
                    placeholder="Street, Estate name, House/Apartment number, Nearest landmark"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                  />
                </div>
                {errors.collectionAddress && <p className="text-xs text-red-600 mt-1">{errors.collectionAddress}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252525] mb-1">
                    Preferred Collection Date <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                    <input
                      type="date"
                      value={preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                    />
                  </div>
                  {errors.preferredDate && <p className="text-xs text-red-600 mt-1">{errors.preferredDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252525] mb-1">
                    Estimated Quantity / Load Size <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={estimatedQuantity}
                    onChange={(e) => setEstimatedQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C] bg-white"
                  >
                    <option value="1-2 bags (small household)">1-2 bags (small household)</option>
                    <option value="3-5 bags (standard household)">3-5 bags (standard household)</option>
                    <option value="6-10 bags or multiple sacks">6-10 bags or multiple sacks</option>
                    <option value="1 large wheelie bin container (240L - 660L)">1 large wheelie bin container (240L - 660L)</option>
                    <option value="Pickup / tipper truck bulk load">Pickup / tipper truck bulk load</option>
                    <option value="Custom commercial consignment">Custom commercial consignment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1">
                  Additional Driver or Access Instructions <span className="text-xs text-[#6B7280] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Gate code, ring doorbell, notify estate security, bags placed behind garage"
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                />
              </div>
            </div>

            {/* Mandatory Booking Notice & Privacy Consent */}
            <div className="pt-2 border-t border-[#E5E7EB] space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 leading-relaxed">
                <strong>Booking Notice:</strong> {settings.booking_disclaimer}
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#252525]">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-[#E5E7EB] text-[#16803C] focus:ring-[#16803C]"
                />
                <span>
                  I agree to the privacy policy and confirm that my collection request is subject to review and confirmation by Celiglo Agency Limited staff.
                </span>
              </label>
              {errors.consent && <p className="text-xs text-red-600">{errors.consent}</p>}
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2 text-sm font-semibold text-[#6B7280] hover:text-[#111111] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  'Submit Collection Request'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
