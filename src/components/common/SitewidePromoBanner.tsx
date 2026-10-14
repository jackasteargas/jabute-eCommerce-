import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Sparkles,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  X,
  ArrowRight,
  Gift,
  Truck,
  Percent,
  Zap,
  Flame,
  BadgePercent,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromoSlide {
  id: string;
  badge: string;
  badgeIcon: 'flame' | 'sparkles' | 'truck' | 'zap' | 'gift' | 'percent';
  title: string;
  highlightText?: string;
  code?: string;
  discountPercentage?: number;
  minSpend?: number;
  categoryFilter?: string;
  ctaText?: string;
  isCustom?: boolean;
}

export const SitewidePromoBanner: React.FC = () => {
  const {
    promos,
    storeSettings,
    applyPromoCode,
    appliedPromo,
    addToast,
    setIsCartOpen,
    setSelectedCategory,
    setActiveView
  } = useShop();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('jabute_promo_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const offersDropdownRef = useRef<HTMLDivElement>(null);

  // Time remaining for flash sale countdown
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 4,
    minutes: 42,
    seconds: 18
  });

  // Ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 }; // Reset cycle
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close offers dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (offersDropdownRef.current && !offersDropdownRef.current.contains(e.target as Node)) {
        setIsOffersOpen(false);
      }
    };
    if (isOffersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOffersOpen]);

  // Construct dynamic promotional slides from storeSettings and active coupons
  const slides: PromoSlide[] = useMemo(() => {
    const list: PromoSlide[] = [];

    // 1. Admin Custom Store Announcement if active
    if (storeSettings.isAnnouncementActive && storeSettings.bannerAnnouncement?.trim()) {
      list.push({
        id: 'admin-announcement',
        badge: 'Store Notice',
        badgeIcon: 'sparkles',
        title: storeSettings.bannerAnnouncement,
        ctaText: 'Explore Collection',
        isCustom: true
      });
    }

    // 2. Active Promo Codes from ShopContext (FLASH25, VIP20, FREESHIP, SAVE20, etc.)
    const activePromos = promos.filter((p) => p.active !== false);

    const flashPromo = activePromos.find((p) => p.code.toUpperCase() === 'FLASH25');
    if (flashPromo) {
      list.push({
        id: 'flash-sale',
        badge: 'Seasonal Flash Sale',
        badgeIcon: 'flame',
        title: 'Mid-Season Archival Drop:',
        highlightText: `${flashPromo.discountPercentage}% OFF`,
        code: flashPromo.code,
        discountPercentage: flashPromo.discountPercentage,
        minSpend: flashPromo.minSpend,
        ctaText: 'Shop Flash Drop'
      });
    }

    const freeShipPromo = activePromos.find((p) => p.code.toUpperCase() === 'FREESHIP');
    if (freeShipPromo) {
      list.push({
        id: 'free-shipping',
        badge: 'Sitewide Delivery',
        badgeIcon: 'truck',
        title: 'Free Worldwide Express Freight on all orders',
        code: freeShipPromo.code,
        ctaText: 'Claim Free Shipping'
      });
    }

    const vipPromo = activePromos.find((p) => p.code.toUpperCase() === 'VIP20');
    if (vipPromo) {
      list.push({
        id: 'vip-sale',
        badge: 'JABUTE Privé',
        badgeIcon: 'zap',
        title: 'Architectural Living & Acoustics:',
        highlightText: `${vipPromo.discountPercentage}% OFF`,
        code: vipPromo.code,
        discountPercentage: vipPromo.discountPercentage,
        categoryFilter: 'minimalist-living',
        ctaText: 'Shop Living'
      });
    }

    // Additional active coupons created by admin in Coupons tab
    const otherPromos = activePromos.filter(
      (p) => !['FLASH25', 'FREESHIP', 'VIP20'].includes(p.code.toUpperCase())
    );

    otherPromos.forEach((promo) => {
      list.push({
        id: `promo-${promo.code}`,
        badge: 'Seasonal Special',
        badgeIcon: 'gift',
        title: promo.description || `Special Promotion: ${promo.discountPercentage}% OFF`,
        code: promo.code,
        discountPercentage: promo.discountPercentage,
        minSpend: promo.minSpend,
        ctaText: 'Apply Code'
      });
    });

    // Fallback if no promo codes are registered
    if (list.length === 0) {
      list.push({
        id: 'fallback-banner',
        badge: 'Special Offer',
        badgeIcon: 'sparkles',
        title: 'Welcome to JABUTE Direct Store: Enjoy complimentary shipping worldwide',
        code: 'FREESHIP',
        ctaText: 'Claim Code'
      });
    }

    return list;
  }, [storeSettings, promos]);

  // Carousel autoplay timer
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleApplyCode = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);

    const result = applyPromoCode(code);
    if (result.success) {
      addToast(`Code ${code} Applied!`, result.message, 'success');
    } else {
      addToast(`Code ${code} Copied`, result.message, 'info');
    }

    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleActionClick = (slide: PromoSlide) => {
    if (slide.code) {
      handleApplyCode(slide.code);
    }

    if (slide.categoryFilter) {
      setSelectedCategory(slide.categoryFilter);
      setActiveView('home');
    }

    const catalogEl = document.getElementById('jabute-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('jabute_promo_dismissed', 'true');
    } catch {
      // ignore storage error
    }
  };

  const handleReopen = () => {
    setIsDismissed(false);
    try {
      sessionStorage.removeItem('jabute_promo_dismissed');
    } catch {
      // ignore
    }
  };

  // Render Icon helper
  const renderBadgeIcon = (icon: PromoSlide['badgeIcon']) => {
    switch (icon) {
      case 'flame':
        return <Flame className="w-3 h-3 text-amber-400 animate-pulse" />;
      case 'truck':
        return <Truck className="w-3 h-3 text-emerald-400" />;
      case 'zap':
        return <Zap className="w-3 h-3 text-amber-300" />;
      case 'gift':
        return <Gift className="w-3 h-3 text-rose-300" />;
      case 'percent':
        return <Percent className="w-3 h-3 text-amber-400" />;
      default:
        return <Sparkles className="w-3 h-3 text-amber-400" />;
    }
  };

  // Collapsed Minimal Reopen Bar
  if (isDismissed) {
    return (
      <div className="bg-stone-900 border-b border-stone-800 py-1 px-4 text-xs transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-stone-400">
          <button
            onClick={handleReopen}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer group"
          >
            <Sparkles className="w-3 h-3 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Show Seasonal Offers & Discount Codes</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono border border-amber-400/30">
              UP TO 25% OFF
            </span>
          </button>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            {appliedPromo && (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <Check className="w-3 h-3" /> Code {appliedPromo.code} Active in Cart
              </span>
            )}
            <button
              onClick={handleReopen}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer text-[10px] uppercase font-bold tracking-wider"
            >
              Expand Banner
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex] || slides[0];
  const isCurrentApplied = Boolean(
    appliedPromo && currentSlide.code && appliedPromo.code.toUpperCase() === currentSlide.code.toUpperCase()
  );

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative z-30 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-stone-100 border-b border-stone-800 shadow-sm"
      role="region"
      aria-label="Sitewide Promotion"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Arrow (Carousel) */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous promotion"
              className="hidden sm:flex p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Central Animated Content Area */}
          <div className="flex-1 min-w-0 flex items-center justify-center sm:justify-start lg:justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap justify-center text-center sm:text-left text-xs"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-bold text-[11px] shrink-0 tracking-wide">
                  {renderBadgeIcon(currentSlide.badgeIcon)}
                  <span>{currentSlide.badge}</span>
                </div>

                {/* Announcement Copy */}
                <div className="flex items-center gap-1.5 font-medium tracking-tight text-stone-200 text-xs sm:text-[13px] leading-snug truncate max-w-xs sm:max-w-md lg:max-w-xl">
                  <span>{currentSlide.title}</span>
                  {currentSlide.highlightText && (
                    <span className="font-extrabold text-amber-400 underline decoration-amber-400/50 underline-offset-2">
                      {currentSlide.highlightText}
                    </span>
                  )}
                </div>

                {/* Live Countdown Timer for Flash Promotions */}
                {currentSlide.id === 'flash-sale' && (
                  <div className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-300 bg-stone-900/90 border border-stone-800 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>
                      {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                )}

                {/* 1-Click Code Claim Pill */}
                {currentSlide.code && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleApplyCode(currentSlide.code!, e)}
                      title={`Click to copy & apply ${currentSlide.code} automatically`}
                      className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                        isCurrentApplied
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-xs'
                          : copiedCode === currentSlide.code
                          ? 'bg-amber-400 text-stone-950 border-amber-300 font-black'
                          : 'bg-stone-800/90 hover:bg-stone-800 text-stone-200 hover:text-white border-stone-700 hover:border-amber-400/50'
                      }`}
                    >
                      <Tag className="w-3 h-3 text-amber-400" />
                      <span>{currentSlide.code}</span>

                      {isCurrentApplied ? (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-300 font-sans font-bold ml-0.5">
                          <Check className="w-3 h-3" /> Applied
                        </span>
                      ) : copiedCode === currentSlide.code ? (
                        <span className="flex items-center gap-0.5 text-[10px] text-stone-950 font-sans font-black ml-0.5">
                          <Check className="w-3 h-3" /> Copied!
                        </span>
                      ) : (
                        <span className="hidden lg:inline text-[10px] text-stone-400 group-hover:text-amber-300 font-sans font-normal ml-0.5">
                          • Click to Apply
                        </span>
                      )}
                    </button>

                    {/* Quick Action Button */}
                    <button
                      type="button"
                      onClick={() => handleActionClick(currentSlide)}
                      className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/40 transition-colors cursor-pointer shrink-0 ml-1"
                    >
                      <span>{currentSlide.ctaText || 'Shop Now'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow (Carousel) */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next promotion"
              className="hidden sm:flex p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors shrink-0 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Right Action Tools: All Offers Drawer + Slide Indicator + Dismiss */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 text-xs">
            
            {/* View All Offers Popover Trigger */}
            <div className="relative" ref={offersDropdownRef}>
              <button
                type="button"
                onClick={() => setIsOffersOpen(!isOffersOpen)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-stone-300 hover:text-white bg-stone-800/70 hover:bg-stone-800 border border-stone-700/80 transition-colors cursor-pointer"
              >
                <BadgePercent className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">All Offers</span>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1 rounded">
                  {promos.length}
                </span>
                <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${isOffersOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* All Offers Dropdown Popover */}
              <AnimatePresence>
                {isOffersOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl p-4 z-50 text-stone-200"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                      <div className="flex items-center gap-2">
                        <BadgePercent className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-100">
                          Active Store Coupons ({promos.length})
                        </h4>
                      </div>
                      <button
                        onClick={() => setIsOffersOpen(false)}
                        className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-400 mt-2 mb-3 leading-relaxed">
                      Click any promo code to instantly apply it to your cart or copy it for checkout.
                    </p>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {promos.map((promo) => {
                        const isThisApplied = appliedPromo?.code.toUpperCase() === promo.code.toUpperCase();
                        return (
                          <div
                            key={promo.code}
                            className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                              isThisApplied
                                ? 'bg-emerald-950/40 border-emerald-500/40'
                                : 'bg-stone-800/60 hover:bg-stone-800 border-stone-700/70'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-amber-300 text-xs px-2 py-0.5 rounded bg-stone-900 border border-stone-700">
                                  {promo.code}
                                </span>
                                {promo.discountPercentage > 0 ? (
                                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                                    {promo.discountPercentage}% OFF
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                                    FREE SHIPPING
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-300 mt-1 font-medium leading-snug">
                                {promo.description}
                              </p>
                              {promo.minSpend && (
                                <p className="text-[10px] text-stone-400 mt-0.5">
                                  Min spend: ${promo.minSpend}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleApplyCode(promo.code)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer ${
                                isThisApplied
                                  ? 'bg-emerald-500 text-stone-950'
                                  : copiedCode === promo.code
                                  ? 'bg-amber-400 text-stone-950'
                                  : 'bg-stone-700 hover:bg-stone-600 text-white'
                              }`}
                            >
                              {isThisApplied ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Applied</span>
                                </>
                              ) : copiedCode === promo.code ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Apply</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {appliedPromo && (
                      <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active code: <strong>{appliedPromo.code}</strong></span>
                        </span>
                        <button
                          onClick={() => {
                            setIsOffersOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer text-[11px]"
                        >
                          View In Cart
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slide Dots / Count */}
            {slides.length > 1 && (
              <div className="hidden lg:flex items-center gap-1 px-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-stone-700 hover:bg-stone-600'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Dismiss / Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              title="Hide promotional banner"
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
