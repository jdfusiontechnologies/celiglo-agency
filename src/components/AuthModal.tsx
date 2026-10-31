import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  User,
  Lock,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Building,
  Home,
  MapPin,
  HelpCircle,
  Send
} from 'lucide-react';
import { CeligloStorage } from '../data/storage';
import { AppUser, CustomerType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser) => void;
  initialMode?: 'signin' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [lockoutSecs, setLockoutSecs] = useState<number>(0);


  // Register State ("Don't have an account")
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+254 ');
  const [regEmail, setRegEmail] = useState('');
  const [regType, setRegType] = useState<CustomerType>('residential');
  const [regLocation, setRegLocation] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAgreeTerms, setRegAgreeTerms] = useState(true);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Forgot Password State
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);

  // Check rate limit timer when identifier changes
  useEffect(() => {
    if (!loginIdentifier.trim()) return;
    const rateCheck = CeligloStorage.checkRateLimit(loginIdentifier.trim());
    if (!rateCheck.allowed) {
      setLockoutSecs(rateCheck.lockout_remaining_seconds);
      setLoginError(`Account temporarily locked for security. Retry in ${rateCheck.lockout_remaining_seconds}s.`);
    } else {
      setLockoutSecs(0);
    }
  }, [loginIdentifier]);

  if (!isOpen) return null;

  // Handle Sign In submission
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setLoginError('Please enter your email or phone number and password.');
      return;
    }

    const res = CeligloStorage.loginWithCredentials(loginIdentifier.trim(), loginPassword);

    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials. Please verify your details.');
      const rateCheck = CeligloStorage.checkRateLimit(loginIdentifier.trim());
      if (!rateCheck.allowed) {
        setLockoutSecs(rateCheck.lockout_remaining_seconds);
      }
      return;
    }

    if (res.user) {
      onSuccess(res.user);
      onClose();
    }
  };

  // Handle Registration ("Don't Have An Account")
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Please complete all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!regAgreeTerms) {
      setRegError('You must agree to the Terms of Service to create an account.');
      return;
    }

    // Check if user already exists
    const existing = CeligloStorage.getUsers().find(
      (u) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (existing) {
      setRegError('An account with this email address already exists. Please sign in instead.');
      return;
    }

    const newUser = CeligloStorage.registerCustomer({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      address: regLocation.trim() || undefined,
    });

    if (newUser) {
      setRegSuccess(true);
      setTimeout(() => {
        onSuccess(newUser);
        onClose();
      }, 1200);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setMode('signin');
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden my-8">
        {/* Top Header */}
        <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#16803C] flex items-center justify-center text-white font-bold text-xs shrink-0">
              CA
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white tracking-wide">
                Celiglo Agency Limited
              </h3>
              <p className="text-[11px] text-neutral-400 font-medium">
                Customer &amp; Staff Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-Level Tab Bar: Sign In vs Don't Have An Account */}
        <div className="flex border-b border-[#E5E7EB] bg-[#F3F4F3] text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setLoginError('');
            }}
            className={`flex-1 py-3.5 text-center transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#16803C] border-b-2 border-[#16803C] shadow-2xs font-extrabold'
                : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setRegError('');
            }}
            className={`flex-1 py-3.5 text-center transition-all ${
              mode === 'register'
                ? 'bg-white text-[#16803C] border-b-2 border-[#16803C] shadow-2xs font-extrabold'
                : 'text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Don't have an account? Sign Up
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {mode === 'signin' ? (
            /* ========================================================== */
            /* SIGN IN PANEL                                              */
            /* ========================================================== */
            <div className="space-y-5">
              <div>
                <h4 className="text-xl font-extrabold text-[#111111]">
                  Welcome Back
                </h4>
                <p className="text-xs text-[#6B7280] mt-1">
                  Sign in with your registered email or phone number to manage waste collections and service requests.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    Email Address or Phone Number
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="Email address or phone number"
                      className="w-full pl-9 pr-3 py-2.5 border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#16803C]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#111111]">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-[#16803C] hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-10 py-2.5 border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#16803C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#6B7280] hover:text-[#111111]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#16803C] focus:ring-[#16803C]"
                    />
                    <span className="text-[#6B7280]">Remember me on this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={lockoutSecs > 0}
                  className="w-full py-3 px-4 bg-[#16803C] hover:bg-[#0f5c2b] disabled:bg-neutral-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>{lockoutSecs > 0 ? `Temporarily Locked (${lockoutSecs}s)` : 'Sign In to Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Seamless Link to Don't have an account */}
              <div className="p-4 bg-[#F3F4F3] rounded-xl text-center space-y-1 text-xs">
                <span className="text-[#6B7280]">Don't have an account with Celiglo yet?</span>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setRegError('');
                    }}
                    className="font-bold text-[#16803C] hover:underline"
                  >
                    Click here to create an account &rarr;
                  </button>
                </div>
              </div>
            </div>
          ) : mode === 'register' ? (
            /* ========================================================== */
            /* "DON'T HAVE AN ACCOUNT? SIGN UP" PANEL                     */
            /* ========================================================== */
            <div className="space-y-5">
              <div>
                <h4 className="text-xl font-extrabold text-[#111111]">
                  Create an Account
                </h4>
                <p className="text-xs text-[#6B7280] mt-1">
                  Sign up for Celiglo Agency collection, scheduled pickups, and waste sorting services in Kenya.
                </p>
              </div>

              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-[#EAF5ED] border border-[#16803C]/30 text-[#16803C] text-xs rounded-xl flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Account registered successfully! Logging you in...</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    Full Name / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Mary Wanjiku or ABC Properties"
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#16803C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Phone Number (Kenya) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+254 712 345 678"
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#16803C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#16803C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Customer Category
                    </label>
                    <select
                      value={regType}
                      onChange={(e) => setRegType(e.target.value as CustomerType)}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-xs bg-white focus:outline-none focus:border-[#16803C]"
                    >
                      <option value="residential">Residential Household</option>
                      <option value="commercial">Commercial Business / Office</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Estate / County Location
                    </label>
                    <input
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Kilimani, Nairobi"
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#16803C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Create Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#16803C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#16803C]"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={regAgreeTerms}
                      onChange={(e) => setRegAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#16803C] focus:ring-[#16803C]"
                    />
                    <span className="text-[#6B7280]">
                      I agree to the Celiglo Agency Terms of Service and Customer Privacy Policy.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#FFD42A] hover:bg-[#eec41e] text-[#111111] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <span>Create Account &amp; Access Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Seamless Link to Sign In */}
              <div className="p-4 bg-[#F3F4F3] rounded-xl text-center space-y-1 text-xs">
                <span className="text-[#6B7280]">Already have an account?</span>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setLoginError('');
                    }}
                    className="font-bold text-[#16803C] hover:underline"
                  >
                    Sign in to your existing account &rarr;
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================== */
            /* FORGOT PASSWORD PANEL                                      */
            /* ========================================================== */
            <div className="space-y-5">
              <div>
                <h4 className="text-xl font-extrabold text-[#111111]">
                  Reset Your Password
                </h4>
                <p className="text-xs text-[#6B7280] mt-1">
                  Enter your registered email address or phone number and we will send you password reset guidance.
                </p>
              </div>

              {forgotSent ? (
                <div className="p-4 bg-[#EAF5ED] text-[#16803C] rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Password reset instructions have been dispatched. Returning to sign-in screen...</span>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Email or Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotInput}
                      onChange={(e) => setForgotInput(e.target.value)}
                      placeholder="Email address or phone number"
                      className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#16803C]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="w-1/2 py-2.5 px-4 bg-[#F3F4F3] hover:bg-[#E5E7EB] text-[#252525] text-xs font-bold rounded-xl transition-colors"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 px-4 bg-[#16803C] hover:bg-[#0f5c2b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Real corporate footer helpline */}
          <div className="pt-3 border-t border-[#E5E7EB] text-[11px] text-center text-[#6B7280]">
            <span>Need assistance? Contact Celiglo Operations at </span>
            <a href="tel:+254700000000" className="text-[#16803C] font-semibold hover:underline">
              +254 700 000 000
            </a>
            <span> or email </span>
            <a href="mailto:jdfusiontechnologies@gmail.com" className="text-[#16803C] font-semibold hover:underline">
              jdfusiontechnologies@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
