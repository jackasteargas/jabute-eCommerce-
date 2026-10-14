import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  X,
  Menu,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  Package,
  Heart,
  Mail,
  Check,
  ArrowRight,
  ExternalLink,
  Tag,
  Copy,
  ChevronRight,
  Sparkles,
  HelpCircle,
  CreditCard,
  CheckCircle2,
  Lock,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AppMenuDrawer: React.FC = () => {
  const {
    isAppMenuOpen,
    setIsAppMenuOpen,
    categories,
    selectedCategory,
    setSelectedCategory,
    products,
    setActiveView,
    activeView,
    orders,
    wishlist,
    storeSettings,
    addToast,
    applyPromoCode
  } = useShop();

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<'returns' | 'warranty' | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAppMenuOpen(false);
        setActiveInfoModal(null);
      }
    };
    if (isAppMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isAppMenuOpen, setIsAppMenuOpen]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Invalid Email', 'Please enter a valid email address', 'error');
      return;
    }
    setIsSubscribed(true);
    addToast('Subscribed!', 'Welcome to JABUTE Insider. Coupon JABUTE10 applied!', 'success');
    applyPromoCode('JABUTE10');
    setEmail('');
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyPromoCode(code);
    setCopiedCoupon(true);
    addToast('Coupon Claimed!', `${code} copied & applied to your cart.`, 'success');
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setActiveView('home');
    setIsAppMenuOpen(false);
    const el = document.getElementById('jabute-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (view: 'home' | 'orders' | 'wishlist' | 'admin') => {
    if (view === 'home') {
      setSelectedCategory('all');
    }
    setActiveView(view);
    setIsAppMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isAppMenuOpen && (
        <div id="app-menu-drawer-portal" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsAppMenuOpen(false)}
            className="absolute inset-0 bg-stone-950/65 backdrop-blur-xs"
          />

          {/* Slide-over Drawer from Top-Left */}
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md sm:max-w-lg bg-stone-900 text-stone-200 shadow-2xl flex flex-col h-full border-r border-stone-800"
            >
              {/* Top Drawer Header: Logo & Dismiss Button */}
              <div className="p-4 sm:p-5 border-b border-stone-800/90 flex items-center justify-between bg-stone-950/70 shrink-0">
                <button
                  onClick={() => handleNavClick('home')}
                  className="text-left group cursor-pointer focus:outline-none"
                  title="Return to Store Home"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                      {storeSettings.storeName || 'JABUTE'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                      Menu
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium block mt-0.5">
                    Direct Independent Retailer
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavClick('home')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Catalog</span>
                  </button>
                  <button
                    onClick={() => setIsAppMenuOpen(false)}
                    className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content: All Selected Footer Sections */}
              <div className="flex-1 overflow-y-auto divide-y divide-stone-800/80 custom-scrollbar">
                
                {/* Quick Access: My Orders & Tracking (Prominently placed in Menu) */}
                <div className="p-3 sm:p-4 bg-stone-950/80 border-b border-stone-800">
                  <button
                    id="menu-orders-btn"
                    onClick={() => handleNavClick('orders')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                      activeView === 'orders'
                        ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-md'
                        : 'bg-stone-800/90 hover:bg-stone-800 text-white border-stone-700/80 hover:border-amber-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${activeView === 'orders' ? 'bg-stone-950 text-amber-400' : 'bg-stone-900 text-amber-400'}`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black tracking-tight">My Orders & Tracking</div>
                        <div className={`text-[10px] ${activeView === 'orders' ? 'text-stone-900' : 'text-stone-400'}`}>
                          {orders.length > 0 ? `${orders.length} order(s) placed • Live tracking` : 'Check delivery status & past purchases'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {orders.length > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          activeView === 'orders' ? 'bg-stone-950 text-amber-400' : 'bg-amber-400 text-stone-950'
                        }`}>
                          {orders.length}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${activeView === 'orders' ? 'text-stone-950' : 'text-stone-400'}`} />
                    </div>
                  </button>
                </div>

                {/* 1. Direct Member Access & Exclusive Discount Section (from Footer div 1) */}
                <div className="p-4 sm:p-5 bg-gradient-to-b from-stone-950/40 to-transparent space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Direct Member Access</span>
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      10% OFF
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                      Exclusive discount drops & priority access
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      Use coupon <strong className="text-amber-300 font-mono">JABUTE10</strong> for 10% off your direct order today.
                    </p>
                  </div>

                  {/* 1-Click Coupon Claim Pill */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleCopyCoupon('JABUTE10')}
                      className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-xs ${
                        copiedCoupon
                          ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                          : 'bg-stone-800/90 hover:bg-stone-800 border-amber-400/40 text-stone-200 hover:border-amber-400'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-mono font-bold">
                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                        <span>JABUTE10</span>
                      </span>
                      <span className="font-semibold text-[11px] flex items-center gap-1">
                        {copiedCoupon ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Claimed</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-stone-400" />
                            <span className="text-amber-300">Apply Code</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Newsletter Subscription Form */}
                  {isSubscribed ? (
                    <div className="flex items-center gap-2.5 bg-emerald-950/50 border border-emerald-500/40 p-3 rounded-xl text-emerald-300 text-xs">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Subscribed! Coupon <strong>JABUTE10</strong> applied.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email for member perks..."
                          className="w-full pl-9 pr-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-white text-stone-900 hover:bg-stone-100 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                      >
                        <span>Join</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>

                {/* 2. Direct Catalog Categories (from Footer div 2) */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-stone-400" />
                      <span>Direct Catalog</span>
                    </h4>
                    <span className="text-[11px] text-stone-500">
                      {products.length} Products
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCategoryClick('all')}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                        selectedCategory === 'all' && activeView === 'home'
                          ? 'bg-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
                      }`}
                    >
                      <span>All Products</span>
                      <span className="text-[10px] opacity-70">({products.length})</span>
                    </button>

                    {categories.map((cat) => {
                      const count = products.filter((p) => p.category === cat.slug).length;
                      const isSelected = selectedCategory === cat.slug && activeView === 'home';
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 font-bold'
                              : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
                          }`}
                        >
                          <span className="truncate mr-1">{cat.name}</span>
                          <span className="text-[10px] opacity-70">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Customer Hub (from Footer div 2) */}
                <div className="p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-stone-400" />
                    <span>Customer Hub</span>
                  </h4>

                  <div className="space-y-1.5">
                    {/* Track Orders */}
                    <button
                      onClick={() => handleNavClick('orders')}
                      className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        activeView === 'orders'
                          ? 'bg-stone-800 text-white border border-stone-700'
                          : 'hover:bg-stone-800/70 text-stone-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-amber-400" />
                        <span>Track My Orders</span>
                      </span>
                      {orders.length > 0 && (
                        <span className="bg-stone-700 text-stone-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {orders.length} active
                        </span>
                      )}
                    </button>

                    {/* Saved Wishlist */}
                    <button
                      onClick={() => handleNavClick('wishlist')}
                      className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        activeView === 'wishlist'
                          ? 'bg-stone-800 text-white border border-stone-700'
                          : 'hover:bg-stone-800/70 text-stone-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>Saved Wishlist</span>
                      </span>
                      {wishlist.length > 0 && (
                        <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                          {wishlist.length} saved
                        </span>
                      )}
                    </button>

                    {/* 30-Day Easy Returns Modal Trigger */}
                    <button
                      onClick={() => setActiveInfoModal(activeInfoModal === 'returns' ? null : 'returns')}
                      className="w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-stone-800/70 text-stone-300 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-sky-400" />
                        <span>30-Day Easy Returns</span>
                      </span>
                      <ChevronRight className={`w-4 h-4 text-stone-500 transition-transform ${activeInfoModal === 'returns' ? 'rotate-90' : ''}`} />
                    </button>

                    {activeInfoModal === 'returns' && (
                      <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3 text-xs text-stone-400 space-y-1.5 animate-fadeIn">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Hassle-Free Direct Returns</span>
                        </div>
                        <p className="leading-relaxed">
                          Items in new, unused condition with original packaging can be returned within 30 days of delivery. Free return shipping labels provided for all direct orders.
                        </p>
                      </div>
                    )}

                    {/* 1-Year Direct Warranty Modal Trigger */}
                    <button
                      onClick={() => setActiveInfoModal(activeInfoModal === 'warranty' ? null : 'warranty')}
                      className="w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-stone-800/70 text-stone-300 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>1-Year Direct Store Warranty</span>
                      </span>
                      <ChevronRight className={`w-4 h-4 text-stone-500 transition-transform ${activeInfoModal === 'warranty' ? 'rotate-90' : ''}`} />
                    </button>

                    {activeInfoModal === 'warranty' && (
                      <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3 text-xs text-stone-400 space-y-1.5 animate-fadeIn">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Guaranteed Authentic Coverage</span>
                        </div>
                        <p className="leading-relaxed">
                          Every product purchased through JABUTE includes our 12-month direct replacement guarantee against defects in materials and craftsmanship.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Store Owner Quick Access (from Footer div 2) */}
                <div className="p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-amber-500" />
                    <span>Store Management</span>
                  </h4>

                  <button
                    onClick={() => handleNavClick('admin')}
                    className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      activeView === 'admin'
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'bg-stone-800 hover:bg-stone-750 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Store className="w-4 h-4 text-amber-400" />
                      <div className="text-left">
                        <span className="block leading-none">Owner Admin Dashboard</span>
                        <span className="text-[10px] text-stone-400 font-normal">Manage products, stock & orders</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-400 pt-1">
                    <div className="flex items-center gap-1.5 bg-stone-950/60 p-2 rounded-lg border border-stone-800/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Single-Seller Store</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-stone-950/60 p-2 rounded-lg border border-stone-800/80">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Verified Inventory</span>
                    </div>
                  </div>

                </div>

                {/* 5. Brand Heritage & Trust Badges (from Footer div 2) */}
                <div className="p-4 sm:p-5 space-y-3">
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Independent online retail brand offering verified premium gear, electronics, wearables, and everyday essentials with guaranteed authentic quality.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Direct Store Warranty
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-400" /> Fast Express Shipping
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom Legal & Payment Badges (from Footer div 3) */}
              <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800/90 text-stone-500 text-xs shrink-0 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px]">Accepted Payment Methods:</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">VISA</span>
                    <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">MC</span>
                    <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">AMEX</span>
                    <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">APPLE</span>
                    <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">GOOGLE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-900">
                  <p>© {new Date().getFullYear()} JABUTE Retail.</p>
                  <span className="text-stone-400">100% Direct Storefront</span>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
