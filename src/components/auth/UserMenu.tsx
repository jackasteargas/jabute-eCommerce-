import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  LogOut,
  Package,
  Heart,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Cloud
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const UserMenu: React.FC = () => {
  const {
    user,
    authLoading,
    openAuthModal,
    logout,
    setActiveView,
    orders,
    wishlist,
    addToast,
    isAdmin
  } = useShop();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      setIsOpen(false);
      addToast('Signed Out', 'Signed out safely', 'info');
    } catch (e) {
      addToast('Error', 'Failed to sign out', 'error');
    }
  };

  if (!user) {
    return (
      <button
        id="header-login-btn"
        onClick={openAuthModal}
        className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 flex items-center justify-center transition-all cursor-pointer border border-stone-200 shadow-2xs shrink-0"
        title="Sign In / Profile Account"
        aria-label="Sign In or Open Profile"
      >
        <User className="w-4 h-4 text-stone-700" />
      </button>
    );
  }

  return (
    <div className="relative shrink-0" ref={menuRef}>
      {/* Profile DP Button (Only DP displayed, no name) */}
      <button
        id="user-profile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-0.5 rounded-full hover:ring-2 hover:ring-stone-900 active:scale-95 transition-all cursor-pointer shadow-2xs shrink-0 flex items-center justify-center"
        aria-label="User profile menu"
        title={user.displayName ? `${user.displayName} (Account)` : 'User Profile'}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User Profile DP'}
            referrerPolicy="no-referrer"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-amber-500 shadow-2xs"
          />
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs shadow-2xs border border-stone-800">
            <User className="w-4 h-4" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 overflow-hidden"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-amber-500"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-stone-900 truncate">
                    {user.displayName || 'Customer'}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <Cloud className="w-3 h-3 text-emerald-600" />
                  <span>Firestore Synced</span>
                </span>
                {isAdmin && user?.email?.toLowerCase().trim() === 'jackasteargas@gmail.com' && (
                  <span className="px-1.5 py-0.5 bg-amber-400 text-stone-950 font-black uppercase rounded text-[9px]">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-1.5 space-y-0.5 text-xs">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveView('orders');
                }}
                className="w-full px-3 py-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 flex items-center justify-between font-medium transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-stone-500" />
                  <span>My Orders & Tracking</span>
                </span>
                <span className="px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded-md text-[10px] font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveView('wishlist');
                }}
                className="w-full px-3 py-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 flex items-center justify-between font-medium transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Saved Wishlist</span>
                </span>
                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded-md text-[10px] font-bold">
                  {wishlist.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal();
                }}
                className="w-full px-3 py-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-2 font-medium transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Account & Cloud Storage</span>
              </button>

              {isAdmin && user?.email?.toLowerCase().trim() === 'jackasteargas@gmail.com' && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setActiveView('admin');
                  }}
                  className="w-full px-3 py-2 rounded-xl text-amber-900 hover:bg-amber-50 flex items-center gap-2 font-bold transition-colors cursor-pointer border border-amber-200/50"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-600" />
                  <span>Store Owner Admin</span>
                </button>
              )}
            </div>

            {/* Sign Out Action */}
            <div className="p-1.5 border-t border-stone-100">
              <button
                onClick={handleSignOut}
                className="w-full px-3 py-2 rounded-xl text-stone-600 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-stone-400 hover:text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
