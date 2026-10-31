import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { ServicesView } from './components/ServicesView';
import { RecyclingEducationView } from './components/RecyclingEducationView';
import { ContactView } from './components/ContactView';
import { PrivacyTermsView } from './components/PrivacyTermsView';
import { AdminPortal } from './components/AdminPortal';
import { CustomerPortal } from './components/CustomerPortal';
import { StaffWorkspace } from './components/StaffWorkspace';
import { AuthModal } from './components/AuthModal';
import { CollectionRequestModal } from './components/CollectionRequestModal';
import { TrackRequestModal } from './components/TrackRequestModal';
import { CeligloStorage, subscribeToStore } from './data/storage';
import { AppUser } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [settings, setSettings] = useState(CeligloStorage.getSettings());
  const [session, setSession] = useState<{ user: AppUser } | null>(CeligloStorage.getCurrentSession());

  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [trackerRefCode, setTrackerRefCode] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('signin');

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setSettings(CeligloStorage.getSettings());
      setSession(CeligloStorage.getCurrentSession());
    });
    return unsub;
  }, []);

  const handleOpenRequest = (serviceId?: string) => {
    setPreselectedServiceId(serviceId);
    setIsRequestModalOpen(true);
  };

  const handleOpenTracker = (refCode?: string) => {
    setTrackerRefCode(refCode || '');
    setIsTrackerModalOpen(true);
  };

  const handleOpenAuth = (mode: 'signin' | 'register' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'signin' || tab === 'login') {
      handleOpenAuth('signin');
      return;
    }
    if (tab === 'register' || tab === 'signup') {
      handleOpenAuth('register');
      return;
    }
    if (tab === 'portal' && !session) {
      handleOpenAuth('signin');
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (user: AppUser) => {
    setSession({ user });
    setCurrentTab('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if in a full dashboard view
  const isFullDashboardView =
    (currentTab === 'portal' && session?.user?.role !== 'customer') ||
    currentTab === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#252525]">
      {/* Show header on public pages and customer portal */}
      {!isFullDashboardView && (
        <Header
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onRequestCollection={() => handleOpenRequest()}
          onOpenTracker={() => handleOpenTracker()}
          onOpenAuthModal={(mode) => handleOpenAuth(mode || 'signin')}
        />
      )}

      {/* Main Content View Switcher */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onRequestCollection={handleOpenRequest}
            onOpenTracker={() => handleOpenTracker()}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            onRequestCollection={() => handleOpenRequest()}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'services' && (
          <ServicesView
            onRequestService={(serviceId) => handleOpenRequest(serviceId)}
          />
        )}

        {currentTab === 'recycling' && (
          <RecyclingEducationView
            onRequestCollection={() => handleOpenRequest()}
          />
        )}

        {currentTab === 'contact' && <ContactView />}

        {currentTab === 'privacy' && (
          <PrivacyTermsView
            initialTab="privacy"
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'terms' && (
          <PrivacyTermsView
            initialTab="terms"
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* Unified Portal Routing based on Active Session Role */}
        {currentTab === 'portal' && session && (
          <>
            {session.user.role === 'customer' && (
              <CustomerPortal
                onBackToHome={() => handleNavigate('home')}
                onRequestNewCollection={() => handleOpenRequest()}
                onOpenTracker={(ref) => handleOpenTracker(ref)}
              />
            )}

            {session.user.role === 'staff' && (
              <StaffWorkspace
                onBackToHome={() => handleNavigate('home')}
                onOpenTracker={(ref) => handleOpenTracker(ref)}
              />
            )}

            {(session.user.role === 'admin' || session.user.role === 'super_admin') && (
              <AdminPortal onBackToSite={() => handleNavigate('home')} />
            )}
          </>
        )}

        {/* Fallback to AdminPortal if direct tab navigation */}
        {currentTab === 'admin' && (
          <AdminPortal onBackToSite={() => handleNavigate('home')} />
        )}
      </main>

      {/* Footer on public pages and customer portal */}
      {!isFullDashboardView && (
        <Footer
          settings={settings}
          onNavigate={handleNavigate}
          onRequestCollection={() => handleOpenRequest()}
          onOpenTracker={() => handleOpenTracker()}
        />
      )}

      {/* Modals */}
      <CollectionRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        preselectedServiceId={preselectedServiceId}
        onTrackRequest={(ref) => {
          handleOpenTracker(ref);
        }}
      />

      <TrackRequestModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        initialReference={trackerRefCode}
        onRequestNew={() => handleOpenRequest()}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}
