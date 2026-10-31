import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ShieldCheck, UserCheck, LogIn, Lock } from 'lucide-react';
import { CeligloStorage } from '../data/storage';
import { AppUser } from '../types';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onRequestCollection: () => void;
  onOpenTracker: () => void;
  onOpenAuthModal?: (mode?: 'signin' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onRequestCollection,
  onOpenTracker,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<{ user: AppUser } | null>(CeligloStorage.getCurrentSession());
  const settings = CeligloStorage.getSettings();

  useEffect(() => {
    const unsub = () => {
      setSession(CeligloStorage.getCurrentSession());
    };
    window.addEventListener('celiglo_store_change', unsub);
    return () => window.removeEventListener('celiglo_store_change', unsub);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'recycling', label: 'Recycling Guide' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPortalLabel = () => {
    if (!session) return 'Sign In';
    switch (session.user.role) {
      case 'super_admin':
        return 'Executive Console';
      case 'admin':
        return 'Admin Portal';
      case 'staff':
        return 'Staff Tasks';
      case 'customer':
        return 'My Account';
      default:
        return 'Portal';
    }
  };

  const handlePortalClick = (mode: 'signin' | 'register' = 'signin') => {
    if (!session) {
      if (onOpenAuthModal) onOpenAuthModal(mode);
      else handleNavClick('portal');
    } else {
      handleNavClick('portal');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark element */}
        <button
          onClick={() => handleNavClick('home')}
          className="cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C] rounded-md shrink-0"
          aria-label="Celiglo Agency Limited Home"
        >
          <Logo size="md" />
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#252525]"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 relative ${
                  isActive
                    ? 'text-[#16803C] font-semibold'
                    : 'text-[#252525] hover:text-[#16803C]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16803C] rounded-full" />
                )}
              </button>
            );
          })}

          <button
            onClick={() => {
              onOpenTracker();
              setMobileMenuOpen(false);
            }}
            className="text-xs font-semibold text-[#16803C] hover:text-[#0f5c2b] transition-colors whitespace-nowrap shrink-0 border border-[#16803C]/30 hover:border-[#16803C] px-2.5 py-1 rounded"
          >
            Track Request
          </button>

          {/* Role-based portal / sign in link */}
          {session ? (
            <button
              onClick={() => handlePortalClick('signin')}
              className={`text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                currentTab === 'portal'
                  ? 'bg-[#111111] text-[#FFD42A] border-[#111111]'
                  : 'bg-[#EAF5ED] text-[#16803C] border-[#16803C]/30 hover:border-[#16803C]'
              }`}
              title="Access Account Portal"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{getPortalLabel()}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePortalClick('signin')}
                className="text-xs font-bold text-[#252525] hover:text-[#16803C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#16803C]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => handlePortalClick('register')}
                className="text-xs font-bold text-[#16803C] hover:text-[#0f5c2b] bg-[#EAF5ED] hover:bg-[#d6eedb] transition-colors whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg border border-[#16803C]/30"
              >
                <span>Register</span>
              </button>
            </div>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRequestCollection}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-[#111111] bg-[#FFD42A] hover:bg-[#eec41e] active:scale-[0.98] transition-all rounded-lg shadow-sm whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
          >
            Request Collection
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#252525] hover:text-[#16803C] focus:outline-none rounded-lg"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E7EB] px-5 pt-3 pb-6 space-y-3 shadow-lg">

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left py-2 text-base font-medium ${
                currentTab === link.id ? 'text-[#16803C] font-semibold' : 'text-[#252525]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
            <button
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 text-sm font-semibold text-[#16803C]"
            >
              🔍 Track Request Reference Code
            </button>

            {session ? (
              <button
                onClick={() => {
                  handlePortalClick('signin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm font-bold text-[#111111] flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-[#16803C]" />
                {getPortalLabel()}
              </button>
            ) : (
              <div className="space-y-1 pt-1">
                <button
                  onClick={() => {
                    handlePortalClick('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-sm font-bold text-[#111111] flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-[#16803C]" />
                  Sign In to Account
                </button>
                <button
                  onClick={() => {
                    handlePortalClick('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-sm font-bold text-[#16803C] flex items-center gap-2"
                >
                  Don't have an account? Sign Up
                </button>
              </div>
            )}

            <button
              onClick={() => {
                onRequestCollection();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-3 px-4 text-center font-bold text-[#111111] bg-[#FFD42A] hover:bg-[#eec41e] rounded-lg shadow-sm"
            >
              Request Collection Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
