import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  ClipboardList,
  Layers,
  MapPin,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Calendar,
  AlertCircle,
  FileCode2,
  Database,
  Edit,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Eye,
  X,
  Trash2,
  Image as ImageIcon,
  Type,
  Sparkles,
  MessageSquare,
  Globe,
  Sliders,
  Smartphone,
  Users,
  Download,
  ShieldAlert,
  Send,
  Lock,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  ExternalLink,
  Shield,
  Key,
  Flame,
  Activity,
  EyeOff,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { CeligloStorage } from '../data/storage';
import {
  CollectionRequest,
  RequestStatus,
  ServiceItem,
  ServiceArea,
  ContactMessage,
  StaffMember,
  SiteSettings,
  TestimonialItem,
  BenefitItem,
  AppUser,
  NotificationLog,
  SmsProviderConfig,
  AuditLog,
  SecurityEvent,
  UserRole,
  FirewallConfig,
  IntrusionEvent,
  EnvVariableItem,
  FirewallProtectionMode,
} from '../types';
import { Logo } from './Logo';

interface AdminPortalProps {
  onBackToSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToSite }) => {
  const [session, setSession] = useState<{ user: AppUser } | null>(CeligloStorage.getCurrentSession());
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'requests'
    | 'firewall'
    | 'env-vars'
    | 'sms'
    | 'users'
    | 'reports'
    | 'audit'
    | 'services'
    | 'branding'
    | 'content'
    | 'areas'
    | 'messages'
    | 'settings'
    | 'export'
  >('dashboard');

  // Storage data
  const [requests, setRequests] = useState<CollectionRequest[]>(CeligloStorage.getRequests());
  const [services, setServices] = useState<ServiceItem[]>(CeligloStorage.getServices(false));
  const [areas, setAreas] = useState<ServiceArea[]>(CeligloStorage.getServiceAreas(false));
  const [staff, setStaff] = useState<StaffMember[]>(CeligloStorage.getStaff());
  const [messages, setMessages] = useState<ContactMessage[]>(CeligloStorage.getMessages());
  const [settings, setSettings] = useState<SiteSettings>(CeligloStorage.getSettings());
  const [users, setUsers] = useState<AppUser[]>(CeligloStorage.getUsers());
  const [smsConfig, setSmsConfig] = useState<SmsProviderConfig>(CeligloStorage.getSmsConfig());
  const [notifications, setNotifications] = useState<NotificationLog[]>(CeligloStorage.getNotifications());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(CeligloStorage.getAuditLogs());
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(CeligloStorage.getSecurityEvents());

  // Firewall & Intrusion Prevention state
  const [firewallConfig, setFirewallConfig] = useState<FirewallConfig>(CeligloStorage.getFirewallConfig());
  const [intrusionLogs, setIntrusionLogs] = useState<IntrusionEvent[]>(CeligloStorage.getIntrusionLogs());
  const [intrusionFilter, setIntrusionFilter] = useState<string>('all');
  const [newBannedIp, setNewBannedIp] = useState('');
  const [simulatedResult, setSimulatedResult] = useState<IntrusionEvent | null>(null);

  // Environment Variables Manager & Quick Toggles state
  const [envVariables, setEnvVariables] = useState<EnvVariableItem[]>(CeligloStorage.getEnvVariables());
  const [emailDispatchActive, setEmailDispatchActive] = useState<boolean>(smsConfig.email_notifications_enabled !== false);
  const [smsDispatchActive, setSmsDispatchActive] = useState<boolean>(smsConfig.is_enabled);
  const [senderEmailChoice, setSenderEmailChoice] = useState<string>(smsConfig.smtp_from_email || 'jdfusiontechnologies@gmail.com');
  const [isAddEnvOpen, setIsAddEnvOpen] = useState(false);
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');
  const [newEnvCategory, setNewEnvCategory] = useState<'email' | 'database' | 'sms' | 'security' | 'custom'>('custom');
  const [newEnvDesc, setNewEnvDesc] = useState('');
  const [newEnvIsSecret, setNewEnvIsSecret] = useState(false);
  const [revealedEnvIds, setRevealedEnvIds] = useState<Set<string>>(new Set());

  // Requests filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<CollectionRequest | null>(null);

  // Status transition state
  const [transitionStatus, setTransitionStatus] = useState<RequestStatus>('Request Received');
  const [transitionNotes, setTransitionNotes] = useState('');
  const [transitionStaffId, setTransitionStaffId] = useState('');
  const [transitionProof, setTransitionProof] = useState('');

  // Settings & Editable Parts editing state
  const [editSettings, setEditSettings] = useState<SiteSettings>(settings);
  const [settingsSavedToast, setSettingsSavedToast] = useState('');

  // Live Production & Demo Reset State
  const [isResetLiveModalOpen, setIsResetLiveModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const demoRecordsCount = requests.filter(
    (r) =>
      r.reference_code === 'CEL-2026-8192' ||
      r.reference_code === 'CEL-2026-7734' ||
      r.reference_code === 'CEL-2026-6410' ||
      r.reference_code === 'CEL-2026-4190' ||
      r.reference_code === 'CEL-2026-3821'
  ).length;

  const handleExecuteLiveReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      CeligloStorage.resetToCleanLiveProduction(session?.user?.name || 'Joshua Mwenda (Super Admin)');
      setIsResetting(false);
      setIsResetLiveModalOpen(false);
      showToast('🚀 Clean live production initialized! All demo data has been wiped.');
    }, 350);
  };

  // SMS Live Test State
  const [testSmsPhone, setTestSmsPhone] = useState('+254 712 345 678');
  const [testSmsSuccess, setTestSmsSuccess] = useState('');

  // Live Gateway API Inputs
  const [smsApiKeyInput, setSmsApiKeyInput] = useState(smsConfig.api_key_masked || '');
  const [smsUsernameInput, setSmsUsernameInput] = useState(smsConfig.username || '');
  const [smsSenderIdInput, setSmsSenderIdInput] = useState(smsConfig.sender_id || 'CELIGLO');
  const [emailApiKeyInput, setEmailApiKeyInput] = useState(smsConfig.email_api_key || '');
  const [emailProviderInput, setEmailProviderInput] = useState(smsConfig.email_provider || 'Gmail');
  const [smtpFromEmailInput, setSmtpFromEmailInput] = useState(smsConfig.smtp_from_email || 'jdfusiontechnologies@gmail.com');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showEmailPass, setShowEmailPass] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState(smsConfig.smtp_from_email || 'jdfusiontechnologies@gmail.com');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    isAuthError?: boolean;
    user?: string;
  } | null>(null);

  // Audit Logs Filter
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSeverity, setAuditSeverity] = useState('all');

  // Services Edit/Add Modal state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isNewService, setIsNewService] = useState(false);
  const [serviceFormData, setServiceFormData] = useState<{
    id?: string;
    name: string;
    slug: string;
    summary: string;
    description: string;
    image_path: string;
    category: 'residential' | 'commercial' | 'specialized';
    featuresText: string;
    is_active: boolean;
  }>({
    name: '',
    slug: '',
    summary: '',
    description: '',
    image_path: '/src/assets/images/celiglo_hero_truck_1792757709754.jpg',
    category: 'residential',
    featuresText: '',
    is_active: true,
  });

  // Testimonial Modal State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialFormData, setTestimonialFormData] = useState<TestimonialItem>({
    id: '',
    name: '',
    role: '',
    quote: '',
  });

  // Area Modal State
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaCounty, setNewAreaCounty] = useState('Nairobi');
  const [newAreaNotes, setNewAreaNotes] = useState('');
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);

  const refreshAllData = () => {
    const s = CeligloStorage.getSettings();
    setRequests(CeligloStorage.getRequests());
    setServices(CeligloStorage.getServices(false));
    setAreas(CeligloStorage.getServiceAreas(false));
    setStaff(CeligloStorage.getStaff());
    setMessages(CeligloStorage.getMessages());
    setSettings(s);
    setEditSettings(s);
    setUsers(CeligloStorage.getUsers());
    const currentSmsCfg = CeligloStorage.getSmsConfig();
    setSmsConfig(currentSmsCfg);
    setEmailDispatchActive(currentSmsCfg.email_notifications_enabled !== false);
    setSmsDispatchActive(currentSmsCfg.is_enabled);
    setSenderEmailChoice(currentSmsCfg.smtp_from_email || 'jdfusiontechnologies@gmail.com');
    setNotifications(CeligloStorage.getNotifications());
    setAuditLogs(CeligloStorage.getAuditLogs());
    setSecurityEvents(CeligloStorage.getSecurityEvents());
    setFirewallConfig(CeligloStorage.getFirewallConfig());
    setIntrusionLogs(CeligloStorage.getIntrusionLogs());
    setEnvVariables(CeligloStorage.getEnvVariables());
    setSession(CeligloStorage.getCurrentSession());
  };

  useEffect(() => {
    refreshAllData();
    window.addEventListener('celiglo_store_change', refreshAllData);
    return () => window.removeEventListener('celiglo_store_change', refreshAllData);
  }, []);

  const showToast = (msg: string) => {
    setSettingsSavedToast(msg);
    setTimeout(() => setSettingsSavedToast(''), 3500);
  };

  const isSuperAdmin = session?.user?.role === 'super_admin';

  const handleLogout = () => {
    CeligloStorage.clearSession();
    onBackToSite();
  };

  // Open Request details
  const handleOpenRequest = (req: CollectionRequest) => {
    setSelectedRequest(req);
    setTransitionStatus(req.status);
    setTransitionNotes(req.internal_notes || '');
    setTransitionStaffId(req.assigned_staff_id || '');
    setTransitionProof('');
  };

  // Confirm Status update
  const handleExecuteStatusUpdate = () => {
    if (!selectedRequest) return;
    const updated = CeligloStorage.updateRequestStatus(
      selectedRequest.id,
      transitionStatus,
      session?.user || 'Administrator',
      transitionNotes,
      transitionStaffId || undefined,
      transitionProof.trim() || undefined
    );
    if (updated) {
      setSelectedRequest(updated);
      const isCompleted = transitionStatus === 'Completed';
      const emailNotice = isCompleted && updated.customer_email ? `instant email dispatched to ${updated.customer_email}` : '';
      const smsNotice = isCompleted && smsConfig.is_enabled && updated.customer_phone ? `instant SMS sent to ${updated.customer_phone}` : '';
      const notifs = [emailNotice, smsNotice].filter(Boolean).join(' and ');
      showToast(
        `Request ${updated.reference_code} moved to "${transitionStatus}"${notifs ? `: ${notifs}` : ''}.`
      );
    }
  };

  // Explicit manual dispatch of instant Email & SMS notification to user once process is completed
  const handleManualNotifyRequest = () => {
    if (!selectedRequest) return;
    const currentConfig = CeligloStorage.getSmsConfig();
    CeligloStorage.triggerAutomaticNotification(selectedRequest, 'Completed', currentConfig);
    const emailNotice = selectedRequest.customer_email ? `instant email dispatched to ${selectedRequest.customer_email} via ${currentConfig.smtp_from_email}` : '';
    const smsNotice = currentConfig.is_enabled && selectedRequest.customer_phone ? `instant SMS sent to ${selectedRequest.customer_phone}` : '';
    const notifs = [emailNotice, smsNotice].filter(Boolean).join(' and ');
    showToast(`Instant completion notification triggered: ${notifs || 'logged in audit trail'}.`);
    refreshAllData();
  };

  // Retry Failed Notification
  const handleRetryNotification = (id: string) => {
    const success = CeligloStorage.retryNotification(id, session?.user?.name || 'Administrator');
    if (success) {
      showToast('Notification re-queued and marked as delivered.');
    }
  };

  // Toggle SMS Provider Sandbox vs Production
  const handleToggleSmsMode = () => {
    const newMode = smsConfig.mode === 'sandbox' ? 'production' : 'sandbox';
    const updated = CeligloStorage.updateSmsConfig(
      { mode: newMode },
      session?.user?.name || 'Administrator'
    );
    setSmsConfig(updated);
    showToast(`Africa's Talking mode changed to ${newMode.toUpperCase()}.`);
  };

  // Toggle User Active / Suspended
  const handleToggleUserStatus = (userId: string) => {
    CeligloStorage.toggleUserStatus(userId, session?.user?.name || 'Super Admin');
    showToast('User status updated in RBAC registry.');
  };

  // Change User Role
  const handleChangeUserRole = (userId: string, newRole: UserRole) => {
    CeligloStorage.updateUserRole(userId, newRole, session?.user?.name || 'Super Admin');
    showToast(`User role updated to ${newRole}.`);
  };

  // Send Test SMS
  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testSmsPhone.trim()) return;
    CeligloStorage.sendTestSms(testSmsPhone.trim());
    setTestSmsSuccess(`Test SMS dispatched to ${testSmsPhone.trim()} via Africa's Talking gateway.`);
    setTimeout(() => setTestSmsSuccess(''), 4000);
  };

  // Save True Live API Credentials
  const handleSaveApiCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = CeligloStorage.updateSmsConfig(
      {
        api_key_masked: smsApiKeyInput.trim(),
        username: smsUsernameInput.trim(),
        sender_id: smsSenderIdInput.trim() || 'CELIGLO',
        email_api_key: emailApiKeyInput.trim(),
        email_provider: emailProviderInput,
        smtp_from_email: smtpFromEmailInput.trim() || 'jdfusiontechnologies@gmail.com',
        is_enabled: true,
      },
      session?.user?.name || 'Administrator'
    );
    setSmsConfig(updated);
    showToast('Live API Gateway credentials saved successfully.');
  };

  // Send Real Live Test Email via Gmail API/SMTP
  const handleSendRealTestEmail = async (e?: React.FormEvent, overrideFrom?: string) => {
    if (e) e.preventDefault();
    if (!testEmailRecipient.trim()) return;
    setIsSendingTestEmail(true);
    setTestEmailResult(null);
    try {
      const fromAddr = (overrideFrom || smtpFromEmailInput).trim() || 'jdfusiontechnologies@gmail.com';
      const cleanPass = emailApiKeyInput.replace(/[\s\-_"']/g, '').trim();
      const res = await CeligloStorage.sendRealTestEmail(
        testEmailRecipient.trim(),
        cleanPass,
        fromAddr
      );
      setTestEmailResult(res);
      if (res.success) {
        showToast('Real test email delivered to inbox!');
      }
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        error: err.message || 'Failed to dispatch email.',
        isAuthError: String(err.message || '').includes('535') || String(err.message || '').includes('Invalid login'),
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Firewall Actions
  const handleToggleFirewallRule = (field: keyof FirewallConfig) => {
    const currentVal = firewallConfig[field];
    if (typeof currentVal === 'boolean') {
      const updated = CeligloStorage.updateFirewallConfig(
        { [field]: !currentVal },
        session?.user?.name || 'Super Admin'
      );
      setFirewallConfig(updated);
      showToast(`Firewall rule ${String(field)} set to ${!currentVal ? 'ACTIVE' : 'DISABLED'}.`);
    }
  };

  const handleChangeProtectionMode = (mode: FirewallProtectionMode) => {
    const updated = CeligloStorage.updateFirewallConfig(
      { protection_mode: mode },
      session?.user?.name || 'Super Admin'
    );
    setFirewallConfig(updated);
    showToast(`Firewall Protection Mode switched to ${mode.toUpperCase()}.`);
  };

  const handleSimulateAttack = (attackType: IntrusionEvent['attack_type']) => {
    const event = CeligloStorage.testSimulateAttack(attackType);
    setSimulatedResult(event);
    refreshAllData();
    showToast(`WAF Intercepted & Blocked ${attackType}! Threat neutralized.`);
    setTimeout(() => setSimulatedResult(null), 8000);
  };

  const handleBanIp = (ip: string) => {
    if (!ip.trim()) return;
    CeligloStorage.banIpAddress(ip.trim(), session?.user?.name || 'Super Admin');
    fetch('/api/waf/ban-ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip: ip.trim() }),
    }).catch(() => {});
    setNewBannedIp('');
    refreshAllData();
    showToast(`IP ${ip.trim()} added to WAF Blacklist.`);
  };

  const handleUnbanIp = (ip: string) => {
    CeligloStorage.unbanIpAddress(ip, session?.user?.name || 'Super Admin');
    fetch('/api/waf/unban-ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip }),
    }).catch(() => {});
    refreshAllData();
    showToast(`IP ${ip} removed from WAF Blacklist.`);
  };

  const handleClearIntrusions = () => {
    if (window.confirm('Clear all recorded intrusion attempts from the live monitor?')) {
      CeligloStorage.clearIntrusionLogs(session?.user?.name || 'Super Admin');
      refreshAllData();
      showToast('Intrusion attempt logs cleared.');
    }
  };

  // Quick Notification Action Toggles
  const handleToggleEmailDispatch = (active: boolean) => {
    CeligloStorage.setEmailNotificationsActive(active, session?.user?.name || 'Super Admin');
    setEmailDispatchActive(active);
    showToast(`Email Dispatch is now ${active ? 'ACTIVATED' : 'DEACTIVATED'}.`);
  };

  const handleToggleSmsDispatch = (active: boolean) => {
    CeligloStorage.setSmsNotificationsActive(active, session?.user?.name || 'Super Admin');
    setSmsDispatchActive(active);
    showToast(`SMS Dispatch is now ${active ? 'ACTIVATED' : 'DEACTIVATED'}.`);
  };

  const handleSaveSenderEmail = (email: string) => {
    const clean = email.trim();
    if (!clean) return;
    CeligloStorage.setSenderEmail(clean, session?.user?.name || 'Super Admin');
    setSenderEmailChoice(clean);
    setSmtpFromEmailInput(clean);
    showToast(`Sender Email updated to ${clean}.`);
  };

  // Environment Variables Actions
  const handleToggleRevealEnv = (id: string) => {
    setRevealedEnvIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddEnvVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnvKey.trim()) return;
    CeligloStorage.addEnvVariable(
      {
        key: newEnvKey.trim().toUpperCase().replace(/\s+/g, '_'),
        value: newEnvValue.trim(),
        category: newEnvCategory,
        description: newEnvDesc.trim() || 'Custom runtime environment variable',
        is_secret: newEnvIsSecret,
      },
      session?.user?.name || 'Super Admin'
    );
    setNewEnvKey('');
    setNewEnvValue('');
    setNewEnvDesc('');
    setIsAddEnvOpen(false);
    refreshAllData();
    showToast('Environment variable added to runtime registry.');
  };

  const handleDeleteEnvVariable = (id: string) => {
    if (window.confirm('Delete this environment variable?')) {
      CeligloStorage.deleteEnvVariable(id, session?.user?.name || 'Super Admin');
      refreshAllData();
      showToast('Environment variable deleted.');
    }
  };

  const handleUpdateEnvValue = (id: string, value: string) => {
    CeligloStorage.updateEnvVariable(id, { value }, session?.user?.name || 'Super Admin');
    refreshAllData();
    showToast('Environment variable updated.');
  };

  const handleCopyAllEnv = () => {
    const lines = envVariables.map((v) => `# ${v.description}\n${v.key}="${v.value}"`).join('\n\n');
    navigator.clipboard.writeText(lines);
    showToast('All environment variables copied in .env format!');
  };

  // Service Management actions
  const handleOpenAddService = () => {
    setIsNewService(true);
    setServiceFormData({
      name: '',
      slug: '',
      summary: '',
      description: '',
      image_path: '/src/assets/images/celiglo_hero_truck_1792757709754.jpg',
      category: 'residential',
      featuresText: 'Scheduled collection\nHygienic transport\nReference tracking',
      is_active: true,
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: ServiceItem) => {
    setIsNewService(false);
    setServiceFormData({
      id: srv.id,
      name: srv.name,
      slug: srv.slug,
      summary: srv.summary,
      description: srv.description,
      image_path: srv.image_path,
      category: srv.category,
      featuresText: srv.features.join('\n'),
      is_active: srv.is_active,
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveServiceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormData.name.trim()) return;

    const featuresArray = serviceFormData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const slug =
      serviceFormData.slug.trim() ||
      serviceFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (isNewService) {
      CeligloStorage.addService({
        name: serviceFormData.name.trim(),
        slug,
        summary: serviceFormData.summary.trim(),
        description: serviceFormData.description.trim(),
        image_path: serviceFormData.image_path,
        category: serviceFormData.category,
        features: featuresArray.length > 0 ? featuresArray : ['Reliable collection', 'Certified handling'],
        is_active: serviceFormData.is_active,
      });
      showToast(`Service "${serviceFormData.name}" created successfully.`);
    } else if (serviceFormData.id) {
      CeligloStorage.saveService({
        id: serviceFormData.id,
        name: serviceFormData.name.trim(),
        slug,
        summary: serviceFormData.summary.trim(),
        description: serviceFormData.description.trim(),
        image_path: serviceFormData.image_path,
        category: serviceFormData.category,
        features: featuresArray.length > 0 ? featuresArray : ['Reliable collection', 'Certified handling'],
        is_active: serviceFormData.is_active,
      });
      showToast(`Service "${serviceFormData.name}" updated successfully.`);
    }

    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete service "${name}"?`)) {
      CeligloStorage.deleteService(id);
      showToast(`Service "${name}" was removed.`);
    }
  };

  // Testimonial actions
  const handleOpenAddTestimonial = () => {
    setTestimonialFormData({
      id: `t-${Date.now()}`,
      name: '',
      role: '',
      quote: '',
    });
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (testi: TestimonialItem) => {
    setTestimonialFormData({ ...testi });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonialForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialFormData.name.trim() || !testimonialFormData.quote.trim()) return;

    const currentList = [...editSettings.testimonials];
    const existingIndex = currentList.findIndex((t) => t.id === testimonialFormData.id);

    if (existingIndex >= 0) {
      currentList[existingIndex] = testimonialFormData;
    } else {
      currentList.push(testimonialFormData);
    }

    const updated = CeligloStorage.updateSettings({ testimonials: currentList });
    setEditSettings(updated);
    setIsTestimonialModalOpen(false);
    showToast('Customer reviews updated.');
  };

  const handleDeleteTestimonial = (id: string) => {
    const currentList = editSettings.testimonials.filter((t) => t.id !== id);
    const updated = CeligloStorage.updateSettings({ testimonials: currentList });
    setEditSettings(updated);
    showToast('Review removed.');
  };

  // Service Area actions
  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    CeligloStorage.addServiceArea(newAreaName.trim(), newAreaCounty, newAreaNotes.trim() || undefined);
    setNewAreaName('');
    setNewAreaNotes('');
    setIsAreaModalOpen(false);
    showToast(`Coverage area "${newAreaName}" added.`);
  };

  const handleDeleteArea = (id: string, name: string) => {
    if (window.confirm(`Remove coverage area "${name}"?`)) {
      CeligloStorage.deleteServiceArea(id);
      showToast(`Area "${name}" removed.`);
    }
  };

  // Save Settings
  const handleSaveSettings = () => {
    const updated = CeligloStorage.updateSettings(editSettings);
    setSettings(updated);
    showToast('Settings & content updated successfully.');
  };

  // Calculation Stats
  const stats = {
    total: requests.length,
    received: requests.filter((r) => r.status === 'Request Received').length,
    processing: requests.filter((r) => r.status === 'Processing').length,
    inProgress: requests.filter((r) => r.status === 'In Progress').length,
    awaitingAction: requests.filter((r) => r.status === 'Awaiting Customer Action').length,
    ready: requests.filter((r) => r.status === 'Ready for Collection or Delivery').length,
    collected: requests.filter((r) => r.status === 'Collected or Delivered').length,
    completed: requests.filter((r) => r.status === 'Completed').length,
    cancelled: requests.filter((r) => r.status === 'Cancelled').length,
    unreadMessages: messages.filter((m) => m.status === 'unread').length,
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchQuery =
      searchQuery === '' ||
      r.reference_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer_phone.includes(searchQuery) ||
      r.collection_address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Filter audit logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchQ =
      auditSearch === '' ||
      log.user_name.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(auditSearch.toLowerCase());

    const matchSev = auditSeverity === 'all' || log.severity === auditSeverity;
    return matchQ && matchSev;
  });

  return (
    <div className="min-h-screen bg-[#F3F4F3] text-[#252525] pb-16">
      {/* Toast Notification */}
      {settingsSavedToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#111111] text-[#FFD42A] border-2 border-[#16803C] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
          <span>{settingsSavedToast}</span>
        </div>
      )}

      {/* Admin Top Bar */}
      <div className="bg-[#111111] text-white px-4 sm:px-6 lg:px-8 py-3.5 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16803C] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
              CA
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>{editSettings.company_name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                    isSuperAdmin
                      ? 'bg-[#FFD42A] text-black ring-1 ring-amber-300'
                      : 'bg-[#16803C] text-white'
                  }`}
                >
                  {isSuperAdmin ? 'SUPER ADMIN (EXECUTIVE)' : 'ADMIN CONSOLE'}
                </span>
              </h1>
              <p className="text-[11px] text-neutral-400">
                Logged in as: <strong className="text-white">{session?.user?.name || 'Administrator'}</strong> ({session?.user?.email})
                {session?.user?.mfa_enabled && (
                  <span className="ml-2 text-emerald-400 font-mono text-[10px]">● MFA ACTIVE</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToSite}
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

      {/* Super Admin Executive Banner */}
      {isSuperAdmin && (
        <div className="bg-[#FFF9E6] border-b border-[#FFD42A] px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-[#854D0E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#B45309]" />
            <span>EXECUTIVE OVERSIGHT ACTIVE: Full operational authority, SMS gateway management, RBAC controls, and tamper-resistant audit logs.</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Africa's Talking: <strong className="font-mono text-black">{smsConfig.mode.toUpperCase()}</strong></span>
            <span>SMS Balance: <strong className="font-mono text-black">KES {smsConfig.account_balance_kes.toFixed(2)}</strong></span>
          </div>
        </div>
      )}

      {/* Live Production Readiness & Demo Data Status Banner */}
      {demoRecordsCount > 0 ? (
        <div className="bg-amber-50 border-b border-amber-300 px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>Demo Mode ({demoRecordsCount} sample orders)</span>
          </div>
          <button
            type="button"
            onClick={() => setIsResetLiveModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data &amp; Go Live</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border-b border-emerald-300 px-4 sm:px-6 lg:px-8 py-2 text-xs text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
            <span>Live Production (0 demo requests)</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Load sample demonstration data?')) {
                CeligloStorage.resetToFactoryData();
                showToast('Sample demonstration requests loaded.');
              }
            }}
            className="text-[11px] text-emerald-800 hover:text-emerald-950 underline font-semibold cursor-pointer"
          >
            Load Sample Data
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E7EB] pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'requests'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Requests ({requests.length})
          </button>

          <button
            onClick={() => setActiveTab('firewall')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'firewall'
                ? 'bg-rose-700 text-white shadow-xs ring-2 ring-rose-400'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <Shield className="w-4 h-4 text-rose-600" />
            <span>Firewall &amp; IPS</span>
            <span className="bg-rose-900 text-rose-100 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
              {firewallConfig.total_threats_blocked} BLOCKED
            </span>
          </button>

          <button
            onClick={() => setActiveTab('env-vars')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'env-vars'
                ? 'bg-[#111111] text-[#FFD42A] shadow-xs ring-2 ring-amber-400'
                : 'bg-white text-[#111111] hover:bg-neutral-100 border border-neutral-300'
            }`}
          >
            <Key className="w-4 h-4 text-[#FFD42A]" />
            <span>Step 3 Env &amp; Toggles</span>
          </button>

          <button
            onClick={() => setActiveTab('sms')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'sms'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            SMS &amp; Notifications ({notifications.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'users'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <Users className="w-4 h-4" />
            Accounts &amp; RBAC ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'reports'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <Download className="w-4 h-4" />
            Reports &amp; CSV
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'audit'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Audit Logs ({auditLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'services'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <Layers className="w-4 h-4" />
            Services Editor ({services.length})
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'branding'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Logo &amp; Slogan
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'content'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <Type className="w-4 h-4" />
            Editable Parts
          </button>

          <button
            onClick={() => setActiveTab('areas')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'areas'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Service Areas ({areas.length})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'messages'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <Mail className="w-4 h-4" />
            Inquiries ({messages.length})
            {stats.unreadMessages > 0 && <span className="w-2 h-2 rounded-full bg-[#FFD42A]" />}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'settings'
                ? 'bg-[#16803C] text-white shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            Hub &amp; Hotline
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'export'
                ? 'bg-[#111111] text-[#FFD42A] shadow-xs'
                : 'bg-white text-[#252525] hover:bg-[#E5E7EB]'
            }`}
          >
            <FileCode2 className="w-4 h-4 text-[#16803C]" />
            Deployment
          </button>
        </div>

        {/* TAB 1: OPERATIONS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Live Launch Quick Action if Demo Data Present */}
            {demoRecordsCount > 0 && (
              <div className="bg-neutral-900 text-white rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span className="text-xs font-semibold">
                    Demo Mode Active ({demoRecordsCount} sample booking orders in queue)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResetLiveModalOpen(true)}
                  className="px-4 py-2 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data &amp; Go Live</span>
                </button>
              </div>
            )}

            {/* 8-Stage Lifecycle KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider block">
                  Received
                </span>
                <p className="text-xl font-extrabold text-[#111111] font-mono tabular-nums">
                  {stats.received}
                </p>
              </div>

              <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">
                  Processing
                </span>
                <p className="text-xl font-extrabold text-blue-900 font-mono tabular-nums">
                  {stats.processing}
                </p>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                  In Progress
                </span>
                <p className="text-xl font-extrabold text-amber-900 font-mono tabular-nums">
                  {stats.inProgress}
                </p>
              </div>

              <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider block">
                  Awaiting Action
                </span>
                <p className="text-xl font-extrabold text-purple-900 font-mono tabular-nums">
                  {stats.awaitingAction}
                </p>
              </div>

              <div className="bg-teal-50 p-3.5 rounded-xl border border-teal-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block">
                  Ready Collection
                </span>
                <p className="text-xl font-extrabold text-teal-900 font-mono tabular-nums">
                  {stats.ready}
                </p>
              </div>

              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                  Collected
                </span>
                <p className="text-xl font-extrabold text-emerald-900 font-mono tabular-nums">
                  {stats.collected}
                </p>
              </div>

              <div className="bg-emerald-100 p-3.5 rounded-xl border border-emerald-300 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider block">
                  Completed
                </span>
                <p className="text-xl font-extrabold text-emerald-950 font-mono tabular-nums">
                  {stats.completed}
                </p>
              </div>

              <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider block">
                  Cancelled
                </span>
                <p className="text-xl font-extrabold text-rose-900 font-mono tabular-nums">
                  {stats.cancelled}
                </p>
              </div>
            </div>

            {/* Quick Actions & Triage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Needs Dispatch Review */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <div>
                    <h3 className="font-bold text-base text-[#111111]">
                      Urgent Triage: Incoming Collection Orders
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      Orders pending review or dispatching to field staff.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setStatusFilter('Request Received');
                      setActiveTab('requests');
                    }}
                    className="text-xs font-bold text-[#16803C] hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-2.5">
                  {requests
                    .filter((r) => r.status === 'Request Received' || r.status === 'Processing')
                    .slice(0, 5)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="p-3.5 bg-[#F3F4F3] hover:bg-[#EAF5ED] rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-4 transition-colors text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#16803C]">
                              {req.reference_code}
                            </span>
                            <span className="text-[#6B7280]">·</span>
                            <strong className="text-[#111111]">{req.customer_name}</strong>
                            <span className="text-[#6B7280]">({req.customer_phone})</span>
                          </div>
                          <p className="text-[#6B7280] truncate max-w-md">
                            {req.service_name} · {req.collection_address}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            handleOpenRequest(req);
                            setActiveTab('requests');
                          }}
                          className="px-3 py-1.5 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-bold rounded-lg shrink-0"
                        >
                          Triage Order
                        </button>
                      </div>
                    ))}
                  {requests.filter((r) => r.status === 'Request Received' || r.status === 'Processing').length === 0 && (
                    <p className="text-xs text-[#6B7280] py-6 text-center">
                      All collection orders are currently assigned or in progress!
                    </p>
                  )}
                </div>
              </div>

              {/* Field Operations Crew Roster */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <h3 className="font-bold text-base text-[#111111]">
                    Field Operations Crew
                  </h3>
                  <span className="text-xs text-[#16803C] font-bold">
                    {staff.length} Active Operatives
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  {staff.map((member) => {
                    const assignedTasks = requests.filter(
                      (r) => r.assigned_staff_id === member.id || r.assigned_staff_id === member.user_id
                    );
                    const activeCount = assignedTasks.filter(
                      (r) => r.status !== 'Completed' && r.status !== 'Cancelled'
                    ).length;

                    return (
                      <div key={member.id} className="p-3 bg-[#F3F4F3] rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#111111]">{member.full_name}</p>
                          <p className="text-[#6B7280]">{member.role}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-[#16803C] block">
                            {activeCount} active tasks
                          </span>
                          <span className="text-[10px] text-[#6B7280]">{member.phone}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REQUESTS MANAGEMENT */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by code, customer, phone, or address..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-[#6B7280] font-semibold whitespace-nowrap">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:border-[#16803C]"
                >
                  <option value="all">All Statuses ({requests.length})</option>
                  <option value="Request Received">Request Received ({stats.received})</option>
                  <option value="Processing">Processing ({stats.processing})</option>
                  <option value="In Progress">In Progress ({stats.inProgress})</option>
                  <option value="Awaiting Customer Action">Awaiting Customer Action ({stats.awaitingAction})</option>
                  <option value="Ready for Collection or Delivery">Ready for Collection or Delivery ({stats.ready})</option>
                  <option value="Collected or Delivered">Collected or Delivered ({stats.collected})</option>
                  <option value="Completed">Completed ({stats.completed})</option>
                  <option value="Cancelled">Cancelled ({stats.cancelled})</option>
                </select>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111111] text-white uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Pickup Date</th>
                      <th className="py-3 px-4">Assigned Staff</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[#F3F4F3] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#16803C]">
                          {req.reference_code}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-[#111111]">{req.customer_name}</p>
                          <p className="text-[#6B7280]">{req.customer_phone}</p>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#252525]">
                          {req.service_name}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums">
                          {req.preferred_date}
                        </td>
                        <td className="py-3 px-4 text-[#252525]">
                          {req.assigned_staff_name || (
                            <span className="text-[#6B7280] italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              req.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.status === 'Collected or Delivered' || req.status === 'Ready for Collection or Delivery'
                                ? 'bg-[#EAF5ED] text-[#16803C]'
                                : req.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : req.status === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenRequest(req)}
                            className="px-3 py-1 bg-[#F3F4F3] hover:bg-[#16803C] hover:text-white text-[#111111] font-bold rounded transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#6B7280]">
                          No collection requests match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Request Detail Drawer */}
            {selectedRequest && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] my-8 overflow-hidden space-y-6 p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#16803C] uppercase">
                        Request ID: {selectedRequest.reference_code}
                      </span>
                      <h3 className="text-xl font-bold text-[#111111]">
                        Manage Collection Order
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="p-1 text-[#6B7280] hover:text-[#111111]"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-[#F3F4F3] p-4 rounded-xl">
                    <div>
                      <span className="text-[#6B7280] block">Customer Name:</span>
                      <span className="font-bold text-[#111111]">{selectedRequest.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block">Phone:</span>
                      <span className="font-bold text-[#111111]">{selectedRequest.customer_phone}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block">Email Address:</span>
                      <span className="font-mono text-[#16803C] font-semibold">
                        {selectedRequest.customer_email || 'Not provided'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block">Customer Category:</span>
                      <span className="capitalize text-[#111111]">{selectedRequest.customer_type}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block">Preferred Pickup Date:</span>
                      <span className="font-mono text-[#111111]">{selectedRequest.preferred_date}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block">Service:</span>
                      <span className="font-bold text-[#111111]">{selectedRequest.service_name}</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-[#E5E7EB]">
                      <span className="text-[#6B7280] block">Pickup Location / Address:</span>
                      <span className="text-[#111111]">{selectedRequest.collection_address}</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-[#E5E7EB]">
                      <span className="text-[#6B7280] block">Waste Details &amp; Quantity:</span>
                      <span className="text-[#111111]">{selectedRequest.waste_type} ({selectedRequest.estimated_quantity})</span>
                    </div>
                  </div>

                  {/* Lifecycle Status Updater Form */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                      Update Request Lifecycle Status
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold mb-1">Status Lifecycle:</label>
                        <select
                          value={transitionStatus}
                          onChange={(e) => setTransitionStatus(e.target.value as RequestStatus)}
                          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:border-[#16803C]"
                        >
                          <option value="Request Received">Request Received</option>
                          <option value="Processing">Processing</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Awaiting Customer Action">Awaiting Customer Action</option>
                          <option value="Ready for Collection or Delivery">Ready for Collection or Delivery</option>
                          <option value="Collected or Delivered">Collected or Delivered</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Assign Driver / Staff:</label>
                        <select
                          value={transitionStaffId}
                          onChange={(e) => setTransitionStaffId(e.target.value)}
                          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:border-[#16803C]"
                        >
                          <option value="">Unassigned</option>
                          {staff.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.full_name} ({s.role})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1">
                          Proof Reference / Weighbridge Ticket #:
                        </label>
                        <input
                          type="text"
                          value={transitionProof}
                          onChange={(e) => setTransitionProof(e.target.value)}
                          placeholder="e.g. WB-9921 / Guard Sign-off"
                          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1">
                          Internal Dispatcher Notes / Client Message:
                        </label>
                        <textarea
                          rows={2}
                          value={transitionNotes}
                          onChange={(e) => setTransitionNotes(e.target.value)}
                          placeholder="e.g. Route confirmed, driver assigned for morning slot."
                          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#EAF5ED] border border-[#16803C]/30 rounded-xl text-xs text-[#0f5c2b] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
                          Automatic Instant Notification Delivery
                        </span>
                        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#16803C]/30 font-bold text-[#16803C]">
                          Sender: {smsConfig.smtp_from_email || 'jdfusiontechnologies@gmail.com'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#252525]">
                        Messages are <strong>only sent once process is Completed</strong>. When marked <strong>Completed</strong>, an instant email is dispatched to{' '}
                        <strong className="text-[#16803C]">{selectedRequest.customer_email || 'the customer'}</strong> and an SMS to{' '}
                        <strong className="text-[#16803C]">{selectedRequest.customer_phone}</strong> {smsConfig.is_enabled ? "(SMS active via Africa's Talking)" : '(SMS inactive)'}.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E7EB]">
                      <button
                        type="button"
                        onClick={handleManualNotifyRequest}
                        className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                        title="Dispatch instant Email to user and SMS to user's phone right now"
                      >
                        <Send className="w-3.5 h-3.5 text-[#FFD42A]" />
                        <span>Send Instant Email &amp; SMS Now</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(null)}
                          className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#6B7280] hover:bg-[#F3F4F3]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleExecuteStatusUpdate}
                          className="px-5 py-2 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Update Status &amp; Notify</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activity History */}
                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-2">
                      Verified Progress Trail ({selectedRequest.status_history?.length || 0})
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                      {selectedRequest.status_history?.map((hist) => (
                        <div key={hist.id} className="p-2.5 bg-[#F3F4F3] rounded-lg space-y-0.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#111111]">{hist.to_status}</span>
                            <span className="text-[#6B7280] font-mono">
                              {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {hist.staff_name}
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
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SMS & NOTIFICATIONS HUB (Africa's Talking) */}
        {activeTab === 'sms' && (
          <div className="space-y-6">
            {/* Top Config & Balance Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
                  SMS Gateway
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-[#111111]">{smsConfig.provider_name}</span>
                  <button
                    onClick={handleToggleSmsMode}
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      smsConfig.mode === 'sandbox'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {smsConfig.mode.toUpperCase()} (Toggle)
                  </button>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Sender ID: <span className="font-mono font-bold text-black">{smsConfig.sender_id}</span>
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
                  Account Balance
                </span>
                <p className="text-2xl font-black text-[#16803C] font-mono">
                  KES {smsConfig.account_balance_kes.toFixed(2)}
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  Standard Rate: <span className="font-mono font-bold">KES {smsConfig.rate_per_sms_kes.toFixed(2)}/SMS</span>
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
                  Monthly Cap &amp; Usage
                </span>
                <p className="text-2xl font-black text-[#111111] font-mono">
                  {smsConfig.current_month_sent} / {smsConfig.monthly_sms_limit}
                </p>
                <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#16803C] h-full"
                    style={{ width: `${Math.min(100, (smsConfig.current_month_sent / smsConfig.monthly_sms_limit) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
                  Safety Safeguards
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[#16803C] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Duplicate Suppression
                  </div>
                  <div className="flex items-center gap-1.5 text-[#16803C] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Overrun Spend Cap
                  </div>
                </div>
              </div>
            </div>

            {/* Live Gateway API Configuration Panel */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                <div>
                  <h3 className="font-extrabold text-base text-[#111111] flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#16803C]" />
                    Live SMS &amp; Email API Gateway Settings
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Connect your real Africa's Talking API key, Sender ID, and Email credentials to send automated SMS/Email notifications to Kenyan phone numbers.
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    smsApiKeyInput ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {smsApiKeyInput ? 'API Configured' : 'Awaiting Live Key'}
                </span>
              </div>

              <form onSubmit={handleSaveApiCredentials} className="space-y-4 text-xs">
                {/* SMS Gateway Section */}
                <div className="p-4 bg-[#F3F4F3] rounded-xl space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#16803C]">
                    1. Africa's Talking / SMS Gateway Credentials
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Gateway Username *</label>
                      <input
                        type="text"
                        value={smsUsernameInput}
                        onChange={(e) => setSmsUsernameInput(e.target.value)}
                        placeholder="e.g. celiglo_sms or sandbox"
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Approved Sender ID</label>
                      <input
                        type="text"
                        value={smsSenderIdInput}
                        onChange={(e) => setSmsSenderIdInput(e.target.value)}
                        placeholder="e.g. CELIGLO"
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white uppercase font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">API Environment</label>
                      <select
                        value={smsConfig.mode}
                        onChange={(e) => {
                          const updated = CeligloStorage.updateSmsConfig(
                            { mode: e.target.value as any },
                            session?.user?.name || 'Administrator'
                          );
                          setSmsConfig(updated);
                        }}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white font-semibold"
                      >
                        <option value="production">Production (Live Safaricom/Airtel SMS)</option>
                        <option value="sandbox">Sandbox (Testing / Pre-production)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold">Africa's Talking Live API Key *</label>
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="text-[11px] text-[#16803C] hover:underline font-semibold"
                        >
                          {showApiKey ? 'Hide Key' : 'Reveal Key'}
                        </button>
                      </div>
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={smsApiKeyInput}
                        onChange={(e) => setSmsApiKeyInput(e.target.value)}
                        placeholder="Paste your live Africa's Talking API key here (atsk_...)"
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Gateway Section (Gmail Integration) */}
                <div className="p-4 bg-[#F3F4F3] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#16803C] flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      2. Real Email Dispatch Gateway (Gmail Account Integration)
                    </h4>
                    <span className="text-[11px] text-[#16803C] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Primary: jdfusiontechnologies@gmail.com
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Email Provider</label>
                      <select
                        value={emailProviderInput}
                        onChange={(e) => setEmailProviderInput(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white font-medium"
                      >
                        <option value="Gmail">Gmail (Official: jdfusiontechnologies@gmail.com)</option>
                        <option value="SMTP">Custom SMTP (cPanel / Other Mail Server)</option>
                        <option value="SendGrid">SendGrid API</option>
                        <option value="AmazonSES">Amazon SES</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-semibold">From Gmail Address</label>
                      </div>
                      <input
                        type="email"
                        value={smtpFromEmailInput}
                        onChange={(e) => setSmtpFromEmailInput(e.target.value)}
                        placeholder="jdfusiontechnologies@gmail.com"
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white font-medium"
                      />
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="text-[#6B7280]">Select:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSmtpFromEmailInput('jdfusiontechnologies@gmail.com');
                            setTestEmailRecipient('jdfusiontechnologies@gmail.com');
                          }}
                          className={`px-1.5 py-0.5 rounded border transition-colors ${
                            smtpFromEmailInput.toLowerCase() === 'jdfusiontechnologies@gmail.com'
                              ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-800'
                              : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          jdfusiontechnologies@gmail.com
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSmtpFromEmailInput('joshuamwenda36@gmail.com');
                            setTestEmailRecipient('joshuamwenda36@gmail.com');
                          }}
                          className={`px-1.5 py-0.5 rounded border transition-colors ${
                            smtpFromEmailInput.toLowerCase() === 'joshuamwenda36@gmail.com'
                              ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-800'
                              : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          joshuamwenda36@gmail.com
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold">
                          {emailProviderInput === 'Gmail' ? 'Gmail App Password (16 chars) *' : 'Email Password / API Key *'}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowEmailPass(!showEmailPass)}
                          className="text-[11px] text-[#16803C] hover:underline font-semibold"
                        >
                          {showEmailPass ? 'Hide' : 'Reveal'}
                        </button>
                      </div>
                      <input
                        type={showEmailPass ? 'text' : 'password'}
                        value={emailApiKeyInput}
                        onChange={(e) => setEmailApiKeyInput(e.target.value)}
                        placeholder={emailProviderInput === 'Gmail' ? '16-character code (e.g. abcd efgh ijkl mnop)' : '••••••••••••••••'}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white font-mono text-xs"
                      />
                      <span className="text-[10px] text-[#6B7280] mt-1 block">
                        Spaces and hyphens are automatically cleaned when sending.
                      </span>
                    </div>
                  </div>

                  {/* Gmail Direct Link */}
                  {emailProviderInput === 'Gmail' && (
                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-amber-900 font-semibold">
                        <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Google App Passwords Portal</span>
                      </div>
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Open App Passwords</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-500 text-[11px]">
                    Credentials are saved in your system configuration and loaded automatically by the backend email service.
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Save Live API Credentials
                  </button>
                </div>
              </form>
            </div>

            {/* Live Testing Gateways: SMS & Real Gmail Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Real Gmail Dispatch & Delivery Verifier */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#111111] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#16803C]" />
                    Real Gmail Delivery Verifier
                  </h3>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Live SMTP
                  </span>
                </div>

                <p className="text-xs text-[#6B7280]">
                  Sends an actual, real email directly from <strong className="text-black font-semibold">{smtpFromEmailInput || 'jdfusiontechnologies@gmail.com'}</strong> to verify that your Google App Password is authenticated.
                </p>

                {testEmailResult && (
                  <div className="space-y-3">
                    <div
                      className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
                        testEmailResult.success
                          ? 'bg-[#EAF5ED] text-[#16803C] border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {testEmailResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <p className="whitespace-pre-line">{testEmailResult.message || testEmailResult.error}</p>
                        {testEmailResult.success && (
                          <p className="text-[11px] text-emerald-700">
                            Please check your inbox at <span className="font-bold">{testEmailRecipient}</span> (and check Spam / Promotions if it's the first time).
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Buttons on Auth Failure */}
                    {!testEmailResult.success &&
                      (testEmailResult.isAuthError ||
                        String(testEmailResult.error || '').includes('535') ||
                        String(testEmailResult.error || '').includes('Invalid login') ||
                        String(testEmailResult.error || '').includes('Username and password rejected')) && (
                        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-xs text-amber-950">
                          <p className="font-semibold text-amber-900">
                            Authentication failed for {smtpFromEmailInput}. Select account or open App Passwords:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSmtpFromEmailInput('joshuamwenda36@gmail.com');
                                setTestEmailRecipient('joshuamwenda36@gmail.com');
                                handleSendRealTestEmail(undefined, 'joshuamwenda36@gmail.com');
                              }}
                              className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg text-xs transition-colors"
                            >
                              Send as joshuamwenda36@gmail.com
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSmtpFromEmailInput('jdfusiontechnologies@gmail.com');
                                setTestEmailRecipient('jdfusiontechnologies@gmail.com');
                                handleSendRealTestEmail(undefined, 'jdfusiontechnologies@gmail.com');
                              }}
                              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white font-bold rounded-lg text-xs transition-colors"
                            >
                              Send as jdfusiontechnologies@gmail.com
                            </button>
                            <a
                              href="https://myaccount.google.com/apppasswords"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-white border border-amber-400 text-amber-900 font-bold rounded-lg text-xs hover:bg-amber-100 flex items-center gap-1"
                            >
                              <span>App Passwords</span>
                              <ExternalLink className="w-3 h-3 text-amber-700" />
                            </a>
                          </div>
                        </div>
                      )}
                  </div>
                )}

                <form onSubmit={handleSendRealTestEmail} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                      Recipient Email Address:
                    </label>
                    <input
                      type="email"
                      value={testEmailRecipient}
                      onChange={(e) => setTestEmailRecipient(e.target.value)}
                      placeholder="e.g. jdfusiontechnologies@gmail.com"
                      className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C] font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingTestEmail}
                    className="w-full px-4 py-2.5 bg-[#16803C] hover:bg-[#0f5c2b] disabled:bg-neutral-400 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isSendingTestEmail ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Authenticating &amp; Sending via Gmail...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Real Test Email via Gmail</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* SMS Gateway Simulator */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#111111] flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#16803C]" />
                    Africa's Talking SMS Gateway
                  </h3>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {smsConfig.mode.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-[#6B7280]">
                  Dispatches automated SMS updates to Kenyan mobile numbers (+254) with sender ID <strong className="text-black font-semibold">{smsConfig.sender_id}</strong>.
                </p>

                {testSmsSuccess && (
                  <div className="p-3 bg-[#EAF5ED] text-[#16803C] rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{testSmsSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSendTestSms} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                      Recipient Kenyan Phone Number:
                    </label>
                    <input
                      type="text"
                      value={testSmsPhone}
                      onChange={(e) => setTestSmsPhone(e.target.value)}
                      placeholder="+254 712 345 678"
                      className="w-full px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test SMS Notification</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Notification Queue & Audit Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#111111]">
                    Notification Dispatch Audit Trail
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Real-time logs of SMS and Email dispatches, status codes, delivery receipts, and retry actions.
                  </p>
                </div>
                <button
                  onClick={() => CeligloStorage.exportNotificationsCsv()}
                  className="px-3 py-1.5 bg-[#F3F4F3] hover:bg-[#111111] hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Logs CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111111] text-white uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">Message Content</th>
                      <th className="py-3 px-4">Cost (KES)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {notifications.map((notif) => (
                      <tr key={notif.id} className="hover:bg-[#F3F4F3] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#16803C]">
                          {notif.reference_code}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-[#111111]">{notif.recipient_name}</p>
                          <p className="text-[#6B7280] font-mono">{notif.recipient_phone}</p>
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] font-bold">
                          {notif.channel} ({notif.provider === 'africas_talking' ? "Africa's Talking" : 'Email'})
                        </td>
                        <td className="py-3 px-4 max-w-sm truncate text-[#6B7280]" title={notif.message_content}>
                          {notif.message_content}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {notif.cost_kes > 0 ? `KES ${notif.cost_kes.toFixed(2)}` : 'Free'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              notif.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : notif.status === 'queued'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {notif.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {notif.status === 'failed' ? (
                            <button
                              onClick={() => handleRetryNotification(notif.id)}
                              className="px-2.5 py-1 bg-[#FFD42A] text-black font-bold rounded text-[11px] hover:bg-[#eec41e]"
                            >
                              Retry
                            </button>
                          ) : (
                            <span className="text-[#6B7280] text-[10px] font-mono">Delivered</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {notifications.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#6B7280]">
                          No notifications recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: USER ACCOUNTS & RBAC */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#111111]">
                    Role-Based Access Control (RBAC) Registry
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Manage permissions for Super Admin, Admin, Staff (Drivers/Operatives), and Customers with strict record isolation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111111] text-white uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Contact Details</th>
                      <th className="py-3 px-4">Assigned Role</th>
                      <th className="py-3 px-4">Security / MFA</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F3F4F3] transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-[#111111]">{u.name}</p>
                          <p className="text-[10px] text-[#6B7280] font-mono">{u.id}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-[#252525]">{u.email}</p>
                          <p className="text-[#6B7280] font-mono">{u.phone}</p>
                        </td>
                        <td className="py-3 px-4">
                          {isSuperAdmin && u.id !== session?.user?.id ? (
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeUserRole(u.id, e.target.value as UserRole)}
                              className="px-2 py-1 border border-[#E5E7EB] rounded font-semibold text-xs bg-white"
                            >
                              <option value="customer">Customer</option>
                              <option value="staff">Staff / Driver</option>
                              <option value="admin">Administrator</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          ) : (
                            <span className="font-bold uppercase text-[11px] text-[#16803C]">
                              {u.role}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {u.mfa_enabled ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5" /> MFA Enabled
                            </span>
                          ) : (
                            <span className="text-[#6B7280] text-[11px]">Standard Password</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              u.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isSuperAdmin && u.id !== session?.user?.id && (
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                                u.status === 'active'
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {u.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REPORTS & CSV EXPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-3">
              <div>
                <h3 className="text-xl font-bold text-[#111111]">Executive Operational Reports &amp; CSV Data Hub</h3>
                <p className="text-xs text-[#6B7280]">
                  Generate and download complete data-driven CSV exports for accounting, fleet management, and environmental compliance audits.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-[#F3F4F3] rounded-xl border border-[#E5E7EB] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#16803C] text-white flex items-center justify-center mb-2">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-[#111111]">Collection Orders Register</h4>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Complete log of {requests.length} requests including references, customer contact, waste streams, and assigned drivers.
                    </p>
                  </div>
                  <button
                    onClick={() => CeligloStorage.exportRequestsCsv()}
                    className="w-full py-2 px-3 bg-[#16803C] hover:bg-[#0f5c2b] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Download Requests CSV
                  </button>
                </div>

                <div className="p-4 bg-[#F3F4F3] rounded-xl border border-[#E5E7EB] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#FFD42A] flex items-center justify-center mb-2">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-[#111111]">Tamper-Resistant Audit Log</h4>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Full forensic record of {auditLogs.length} actions, status shifts, staff IDs, IP addresses, and severity levels.
                    </p>
                  </div>
                  <button
                    onClick={() => CeligloStorage.exportAuditLogsCsv()}
                    className="w-full py-2 px-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Download Audit Trail CSV
                  </button>
                </div>

                <div className="p-4 bg-[#F3F4F3] rounded-xl border border-[#E5E7EB] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#FFF9E6] text-[#B45309] flex items-center justify-center mb-2">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-[#111111]">SMS Dispatch &amp; Billing Log</h4>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Billing breakdown of {notifications.length} SMS/Email dispatches, cost per message (KES 0.80), and delivery statuses.
                    </p>
                  </div>
                  <button
                    onClick={() => CeligloStorage.exportNotificationsCsv()}
                    className="w-full py-2 px-3 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Download SMS Logs CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS & SECURITY */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Search logs by action, user, or details..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#16803C]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B7280] font-semibold">Severity:</span>
                <select
                  value={auditSeverity}
                  onChange={(e) => setAuditSeverity(e.target.value)}
                  className="px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-white"
                >
                  <option value="all">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111111] text-white uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Entity</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Client IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#F3F4F3] transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap text-[#6B7280]">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-[#111111]">{log.user_name}</p>
                          <span className="text-[10px] uppercase font-bold text-[#16803C]">
                            {log.user_role}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#111111]">
                          {log.action}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#6B7280]">
                          {log.entity_type}:{log.entity_id}
                        </td>
                        <td className="py-3 px-4 max-w-sm truncate text-[#252525]">
                          {log.details}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              log.severity === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : log.severity === 'high'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#6B7280]">
                          {log.ip_address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SERVICES EDITOR */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#111111]">Company Services Management</h3>
                <p className="text-xs text-[#6B7280]">
                  Create, edit, toggle visibility, and update descriptions of waste management services.
                </p>
              </div>
              <button
                onClick={handleOpenAddService}
                className="px-4 py-2 bg-[#16803C] hover:bg-[#0f5c2b] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className={`bg-white rounded-2xl border ${
                    srv.is_active ? 'border-[#E5E7EB]' : 'border-dashed border-neutral-300 opacity-60'
                  } p-5 space-y-4 shadow-xs`}
                >
                  <div className="h-40 rounded-xl overflow-hidden bg-neutral-100 relative">
                    <img
                      src={srv.image_path}
                      alt={srv.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/70 text-white">
                      {srv.category}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-base text-[#111111]">{srv.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          srv.is_active ? 'bg-[#EAF5ED] text-[#16803C]' : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {srv.is_active ? 'Active' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] line-clamp-2">{srv.summary}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] text-xs">
                    <button
                      onClick={() => handleOpenEditService(srv)}
                      className="px-3 py-1.5 bg-[#F3F4F3] hover:bg-[#16803C] hover:text-white rounded-lg font-bold transition-colors"
                    >
                      Edit Service
                    </button>
                    <button
                      onClick={() => handleDeleteService(srv.id, srv.name)}
                      className="text-rose-600 hover:text-rose-800 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Edit Modal */}
            {isServiceModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#E5E7EB] shadow-2xl">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-base text-[#111111]">
                      {isNewService ? 'Create Service' : 'Edit Service'}
                    </h3>
                    <button onClick={() => setIsServiceModalOpen(false)}>
                      <X className="w-5 h-5 text-[#6B7280]" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveServiceForm} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Service Title *</label>
                      <input
                        type="text"
                        required
                        value={serviceFormData.name}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Category</label>
                      <select
                        value={serviceFormData.category}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value as any })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="specialized">Specialized</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Short Summary</label>
                      <input
                        type="text"
                        value={serviceFormData.summary}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, summary: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Full Description</label>
                      <textarea
                        rows={3}
                        value={serviceFormData.description}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Bullet Features (One per line)</label>
                      <textarea
                        rows={3}
                        value={serviceFormData.featuresText}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, featuresText: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="srv-active"
                        checked={serviceFormData.is_active}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, is_active: e.target.checked })}
                      />
                      <label htmlFor="srv-active" className="font-semibold text-xs">
                        Publish Service to Public Website
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t">
                      <button
                        type="button"
                        onClick={() => setIsServiceModalOpen(false)}
                        className="px-4 py-2 border rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#16803C] text-white font-bold rounded-lg"
                      >
                        Save Service
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: LOGO & BRANDING */}
        {activeTab === 'branding' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] max-w-3xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#111111]">Corporate Identity &amp; Slogan</h3>
              <p className="text-xs text-[#6B7280]">
                Official brand identity preserved according to Celiglo Agency Limited requirements.
              </p>
            </div>

            <div className="p-4 bg-[#EAF5ED] border border-[#16803C]/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#16803C] font-bold">
                Slogan
              </span>
              <p className="text-lg font-black text-[#111111] tracking-wide">
                {editSettings.official_slogan}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Company Registered Name:</label>
                <input
                  type="text"
                  value={editSettings.company_name}
                  onChange={(e) => setEditSettings({ ...editSettings, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Slogan Text:</label>
                <input
                  type="text"
                  value={editSettings.official_slogan}
                  onChange={(e) => setEditSettings({ ...editSettings, official_slogan: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Logo Rendering Mode:</label>
                  <select
                    value={editSettings.logo_mode}
                    onChange={(e) => setEditSettings({ ...editSettings, logo_mode: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white"
                  >
                    <option value="svg_emblem">SVG Environmental Emblem</option>
                    <option value="custom_image">Custom Uploaded Logo URL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">SVG Emblem Graphic Symbol:</label>
                  <select
                    value={editSettings.logo_symbol}
                    onChange={(e) => setEditSettings({ ...editSettings, logo_symbol: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg bg-white"
                  >
                    <option value="recycling_arrows">Circular Recycling Arrows</option>
                    <option value="eco_leaf">Eco Leaf Sustainable</option>
                    <option value="modern_clean">Modern Minimalist Clean</option>
                  </select>
                </div>
              </div>

              {editSettings.logo_mode === 'custom_image' && (
                <div>
                  <label className="block font-semibold mb-1">Custom Image URL:</label>
                  <input
                    type="text"
                    value={editSettings.custom_logo_url}
                    onChange={(e) => setEditSettings({ ...editSettings, custom_logo_url: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg"
                  />
                </div>
              )}

              <div className="p-4 bg-[#F3F4F3] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#111111] block mb-1">Live Logo Preview:</span>
                  <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] inline-block">
                    <Logo size="md" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Save Brand Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: EDITABLE PARTS */}
        {activeTab === 'content' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] max-w-4xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#111111]">Editable Homepage Sections</h3>
              <p className="text-xs text-[#6B7280]">
                Customize the hero headline, company intro text, and client testimonials without touching code.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Hero Main Headline:</label>
                <input
                  type="text"
                  value={editSettings.hero_headline}
                  onChange={(e) => setEditSettings({ ...editSettings, hero_headline: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Hero Subtitle:</label>
                <textarea
                  rows={2}
                  value={editSettings.hero_subtitle}
                  onChange={(e) => setEditSettings({ ...editSettings, hero_subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Company Intro Headline:</label>
                <input
                  type="text"
                  value={editSettings.company_intro_headline}
                  onChange={(e) => setEditSettings({ ...editSettings, company_intro_headline: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Company Intro Body Text:</label>
                <textarea
                  rows={4}
                  value={editSettings.company_intro_text}
                  onChange={(e) => setEditSettings({ ...editSettings, company_intro_text: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Save Homepage Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: SERVICE AREAS */}
        {activeTab === 'areas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#111111]">Kenyan Operational Coverage Areas</h3>
                <p className="text-xs text-[#6B7280]">
                  Configure served counties and collection pickup zones.
                </p>
              </div>
              <button
                onClick={() => setIsAreaModalOpen(true)}
                className="px-4 py-2 bg-[#16803C] hover:bg-[#0f5c2b] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Coverage Area
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {areas.map((area) => (
                <div key={area.id} className="bg-white p-4 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#111111]">{area.area_name}</h4>
                    <p className="text-xs text-[#6B7280]">{area.county} County</p>
                  </div>
                  <button
                    onClick={() => handleDeleteArea(area.id, area.area_name)}
                    className="text-rose-600 hover:text-rose-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {isAreaModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#E5E7EB]">
                  <h3 className="font-bold text-base text-[#111111]">Add Service Area</h3>
                  <form onSubmit={handleAddArea} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Area / Neighborhood *</label>
                      <input
                        type="text"
                        required
                        value={newAreaName}
                        onChange={(e) => setNewAreaName(e.target.value)}
                        placeholder="e.g. Westlands / Kilimani"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">County *</label>
                      <input
                        type="text"
                        required
                        value={newAreaCounty}
                        onChange={(e) => setNewAreaCounty(e.target.value)}
                        placeholder="Nairobi"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <button type="button" onClick={() => setIsAreaModalOpen(false)} className="px-4 py-2 border rounded-lg">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 bg-[#16803C] text-white font-bold rounded-lg">
                        Save Area
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 11: INQUIRIES */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#111111]">Website Customer Inquiries ({messages.length})</h3>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-white p-5 rounded-xl border border-[#E5E7EB] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#111111]">{msg.name}</span>
                      <span className="text-[#6B7280] ml-2">({msg.email} · {msg.phone})</span>
                    </div>
                    <span className="text-[10px] text-[#6B7280]">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#16803C]">{msg.subject}</h4>
                  <p className="text-[#252525] bg-[#F3F4F3] p-3 rounded-lg">{msg.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-xs text-[#6B7280] py-8 text-center bg-white rounded-2xl">
                  No inquiries received yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 12: HUB & HOTLINE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] max-w-3xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#111111]">Kenya Operations Hub &amp; Contact Lines</h3>
              <p className="text-xs text-[#6B7280]">
                Configure public phone numbers, WhatsApp dispatch, office address, and booking notice.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Primary Hotline (Kenya):</label>
                  <input
                    type="text"
                    value={editSettings.phone_primary}
                    onChange={(e) => setEditSettings({ ...editSettings, phone_primary: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">WhatsApp Hotline (+254...):</label>
                  <input
                    type="text"
                    value={editSettings.whatsapp_number}
                    onChange={(e) => setEditSettings({ ...editSettings, whatsapp_number: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Physical Hub Address (Kenya):</label>
                <input
                  type="text"
                  value={editSettings.physical_address}
                  onChange={(e) => setEditSettings({ ...editSettings, physical_address: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Operating Hours:</label>
                <input
                  type="text"
                  value={editSettings.service_hours}
                  onChange={(e) => setEditSettings({ ...editSettings, service_hours: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                >
                  Save Settings
                </button>
              </div>

              {/* Database Controls */}
              <div className="mt-6 pt-6 border-t border-[#E5E7EB] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#111111]">Database Controls</h4>
                    <p className="text-xs text-[#6B7280]">
                      Status: {demoRecordsCount > 0 ? `${demoRecordsCount} Demo Records Active` : 'Clean Live Production (0 Demo Records)'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsResetLiveModalOpen(true)}
                    className="px-4 py-2.5 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Demo Data &amp; Start Live Website</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Populate sample demonstration requests?')) {
                        CeligloStorage.resetToFactoryData();
                        showToast('Sample demonstration records restored.');
                      }
                    }}
                    className="px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Load Sample Demo Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SECURED WEB APPLICATION FIREWALL & INTRUSION PREVENTION (WAF / IPS) */}
        {activeTab === 'firewall' && (
          <div className="space-y-6">
            {/* Top Firewall Hero Banner */}
            <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-2xl border-2 border-rose-900/60 shadow-xl space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-800">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      WAF ACTIVE DEFENSE SHIELD
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">KENYA CLOUD PERIMETER</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
                    <Shield className="w-7 h-7 text-rose-500" />
                    <span>Autonomous Web Application Firewall &amp; Intrusion Defense</span>
                  </h3>
                  <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                    Protects Celiglo Agency website, customer records, database credentials, and operational endpoints from malicious intrusions, automated scrapers, SQL injections, and unauthorized parameter tampering.
                  </p>
                </div>

                {/* Protection Tier Switcher */}
                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 space-y-2 shrink-0">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                    Protection Tier
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {(['standard', 'strict', 'lockdown'] as FirewallProtectionMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => handleChangeProtectionMode(mode)}
                        className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                          firewallConfig.protection_mode === mode
                            ? mode === 'lockdown'
                              ? 'bg-rose-600 text-white shadow-md'
                              : mode === 'strict'
                              ? 'bg-[#16803C] text-white shadow-md'
                              : 'bg-amber-600 text-white'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {mode === 'strict' ? 'Strict Armor' : mode === 'lockdown' ? 'Lockdown' : 'Standard'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800 space-y-0.5">
                  <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider">Threats Blocked</span>
                  <p className="text-2xl font-black text-rose-400 font-mono tabular-nums">{firewallConfig.total_threats_blocked}</p>
                  <span className="text-[10px] text-neutral-400">Neutralized at gateway</span>
                </div>

                <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800 space-y-0.5">
                  <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider">Defense State</span>
                  <p className="text-2xl font-black text-emerald-400 font-mono">ARMED</p>
                  <span className="text-[10px] text-neutral-400">Zero-Trust Rules Active</span>
                </div>

                <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800 space-y-0.5">
                  <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider">Blacklisted IPs</span>
                  <p className="text-2xl font-black text-amber-400 font-mono tabular-nums">{firewallConfig.banned_ips.length}</p>
                  <span className="text-[10px] text-neutral-400">Jailed persistent attackers</span>
                </div>

                <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800 space-y-0.5">
                  <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider">Rate Limiter</span>
                  <p className="text-2xl font-black text-sky-400 font-mono">120 RPM</p>
                  <span className="text-[10px] text-neutral-400">Anti-DDoS / Anti-Brute Force</span>
                </div>
              </div>
            </div>



            {/* Active Protection Policies & Toggles */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <h4 className="font-bold text-sm text-[#111111] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16803C]" />
                  Active Security Policies &amp; Protection Modules
                </h4>
                <span className="text-xs text-neutral-500 font-mono">Instant Gateway Filtering</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-extrabold text-sm text-[#111111] block">SQL Injection Guard</span>
                    <p className="text-[#6B7280] text-[11px] mt-1">
                      Scans query strings and request bodies for UNION, DROP TABLE, stacked queries, and blind SQLi vectors.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleFirewallRule('block_sql_injection')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      firewallConfig.block_sql_injection
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-300 text-neutral-700'
                    }`}
                  >
                    {firewallConfig.block_sql_injection ? '● ACTIVE (BLOCKING)' : '○ DISABLED'}
                  </button>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-extrabold text-sm text-[#111111] block">XSS Script Filter</span>
                    <p className="text-[#6B7280] text-[11px] mt-1">
                      Intercepts malicious javascript payloads, cookie snatching scripts, and event handlers across forms.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleFirewallRule('block_xss')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      firewallConfig.block_xss
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-300 text-neutral-700'
                    }`}
                  >
                    {firewallConfig.block_xss ? '● ACTIVE (BLOCKING)' : '○ DISABLED'}
                  </button>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-extrabold text-sm text-[#111111] block">Anti-Tampering Shield</span>
                    <p className="text-[#6B7280] text-[11px] mt-1">
                      Prevents unauthorized edits to website copy, pricing, collection requests, and administrative roles.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleFirewallRule('block_unauthorized_tampering')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      firewallConfig.block_unauthorized_tampering
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-300 text-neutral-700'
                    }`}
                  >
                    {firewallConfig.block_unauthorized_tampering ? '● ACTIVE (BLOCKING)' : '○ DISABLED'}
                  </button>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-extrabold text-sm text-[#111111] block">Data Theft Guard</span>
                    <p className="text-[#6B7280] text-[11px] mt-1">
                      Blocks unauthorized bulk requests, unauthenticated API scraping, and database dumping attempts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleFirewallRule('block_data_exfiltration')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      firewallConfig.block_data_exfiltration
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-300 text-neutral-700'
                    }`}
                  >
                    {firewallConfig.block_data_exfiltration ? '● ACTIVE (BLOCKING)' : '○ DISABLED'}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Real-Time Intrusion & Attack Attempt Feed */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
                <div>
                  <h4 className="font-bold text-sm text-[#111111] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-600" />
                    <span>Real-Time Attack &amp; Intrusion Monitor ({intrusionLogs.length})</span>
                  </h4>
                  <p className="text-xs text-[#6B7280]">
                    Live telemetry tracking any attempt to penetrate, harvest data, or compromise Celiglo systems.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={intrusionFilter}
                    onChange={(e) => setIntrusionFilter(e.target.value)}
                    className="text-xs bg-neutral-50 border border-neutral-300 px-3 py-1.5 rounded-lg font-semibold"
                  >
                    <option value="all">All Threat Types</option>
                    <option value="SQL_INJECTION">SQL Injection</option>
                    <option value="XSS_ATTACK">XSS Script Injection</option>
                    <option value="DATA_EXFILTRATION_PROBE">Data Exfiltration</option>
                    <option value="ADMIN_TAMPER_ATTEMPT">Admin Tamper Attempt</option>
                    <option value="PATH_TRAVERSAL">Path Traversal</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleClearIntrusions}
                    className="text-xs text-neutral-600 hover:text-neutral-900 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-semibold transition-colors"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>

              {/* Intrusion Logs Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-700 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200">
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Attacker IP</th>
                      <th className="py-2.5 px-3">Attack Signature</th>
                      <th className="py-2.5 px-3">Target Endpoint</th>
                      <th className="py-2.5 px-3">Intercepted Payload</th>
                      <th className="py-2.5 px-3">Severity</th>
                      <th className="py-2.5 px-3">WAF Action</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 font-mono">
                    {intrusionLogs
                      .filter((item) => intrusionFilter === 'all' || item.attack_type === intrusionFilter)
                      .map((log) => {
                        const isBanned = firewallConfig.banned_ips.includes(log.attacker_ip);
                        return (
                          <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                            <td className="py-2.5 px-3 text-[11px] text-neutral-500 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-neutral-800 whitespace-nowrap">
                              {log.attacker_ip}
                              {log.country_code && (
                                <span className="ml-1.5 text-[10px] px-1 py-0.2 bg-neutral-200 text-neutral-700 rounded font-normal font-sans">
                                  {log.country_code}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-sans font-bold">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide ${
                                  log.attack_type === 'SQL_INJECTION'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : log.attack_type === 'XSS_ATTACK'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : log.attack_type === 'DATA_EXFILTRATION_PROBE'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                    : log.attack_type === 'ADMIN_TAMPER_ATTEMPT'
                                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                }`}
                              >
                                {log.attack_type.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-neutral-600 font-mono text-[11px] max-w-[140px] truncate" title={log.target_endpoint}>
                              {log.target_endpoint}
                            </td>
                            <td className="py-2.5 px-3 text-rose-700 font-mono text-[11px] max-w-[240px] truncate" title={log.detected_payload}>
                              {log.detected_payload}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-sans font-bold">
                              <span
                                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                  log.severity === 'critical'
                                    ? 'bg-rose-700 text-white'
                                    : log.severity === 'high'
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-yellow-500 text-black'
                                }`}
                              >
                                {log.severity}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-sans font-bold">
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 text-[11px]">
                                ✓ {log.action_taken}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right whitespace-nowrap">
                              {isBanned ? (
                                <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded">
                                  Jailed
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleBanIp(log.attacker_ip)}
                                  className="text-[10px] bg-rose-700 hover:bg-rose-800 text-white px-2 py-1 rounded font-bold transition-colors"
                                >
                                  Ban IP
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Blacklist / Jailed IP Manager */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <h4 className="font-bold text-sm text-[#111111] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-600" />
                  <span>Jailed / Blacklisted IP Addresses ({firewallConfig.banned_ips.length})</span>
                </h4>
                <span className="text-xs text-neutral-500">Connections from these addresses are dropped instantly</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter IP address to jail (e.g. 194.26.29.112)"
                  value={newBannedIp}
                  onChange={(e) => setNewBannedIp(e.target.value)}
                  className="w-full sm:w-80 px-3 py-2 text-xs border border-neutral-300 rounded-lg font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleBanIp(newBannedIp)}
                  className="w-full sm:w-auto px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Add to Blacklist
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {firewallConfig.banned_ips.map((ip) => (
                  <div
                    key={ip}
                    className="bg-neutral-900 text-white text-xs font-mono px-3 py-1.5 rounded-lg flex items-center gap-2 border border-neutral-700"
                  >
                    <span>{ip}</span>
                    <button
                      type="button"
                      onClick={() => handleUnbanIp(ip)}
                      title="Unban IP"
                      className="text-neutral-400 hover:text-white hover:bg-neutral-800 rounded p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: STEP 3 ENVIRONMENT VARIABLES & IMMEDIATE DISPATCH CONTROLS */}
        {activeTab === 'env-vars' && (
          <div className="space-y-6">
            {/* Top Quick Actions Card: User Request Core */}
            <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-2xl border-2 border-[#16803C] shadow-xl space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFD42A]">
                  Immediate Notification Controls
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Activate / Deactivate SMS &amp; Email &amp; Sender Email Address
                </h3>
                <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                  Turn notifications on or off with a single click, or change the outgoing sender address anytime. All dispatches will instantly follow these active states.
                </p>
              </div>

              {/* 3 Prominent Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* 1. Email Dispatch Switch */}
                <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-emerald-400" />
                        Email Dispatch
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase font-mono ${
                          emailDispatchActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {emailDispatchActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      Automatically emails customer confirmation and status updates upon completion.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleToggleEmailDispatch(!emailDispatchActive)}
                      className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                        emailDispatchActive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                      }`}
                    >
                      {emailDispatchActive ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Email Dispatch is ACTIVATED (Click to Deactivate)</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-rose-400" />
                          <span>Email Dispatch is DEACTIVATED (Click to Activate)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. SMS Dispatch Switch */}
                <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-[#FFD42A]" />
                        SMS Dispatch
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase font-mono ${
                          smsDispatchActive ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {smsDispatchActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      Sends real-time SMS to customer phone numbers (+254) via Africa&apos;s Talking gateway.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSmsDispatch(!smsDispatchActive)}
                      className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                        smsDispatchActive
                          ? 'bg-[#16803C] hover:bg-[#0f5c2b] text-white shadow-md'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                      }`}
                    >
                      {smsDispatchActive ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>SMS Dispatch is ACTIVATED (Click to Deactivate)</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-rose-400" />
                          <span>SMS Dispatch is DEACTIVATED (Click to Activate)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Sender Email Address Switcher */}
                <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-sky-400" />
                      Sender Email Address
                    </span>
                    <p className="text-neutral-400 text-[11px]">
                      The &quot;From&quot; address displayed on all customer emails.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-1.5">
                      <input
                        type="email"
                        value={senderEmailChoice}
                        onChange={(e) => setSenderEmailChoice(e.target.value)}
                        placeholder="e.g. jdfusiontechnologies@gmail.com"
                        className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveSenderEmail(senderEmailChoice)}
                        className="px-3 py-1.5 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold text-xs rounded-lg whitespace-nowrap transition-colors"
                      >
                        Save
                      </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          setSenderEmailChoice('jdfusiontechnologies@gmail.com');
                          handleSaveSenderEmail('jdfusiontechnologies@gmail.com');
                        }}
                        className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded font-mono"
                      >
                        Default: jdfusiontechnologies@gmail.com
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSenderEmailChoice('joshuamwenda36@gmail.com');
                          handleSaveSenderEmail('joshuamwenda36@gmail.com');
                        }}
                        className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded font-mono"
                      >
                        Super Admin: joshuamwenda36@gmail.com
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 Environment Variables Manager */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
                    Cloud Infrastructure Configuration
                  </span>
                  <h3 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
                    <Key className="w-6 h-6 text-[#16803C]" />
                    <span>Step 3 Environment Variables Manager</span>
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Update or select Step 3 environment variables anytime. Seamlessly mirrors Vercel &amp; Aiven PostgreSQL settings.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAllEnv}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-[#FFD42A] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-4 h-4" />
                    Copy .env Format
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddEnvOpen(true)}
                    className="px-3.5 py-2 bg-[#16803C] hover:bg-[#0f5c2b] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variable
                  </button>
                </div>
              </div>

              {/* Environment Variables Table */}
              <div className="space-y-3">
                {envVariables.map((env) => {
                  const isRevealed = revealedEnvIds.has(env.id);
                  return (
                    <div
                      key={env.id}
                      className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-300 transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-bold font-mono text-[#111111] bg-white px-2 py-0.5 rounded border border-neutral-300">
                            {env.key}
                          </code>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              env.category === 'email'
                                ? 'bg-sky-100 text-sky-800'
                                : env.category === 'database'
                                ? 'bg-purple-100 text-purple-800'
                                : env.category === 'sms'
                                ? 'bg-amber-100 text-amber-800'
                                : env.category === 'security'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-neutral-200 text-neutral-800'
                            }`}
                          >
                            {env.category}
                          </span>
                          {env.is_secret && (
                            <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Secret
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280]">{env.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative w-full md:w-80">
                          <input
                            type={env.is_secret && !isRevealed ? 'password' : 'text'}
                            defaultValue={env.value}
                            onBlur={(e) => {
                              if (e.target.value !== env.value) {
                                handleUpdateEnvValue(env.id, e.target.value);
                              }
                            }}
                            className="w-full text-xs font-mono px-3 py-1.5 bg-white border border-neutral-300 rounded-lg pr-8 text-[#111111]"
                          />
                          {env.is_secret && (
                            <button
                              type="button"
                              onClick={() => handleToggleRevealEnv(env.id)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(env.value);
                            showToast(`Copied ${env.key} to clipboard!`);
                          }}
                          title="Copy Value"
                          className="p-2 text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-300 rounded-lg"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {env.category === 'custom' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteEnvVariable(env.id)}
                            title="Delete Variable"
                            className="p-2 text-rose-600 hover:text-rose-800 bg-white border border-neutral-300 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>



            {/* Add Environment Variable Modal */}
            {isAddEnvOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#E5E7EB]">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                    <h4 className="font-bold text-base text-[#111111]">Add Environment Variable</h4>
                    <button
                      type="button"
                      onClick={() => setIsAddEnvOpen(false)}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddEnvVariable} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Variable Name (KEY) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. POSTGRES_PORT or REDIS_URL"
                        value={newEnvKey}
                        onChange={(e) => setNewEnvKey(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Value *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter value"
                        value={newEnvValue}
                        onChange={(e) => setNewEnvValue(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Category</label>
                      <select
                        value={newEnvCategory}
                        onChange={(e) => setNewEnvCategory(e.target.value as any)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                      >
                        <option value="database">Database</option>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="security">Security</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Description</label>
                      <input
                        type="text"
                        placeholder="What is this variable used for?"
                        value={newEnvDesc}
                        onChange={(e) => setNewEnvDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="is_secret"
                        checked={newEnvIsSecret}
                        onChange={(e) => setNewEnvIsSecret(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="is_secret" className="text-neutral-700 font-semibold">
                        Mask this value as a secret (password / API key)
                      </label>
                    </div>

                    <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddEnvOpen(false)}
                        className="px-4 py-2 border border-neutral-300 text-neutral-700 font-semibold rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#16803C] hover:bg-[#0f5c2b] text-white font-bold rounded-lg"
                      >
                        Save Variable
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 13: DEPLOYMENT & DATABASE TOOLS */}
        {activeTab === 'export' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-xl font-bold text-[#111111]">
                  Deployment &amp; Database Actions
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Slogan: DON&apos;T MIX IT, SORT IT, TAKA NI PESA.
                </p>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch('/database/postgres-schema.sql');
                    const text = await res.text();
                    await navigator.clipboard.writeText(text);
                    showToast('PostgreSQL Schema copied to clipboard!');
                  } catch (e) {
                    showToast('File located at database/postgres-schema.sql');
                  }
                }}
                className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-300 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-bold text-xs text-[#111111] block group-hover:text-[#16803C]">
                    Copy PostgreSQL Schema (SQL)
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    database/postgres-schema.sql
                  </span>
                </div>
                <Copy className="w-4 h-4 text-neutral-500 group-hover:text-[#16803C]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCopyAllEnv();
                }}
                className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-300 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-bold text-xs text-[#111111] block group-hover:text-[#16803C]">
                    Copy .env Configuration
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    Formatted environment variables
                  </span>
                </div>
                <Copy className="w-4 h-4 text-neutral-500 group-hover:text-[#16803C]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const data = CeligloStorage.exportEntireDatabaseJson();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `celiglo_database_backup_${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showToast('Database exported as JSON!');
                }}
                className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-300 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-bold text-xs text-[#111111] block group-hover:text-[#16803C]">
                    Export Database (JSON)
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    Full system data backup
                  </span>
                </div>
                <Download className="w-4 h-4 text-neutral-500 group-hover:text-[#16803C]" />
              </button>

              <a
                href="https://aiven.io"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-300 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-bold text-xs text-[#111111] block group-hover:text-[#16803C]">
                    Open Aiven Console
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    aiven.io
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-[#16803C]" />
              </a>

              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-300 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-bold text-xs text-[#111111] block group-hover:text-[#16803C]">
                    Open Vercel Dashboard
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    vercel.com
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-[#16803C]" />
              </a>

              <a
                href="https://neon.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-300 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="font-bold text-xs text-[#111111] block group-hover:text-[#16803C]">
                    Open Neon Console
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    neon.tech
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-[#16803C]" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: RESET DEMO DATA & INITIALIZE CLEAN LIVE PRODUCTION */}
      {isResetLiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
            <div className="bg-[#111111] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-white">Reset Demo Data</h3>
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setIsResetLiveModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <p className="text-neutral-700 leading-relaxed">
                Wipe all {demoRecordsCount} sample booking requests, test messages, and simulated logs to start operating with live customer bookings?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => setIsResetLiveModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-bold hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={handleExecuteLiveReset}
                  className="px-4 py-2 bg-[#16803C] hover:bg-[#0f5c2b] text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isResetting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Wipe Demo Data &amp; Go Live</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
