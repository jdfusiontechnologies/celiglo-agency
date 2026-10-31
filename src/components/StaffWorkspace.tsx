import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Search,
  Filter,
  LogOut,
  Send,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Check,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { CeligloStorage } from '../data/storage';
import { AppUser, CollectionRequest, RequestStatus } from '../types';

interface StaffWorkspaceProps {
  onBackToHome: () => void;
  onOpenTracker: (refCode: string) => void;
}

export const StaffWorkspace: React.FC<StaffWorkspaceProps> = ({
  onBackToHome,
  onOpenTracker,
}) => {
  const [session, setSession] = useState<{ user: AppUser } | null>(CeligloStorage.getCurrentSession());
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<CollectionRequest | null>(null);

  // Task update state
  const [targetStatus, setTargetStatus] = useState<RequestStatus>('In Progress');
  const [updateNotes, setUpdateNotes] = useState('');
  const [proofRef, setProofRef] = useState('');
  const [actionSuccessToast, setActionSuccessToast] = useState('');

  const loadData = () => {
    const cur = CeligloStorage.getCurrentSession();
    setSession(cur);
    if (cur?.user) {
      const assigned = CeligloStorage.getStaffAssignedRequests(cur.user.id);
      setRequests(assigned);
      if (selectedTask) {
        const refreshed = assigned.find((r) => r.id === selectedTask.id);
        if (refreshed) setSelectedTask(refreshed);
      }
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('celiglo_store_change', loadData);
    return () => window.removeEventListener('celiglo_store_change', loadData);
  }, []);

  if (!session?.user || session.user.role !== 'staff') {
    return null;
  }

  const handleLogout = () => {
    CeligloStorage.clearSession();
    onBackToHome();
  };

  const handleSelectTask = (task: CollectionRequest) => {
    setSelectedTask(task);
    setTargetStatus(task.status === 'Completed' ? 'Completed' : 'In Progress');
    setUpdateNotes('');
    setProofRef('');
  };

  const handleExecuteStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    const updated = CeligloStorage.updateRequestStatus(
      selectedTask.id,
      targetStatus,
      session.user,
      updateNotes || `Status updated to ${targetStatus} by field staff ${session.user.name}`,
      selectedTask.assigned_staff_id,
      proofRef.trim() || undefined
    );

    if (updated) {
      setSelectedTask(updated);
      const isCompleted = targetStatus === 'Completed';
      const emailNotice = isCompleted && updated.customer_email ? `email to ${updated.customer_email}` : '';
      const smsNotice = isCompleted && updated.customer_phone ? `SMS to ${updated.customer_phone}` : '';
      const notifs = [emailNotice, smsNotice].filter(Boolean).join(' and ');
      setActionSuccessToast(`Task ${updated.reference_code} updated to "${targetStatus}"${notifs ? ` (Instant notification dispatched: ${notifs})` : ''}.`);
      setTimeout(() => setActionSuccessToast(''), 5000);
      setUpdateNotes('');
      setProofRef('');
    }
  };

  // Metrics
  const totalAssigned = requests.length;
  const inProgressCount = requests.filter(
    (r) => r.status === 'In Progress' || r.status === 'Processing' || r.status === 'Ready for Collection or Delivery'
  ).length;
  const completedCount = requests.filter((r) => r.status === 'Completed' || r.status === 'Collected or Delivered').length;

  const filteredTasks = requests.filter((req) => {
    const matchesSearch =
      req.reference_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.collection_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.waste_type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') {
      return (
        req.status !== 'Completed' &&
        req.status !== 'Collected or Delivered' &&
        req.status !== 'Cancelled'
      );
    }
    return req.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-[#F3F4F3] text-[#252525] pb-16">
      {/* Toast */}
      {actionSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#111111] text-[#FFD42A] border-2 border-[#16803C] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Top Staff Bar */}
      <div className="bg-[#111111] text-white px-4 sm:px-6 lg:px-8 py-3.5 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16803C] text-white flex items-center justify-center font-bold text-sm shadow">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-white">Staff Field Operations Workspace</h1>
                <span className="text-[10px] bg-[#FFD42A] text-black px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Staff Role
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Logged in as: <strong className="text-white">{session.user.name}</strong> ({session.user.department || 'Field Logistics'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToHome}
              className="text-xs text-neutral-300 hover:text-white px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors font-semibold"
            >
              Public Website
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-rose-300 hover:text-rose-100 flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 rounded-lg transition-colors font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                Total Assigned Tasks
              </span>
              <span className="text-3xl font-black text-[#111111]">{totalAssigned}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F3F4F3] text-[#111111] flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                Active / In-Transit
              </span>
              <span className="text-3xl font-black text-[#16803C]">{inProgressCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#EAF5ED] text-[#16803C] flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                Completed &amp; Delivered
              </span>
              <span className="text-3xl font-black text-[#111111]">{completedCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFF9E6] text-[#B45309] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#16803C]" />
            </div>
          </div>
        </div>

        {/* Operating Guideline Banner */}
        <div className="bg-[#111111] text-white p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="bg-[#FFD42A] text-black px-2 py-1 rounded font-black text-[10px] uppercase">
              Field Standard
            </span>
            <span className="text-neutral-300">
              Company policy: Always verify segregation (<strong>&ldquo;DON&apos;T MIX IT, SORT IT, TAKA NI PESA.&rdquo;</strong>). When marking <strong className="text-emerald-400">Ready for Collection or Delivery</strong> or <strong className="text-emerald-400">Completed</strong>, our Africa&apos;s Talking SMS engine will automatically inform the customer.
            </span>
          </div>
        </div>

        {/* Main Grid: Tasks List & Task Action Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Task List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B7280]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search task code, client, address..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-[#16803C] text-white'
                        : 'bg-[#F3F4F3] text-[#252525] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    All ({requests.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      statusFilter === 'active'
                        ? 'bg-[#16803C] text-white'
                        : 'bg-[#F3F4F3] text-[#252525] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    Active Queue ({inProgressCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('Completed')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      statusFilter === 'Completed'
                        ? 'bg-[#16803C] text-white'
                        : 'bg-[#F3F4F3] text-[#252525] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    Completed ({completedCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Tasks Cards */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-dashed border-[#E5E7EB] text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#6B7280] mx-auto" />
                  <h3 className="font-bold text-sm text-[#111111]">No Tasks In This View</h3>
                  <p className="text-xs text-[#6B7280]">
                    You have cleared all items or no tasks match your current filter.
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isSelected = selectedTask?.id === task.id;
                  const isCompleted = task.status === 'Completed' || task.status === 'Collected or Delivered';

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleSelectTask(task)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#EAF5ED]/60 border-[#16803C] shadow-sm ring-1 ring-[#16803C]'
                          : 'bg-white border-[#E5E7EB] hover:border-[#16803C]/40 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#16803C]">
                              {task.reference_code}
                            </span>
                            <span className="text-[11px] font-semibold text-[#6B7280]">
                              · {task.service_name}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-[#111111] mt-0.5">
                            {task.customer_name}
                          </h4>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-[#EAF5ED] text-[#16803C]'
                              : task.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-[#6B7280] mb-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#16803C] shrink-0" />
                          <span className="truncate">{task.collection_address}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            {task.customer_phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            {task.preferred_date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]/70 text-xs">
                        <span className="text-[11px] font-semibold text-[#111111]">
                          Type: <span className="font-normal text-[#6B7280]">{task.waste_type} ({task.estimated_quantity})</span>
                        </span>
                        <span className="text-xs font-bold text-[#16803C] flex items-center gap-1">
                          Update Progress <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Task Action Panel (5 cols) */}
          <div className="lg:col-span-5">
            {selectedTask ? (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5 space-y-5 sticky top-24">
                <div className="border-b border-[#E5E7EB] pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-[#16803C]">
                      {selectedTask.reference_code}
                    </span>
                    <button
                      onClick={() => onOpenTracker(selectedTask.reference_code)}
                      className="text-[11px] font-bold text-[#16803C] hover:underline flex items-center gap-1"
                    >
                      Audit View <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <h3 className="text-base font-extrabold text-[#111111]">
                    {selectedTask.customer_name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {selectedTask.service_name} · {selectedTask.customer_type}
                  </p>
                </div>

                {/* Customer Contact & Destination */}
                <div className="bg-[#F3F4F3] p-3.5 rounded-xl space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#111111] block">Location:</span>
                      <span className="text-[#252525]">{selectedTask.collection_address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#16803C] shrink-0" />
                    <a
                      href={`tel:${selectedTask.customer_phone}`}
                      className="text-[#16803C] font-semibold hover:underline"
                    >
                      Call: {selectedTask.customer_phone}
                    </a>
                  </div>
                  {selectedTask.instructions && (
                    <div className="pt-1.5 border-t border-[#E5E7EB] text-[#6B7280]">
                      <strong className="text-[#111111]">Customer Note:</strong> "{selectedTask.instructions}"
                    </div>
                  )}
                </div>

                {/* Status Update Form */}
                <form onSubmit={handleExecuteStatusUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1.5">
                      Progress Lifecycle Status
                    </label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value as RequestStatus)}
                      className="w-full text-xs font-semibold px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:border-[#16803C]"
                    >
                      <option value="Request Received">Request Received</option>
                      <option value="Processing">Processing</option>
                      <option value="In Progress">In Progress (Dispatching / En Route)</option>
                      <option value="Awaiting Customer Action">Awaiting Customer Action</option>
                      <option value="Ready for Collection or Delivery">Ready for Collection or Delivery</option>
                      <option value="Collected or Delivered">Collected or Delivered</option>
                      <option value="Completed">Completed (Finalized)</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1.5">
                      Field Notes / Sorting Outcome
                    </label>
                    <textarea
                      rows={2}
                      value={updateNotes}
                      onChange={(e) => setUpdateNotes(e.target.value)}
                      placeholder="e.g. Segregation verified, recyclables loaded onto truck, no contamination..."
                      className="w-full text-xs p-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1.5">
                      Proof Reference / Weighbridge Ticket #
                    </label>
                    <input
                      type="text"
                      value={proofRef}
                      onChange={(e) => setProofRef(e.target.value)}
                      placeholder="e.g. TICKET-7892 / Signatory: Guard John"
                      className="w-full text-xs px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#16803C] hover:bg-[#0f5c2b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Submit Verified Progress
                  </button>
                </form>

                {/* Progress History of this task */}
                <div className="pt-4 border-t border-[#E5E7EB]">
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                    Verified Activity Trail ({selectedTask.status_history?.length || 0})
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                    {selectedTask.status_history?.map((hist) => (
                      <div key={hist.id} className="p-2.5 bg-[#F3F4F3] rounded-lg space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#111111]">{hist.to_status}</span>
                          <span className="text-[#6B7280] font-mono">
                            {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7280]">{hist.notes}</p>
                        {hist.proof_reference && (
                          <span className="text-[10px] font-mono text-[#16803C] block">
                            Ref: {hist.proof_reference}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center text-[#6B7280] space-y-3">
                <Truck className="w-10 h-10 mx-auto text-[#16803C]/40" />
                <h4 className="font-bold text-sm text-[#111111]">Select a Task to Update</h4>
                <p className="text-xs">
                  Click any assigned task from the left queue to enter status notes, record weighbridge numbers, and advance delivery stages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
