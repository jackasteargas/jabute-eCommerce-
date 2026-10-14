import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Heart,
  Package,
  LogOut,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Send
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { getFriendlyAuthErrorMessage } from '../../lib/firebase';

type AuthTab = 'signin' | 'signup' | 'forgot';

export const AuthModal: React.FC = () => {
  const {
    user,
    authLoading,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    resetPasswordEmail,
    logout,
    isAuthModalOpen,
    closeAuthModal,
    setActiveView,
    orders,
    wishlist,
    cartCount,
    addToast
  } = useShop();

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Google Authentication
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const loggedUser = await loginWithGoogle();
      if (loggedUser) {
        addToast('Welcome to JABUTE!', `Signed in as ${loggedUser.displayName || loggedUser.email}`, 'success');
        resetForm();
        closeAuthModal();
      }
    } catch (error: any) {
      if (
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/user-cancelled'
      ) {
        return;
      }
      if (error?.code === 'auth/popup-blocked') {
        setErrorMessage('Popup was blocked by your browser. Please allow popups to sign in with Google.');
      } else {
        setErrorMessage(getFriendlyAuthErrorMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const loggedUser = await loginWithEmail(email, password);
      addToast('Welcome back!', `Signed in as ${loggedUser.displayName || loggedUser.email}`, 'success');
      resetForm();
      closeAuthModal();
    } catch (error: any) {
      setErrorMessage(getFriendlyAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Email & Password Sign Up (Create Account)
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const createdUser = await signupWithEmail(email, password, displayName);
      addToast('Account Created!', `Welcome to JABUTE, ${createdUser.displayName || 'Customer'}!`, 'success');
      resetForm();
      closeAuthModal();
    } catch (error: any) {
      setErrorMessage(getFriendlyAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password / Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to receive a reset link.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await resetPasswordEmail(email);
      setSuccessMessage(`A password reset link has been dispatched to ${email.trim()}. Please check your inbox and spam folder.`);
      addToast('Password Reset Sent', 'Check your email for recovery instructions', 'info');
    } catch (error: any) {
      setErrorMessage(getFriendlyAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      addToast('Signed Out', 'You have been safely signed out', 'info');
      closeAuthModal();
    } catch (error: any) {
      addToast('Sign Out Error', 'Failed to sign out', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const userOrdersCount = user
    ? orders.filter(
        (o) =>
          o.userId === user.uid ||
          o.customer.email.toLowerCase() === user.email?.toLowerCase()
      ).length
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-auto"
        >
          {/* Top Banner */}
          <div className="bg-stone-900 text-white p-5 sm:p-6 relative">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-500 to-amber-300 text-stone-950 flex items-center justify-center font-black shadow-lg shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>Firebase Auth & Cloud Sync</span>
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                  {user ? 'My JABUTE Account' : activeTab === 'signup' ? 'Create an Account' : activeTab === 'forgot' ? 'Reset Password' : 'Sign in to JABUTE'}
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {user
                ? 'Your profile, cart, wishlist, and orders are securely synchronized to Firestore.'
                : activeTab === 'signup'
                ? 'Register with your email and password to sync your shopping bag across all devices.'
                : activeTab === 'forgot'
                ? 'Enter your registered email and we will send you a password recovery link.'
                : 'Sign in with your Google account or valid email and password.'}
            </p>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-5">
            {user ? (
              /* Signed In Profile View */
              <div className="space-y-5">
                <div className="flex items-center gap-3.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-full border-2 border-amber-500 object-cover shadow-xs"
                    />
                  ) : (
                    <div className="w-13 h-13 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-lg">
                      <User className="w-6 h-6" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-stone-900 truncate">
                        {user.displayName || 'Valued Customer'}
                      </h4>
                      {user.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-amber-400 text-stone-950 text-[10px] font-black uppercase rounded-md tracking-wider">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Authenticated & Firestore Connected</span>
                    </span>
                  </div>
                </div>

                {/* Account Stats Quick Grid */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div
                    onClick={() => {
                      closeAuthModal();
                      setActiveView('orders');
                    }}
                    className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200/60 cursor-pointer transition-all hover:scale-102"
                  >
                    <Package className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <span className="block text-sm font-black text-stone-900">{userOrdersCount}</span>
                    <span className="text-[10px] font-semibold text-stone-500">Orders</span>
                  </div>

                  <div
                    onClick={() => {
                      closeAuthModal();
                      setActiveView('wishlist');
                    }}
                    className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200/60 cursor-pointer transition-all hover:scale-102"
                  >
                    <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1" />
                    <span className="block text-sm font-black text-stone-900">{wishlist.length}</span>
                    <span className="text-[10px] font-semibold text-stone-500">Wishlist</span>
                  </div>

                  <div
                    onClick={() => {
                      closeAuthModal();
                      setActiveView('shop');
                    }}
                    className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200/60 cursor-pointer transition-all hover:scale-102"
                  >
                    <ShoppingBag className="w-4 h-4 text-stone-700 mx-auto mb-1" />
                    <span className="block text-sm font-black text-stone-900">{cartCount}</span>
                    <span className="text-[10px] font-semibold text-stone-500">Cart Items</span>
                  </div>
                </div>

                {/* Account Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      closeAuthModal();
                      setActiveView('orders');
                    }}
                    className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-400" />
                      <span>View My Orders & Real-Time Tracking</span>
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-stone-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Signed Out - Authentication Modes */
              <div className="space-y-4">
                {/* Navigation Tabs */}
                <div className="flex bg-stone-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleTabChange('signin')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                      activeTab === 'signin'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('signup')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                      activeTab === 'signup'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <span className="leading-snug">{successMessage}</span>
                  </div>
                )}

                {/* 1-Click Google Sign In (for Sign In & Sign Up tabs) */}
                {activeTab !== 'forgot' && (
                  <>
                    <button
                      id="google-signin-btn"
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading || authLoading}
                      className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 active:scale-[0.99] border border-stone-300 hover:border-stone-400 text-stone-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-3 my-1">
                      <div className="h-px bg-stone-200 flex-1" />
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">or with email</span>
                      <div className="h-px bg-stone-200 flex-1" />
                    </div>
                  </>
                )}

                {/* TAB 1: SIGN IN WITH EMAIL & PASSWORD */}
                {activeTab === 'signin' && (
                  <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="signin-email-input"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => handleTabChange('forgot')}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="signin-password-input"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      id="submit-signin-btn"
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span>Signing In...</span>
                      ) : (
                        <>
                          <span>Sign In to My Account</span>
                          <ArrowRight className="w-4 h-4 text-amber-400" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* TAB 2: CREATE ACCOUNT WITH EMAIL & PASSWORD */}
                {activeTab === 'signup' && (
                  <form onSubmit={handleEmailSignUp} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Full Name (Optional)
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="signup-name-input"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Jane Doe"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="signup-email-input"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            id="signup-password-input"
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 6 chars"
                            className="w-full pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Confirm <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            id="signup-confirm-password-input"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat"
                            className="w-full pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      id="submit-signup-btn"
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span>Creating Account...</span>
                      ) : (
                        <>
                          <span>Create Account & Sync Bag</span>
                          <Check className="w-4 h-4 text-amber-400" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* TAB 3: PASSWORD RECOVERY */}
                {activeTab === 'forgot' && (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="forgot-email-input"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleTabChange('signin')}
                        className="w-1/3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                      >
                        {isLoading ? (
                          <span>Sending link...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-amber-400" />
                            <span>Send Reset Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Security Footer Note */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-stone-400" />
                    <span>Firebase 256-bit Security</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                    Cross-Device Synced
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
