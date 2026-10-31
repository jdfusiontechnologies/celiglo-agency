import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  Plus,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  LogOut,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Lock,
  ArrowRight
} from 'lucide-react';
import { CeligloStorage } from '../data/storage';
import { AppUser, CollectionRequest } from '../types';

interface CustomerPortalProps {
  onBackToHome: () => void;
  onRequestNewCollection: () => void;
  onOpenTracker: (refCode: string) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  onBackToHome,
  onRequestNewCollection,
  onOpenTracker,
}) => {
  const [session, setSession] = useState<{ user: AppUser } | null>(CeligloStorage.getCurrentSession());
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'profile' | 'support'>('requests');
  const [notificationPref, setNotificationPref] = useState<'both' | 'sms' | 'email'>('both');
  const [phoneInput, setPhoneInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const unsub = () => {
      const cur = CeligloStorage.getCurrentSession();
      setSession(cur);
      if (cur?.user) {
        // Enforce strict customer data isolation: customers can ONLY see their own records!
        const myRequests = CeligloStorage.getCustomerRequests(cur.user.id, cur.user.phone, cur.user.email);
        setRequests(myRequests);
        setPhoneInput(cur.user.phone);
      }
    };
    unsub();
    window.addEventListener('celiglo_store_change', unsub);
    return () => window.removeEventListener('celiglo_store_change', unsub);
  }, []);

  if (!session?.user) return null;

  const handleLogout = () => {
    CeligloStorage.clearSession();
    onBackToHome();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;

    const users = CeligloStorage.getUsers();
    const me = users.find((u) => u.id === session.user.id);
    if (me) {
      me.phone = phoneInput.trim();
      CeligloStorage.setCurrentSession(me);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const settings = CeligloStorage.getSettings();

  return (
    <div className="min-h-screen bg-[#F3F4F3] pb-16">
      {/* Top Customer Header */}
      <div className="bg-[#111111] text-white px-4 sm:px-6 lg:px-8 py-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16803C] text-white flex items-center justify-center font-bold text-sm shadow">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white">{session.user.name}</h1>
                <span className="text-[10px] bg-[#16803C] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Verified Customer
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {session.user.email} · Phone: <span className="font-mono">{session.user.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={onRequestNewCollection}
              className="px-4 py-2 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Book New Collection
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('requests')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'requests'
                ? 'bg-[#16803C] text-white shadow-sm'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <Package className="w-4 h-4" />
            My Collection Orders ({requests.length})
          </button>
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'profile'
                ? 'bg-[#16803C] text-white shadow-sm'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Notification &amp; Security Settings
          </button>
          <button
            onClick={() => setActiveSubTab('support')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'support'
                ? 'bg-[#16803C] text-white shadow-sm'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Customer Support
          </button>
        </div>

        {/* SUBTAB 1: MY REQUESTS & TRACKING */}
        {activeSubTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div>
                <h2 className="text-lg font-bold text-[#111111]">
                  My Collection &amp; Waste Orders
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Track progress, driver dispatch, and verified completion history.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#16803C] font-semibold bg-[#EAF5ED] px-3 py-1.5 rounded-lg border border-[#16803C]/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strict Customer Privacy Active</span>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-[#E5E7EB] text-center space-y-4">
                <Package className="w-12 h-12 text-[#6B7280] mx-auto opacity-50" />
                <h3 className="text-base font-bold text-[#111111]">No Collection Orders Found</h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                  You haven&apos;t placed any waste collection requests yet. Submit a booking and track its status live!
                </p>
                <button
                  onClick={onRequestNewCollection}
                  className="px-5 py-2.5 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm"
                >
                  Book Your First Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#16803C] transition-all p-5 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-extrabold text-[#16803C]">
                          {req.reference_code}
                        </span>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            req.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : req.status === 'In Progress' || req.status === 'Ready for Collection or Delivery'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-[#111111]">{req.service_name}</h4>
                        <p className="text-xs text-[#6B7280] mt-0.5 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#16803C]" />
                          <span className="line-clamp-2">{req.collection_address}</span>
                        </p>
                      </div>

                      <div className="bg-[#F3F4F3] p-3 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Pickup Date:</span>
                          <span className="font-bold font-mono text-[#111111]">{req.preferred_date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Waste Stream:</span>
                          <span className="text-[#252525] truncate max-w-[150px]">{req.waste_type}</span>
                        </div>
                        {req.assigned_staff_name && (
                          <div className="flex justify-between pt-1 border-t border-[#E5E7EB] text-[#16803C] font-semibold">
                            <span>Driver Captain:</span>
                            <span>{req.assigned_staff_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E5E7EB]">
                      <button
                        onClick={() => onOpenTracker(req.reference_code)}
                        className="w-full py-2 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>View Progress &amp; Timeline</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: NOTIFICATION & PROFILE SETTINGS */}
        {activeSubTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#111111]">
                Notification Preferences &amp; Phone Verification
              </h3>
              <p className="text-xs text-[#6B7280]">
                Ensure your Kenyan phone number is up-to-date to receive automated SMS updates via Africa&apos;s Talking.
              </p>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-[#EAF5ED] text-[#0f5c2b] text-xs font-bold rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
                Profile and notification preferences updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Registered Phone (for SMS updates):</label>
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg font-mono"
                  placeholder="+254 7XX XXX XXX"
                />
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Supported formats: 07XX XXX XXX or +254 7XX XXX XXX
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-1">Preferred Notification Channels:</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setNotificationPref('both')}
                    className={`p-3 rounded-lg border font-bold text-xs ${
                      notificationPref === 'both' ? 'border-[#16803C] bg-[#EAF5ED] text-[#16803C]' : 'border-[#E5E7EB]'
                    }`}
                  >
                    SMS &amp; Email (Both)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotificationPref('sms')}
                    className={`p-3 rounded-lg border font-bold text-xs ${
                      notificationPref === 'sms' ? 'border-[#16803C] bg-[#EAF5ED] text-[#16803C]' : 'border-[#E5E7EB]'
                    }`}
                  >
                    SMS Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotificationPref('email')}
                    className={`p-3 rounded-lg border font-bold text-xs ${
                      notificationPref === 'email' ? 'border-[#16803C] bg-[#EAF5ED] text-[#16803C]' : 'border-[#E5E7EB]'
                    }`}
                  >
                    Email Only
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Save Notification Preferences
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SUBTAB 3: CUSTOMER SUPPORT */}
        {activeSubTab === 'support' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Direct Customer Support Hotline</h3>
              <p className="text-xs text-[#6B7280]">
                Need immediate route assistance, urgent container clearance, or special handling?
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#F3F4F3] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[#6B7280] block">Operations Hotline:</span>
                  <a href={`tel:${settings.phone_primary}`} className="font-mono font-bold text-sm text-[#111111]">
                    {settings.phone_primary}
                  </a>
                </div>
                <a
                  href={`tel:${settings.phone_primary}`}
                  className="px-3 py-1.5 bg-[#16803C] text-white font-bold rounded-lg"
                >
                  Call Now
                </a>
              </div>

              <div className="p-4 bg-[#EAF5ED] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[#0f5c2b] block font-semibold">Instant WhatsApp Dispatch:</span>
                  <p className="font-mono font-bold text-sm text-[#111111]">{settings.whatsapp_number}</p>
                </div>
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\+/g, '')}?text=Hello%20Celiglo%20Agency,%20I%20am%20${encodeURIComponent(session.user.name)}%20inquiring%20about%20my%20collection.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#111111] text-[#FFD42A] font-bold rounded-lg"
                >
                  Open WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
