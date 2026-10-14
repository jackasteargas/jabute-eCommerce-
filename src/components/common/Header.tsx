import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { UserMenu } from '../auth/UserMenu';
import { SitewidePromoBanner } from './SitewidePromoBanner';
import { DeliveryLocationPicker } from './DeliveryLocationPicker';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Truck,
  Package,
  Store,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Tag,
  ArrowRight,
  Star,
  User,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    user,
    openAuthModal,
    logout,
    cartCount,
    cartSubtotal,
    wishlist,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    products,
    openQuickView,
    viewProductDetail,
    activeView,
    setActiveView,
    orders,
    storeSettings,
    isAppMenuOpen,
    setIsAppMenuOpen
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategoryBar, setShowCategoryBar] = useState(true);
  const transitionLockUntilRef = useRef<number>(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showCategoryBarRef = useRef<boolean>(true);
  useEffect(() => {
    showCategoryBarRef.current = showCategoryBar;
  }, [showCategoryBar]);

  // Rock-solid directional scroll listener: prevents any jitter, dancing or swinging feedback loops
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let accumulatedDown = 0;
    let accumulatedUp = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const now = Date.now();

      // When at or near the top of the page, always show category bar stably
      if (currentScrollY <= 40) {
        setIsScrolled(false);
        if (!showCategoryBarRef.current) {
          setShowCategoryBar(true);
          showCategoryBarRef.current = true;
          transitionLockUntilRef.current = now + 400;
        }
        accumulatedDown = 0;
        accumulatedUp = 0;
        lastScrollY = currentScrollY;
        return;
      }

      setIsScrolled(true);

      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // During animation transition, ignore scroll events to eliminate layout feedback loops
      if (now < transitionLockUntilRef.current) {
        accumulatedDown = 0;
        accumulatedUp = 0;
        return;
      }

      // Directional threshold accumulator with hysteresis
      if (delta > 0) {
        // Scrolling downward
        accumulatedUp = 0;
        accumulatedDown += delta;
        if (accumulatedDown > 60 && currentScrollY > 120) {
          if (showCategoryBarRef.current) {
            setShowCategoryBar(false);
            showCategoryBarRef.current = false;
            transitionLockUntilRef.current = now + 400;
            accumulatedDown = 0;
          }
        }
      } else if (delta < 0) {
        // Scrolling upward
        accumulatedDown = 0;
        accumulatedUp += Math.abs(delta);
        if (accumulatedUp > 45) {
          if (!showCategoryBarRef.current) {
            setShowCategoryBar(true);
            showCategoryBarRef.current = true;
            transitionLockUntilRef.current = now + 400;
            accumulatedUp = 0;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live search recommendations
  const trimmedQuery = searchQuery.trim().toLowerCase();
  
  const searchResults = trimmedQuery
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(trimmedQuery) ||
            p.category.toLowerCase().includes(trimmedQuery) ||
            p.description.toLowerCase().includes(trimmedQuery) ||
            p.tags.some((t) => t.toLowerCase().includes(trimmedQuery))
        )
        .slice(0, 6)
    : [];

  // Find matching categories for quick filtering
  const matchingCategories = trimmedQuery
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmedQuery) ||
          c.slug.toLowerCase().includes(trimmedQuery)
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsSearchFocused(true);
    // If not already on home catalog view, switch so the user sees results filter live
    if (activeView !== 'home' && value.trim().length > 0) {
      setActiveView('home');
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsSearchFocused(false);
      if (activeView !== 'home') {
        setActiveView('home');
      }
      const el = document.getElementById('jabute-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setActiveView('home');
    setIsMobileMenuOpen(false);
    setIsSearchFocused(false);
    // Smooth scroll to product catalog
    const el = document.getElementById('jabute-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    setActiveView('home');
    setSelectedCategory('all');
    setSearchQuery('');
    setIsAppMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchFocused(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllSearchResults = () => {
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    if (activeView !== 'home') {
      setActiveView('home');
    }
    const el = document.getElementById('jabute-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-amber-200/80 text-stone-900 font-bold px-0.5 rounded-xs">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <>
      {/* Sitewide Promotional Banner Component (at normal document top, scrolls naturally out of view) */}
      <SitewidePromoBanner />

      <header
        id="jabute-header"
        style={{ overflowAnchor: 'none' }}
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
          isScrolled
            ? 'shadow-md border-b border-stone-200/90'
            : 'shadow-xs border-b border-stone-200'
        }`}
      >
        {/* Main Navbar: Top icons from Menu to Cart stay 100% stable, fixed height, floating at top */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          
          {/* Top-Left: 3-Lines (☰) Menu Icon, Brand Name & Delivery Address */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* 3-Lines Hamburger Menu Button */}
            <button
              id="top-left-menu-btn"
              onClick={() => setIsAppMenuOpen(true)}
              className="p-2 sm:p-2.5 -ml-1 sm:-ml-1.5 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:bg-stone-200 transition-colors cursor-pointer group flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stone-900"
              aria-label="Open Store Menu"
              title="Open Store Menu (3 lines)"
            >
              <Menu className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-stone-800 group-hover:scale-105 transition-transform" />
            </button>

            {/* Brand Logo Button: Tap logo to go Home (Clean text without J logo box) */}
            <button
              id="jabute-logo-btn"
              onClick={handleLogoClick}
              className="group text-left focus:outline-none flex flex-col cursor-pointer"
              title="Return to Home"
            >
              <span className="font-black text-xl sm:text-2xl tracking-tighter text-stone-900 leading-none group-hover:text-amber-600 transition-colors">
                {storeSettings.storeName || 'JABUTE'}
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-stone-400 font-bold mt-0.5">
                Direct Retail Store
              </span>
            </button>

            {/* Auto-detected Delivery Address */}
            <DeliveryLocationPicker />
          </div>

          {/* Large Real-Time Product Search Bar with Live Recommendations (Expanded space) */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl lg:max-w-3xl relative">
            <div className="relative w-full">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none ${
                searchQuery.trim() ? 'text-amber-600' : 'text-stone-400'
              }`} />
              <input
                ref={searchInputRef}
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products in real-time (e.g., headphones, watch, bag)..."
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm placeholder-stone-400 text-stone-900 transition-all shadow-2xs ${
                  searchQuery.trim()
                    ? 'bg-white border-2 border-stone-900 ring-2 ring-stone-900/10'
                    : 'bg-stone-100/90 border border-stone-200/90 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 p-1 rounded-full cursor-pointer transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Real-Time Autocomplete & Search Results Dropdown */}
            <AnimatePresence>
              {isSearchFocused && trimmedQuery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 z-50 overflow-hidden"
                >
                  {/* Search Header Info */}
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400 px-3 py-1.5 flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="flex items-center gap-1.5 text-stone-700">
                      <Search className="w-3.5 h-3.5 text-amber-500" />
                      <span>Live Results ({searchResults.length})</span>
                    </span>
                    <span className="text-[11px] normal-case text-stone-500 font-normal">
                      Press <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-700 font-mono text-[10px] border border-stone-200">Enter</kbd> to view all
                    </span>
                  </div>

                  {/* Matching Categories Quick Filters */}
                  {matchingCategories.length > 0 && (
                    <div className="p-2 border-b border-stone-100 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-stone-400">Categories:</span>
                      {matchingCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.slug)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3 text-stone-500" />
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Product Results List */}
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto mt-1 no-scrollbar">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            viewProductDetail(product.id);
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center justify-between gap-3 p-2.5 hover:bg-stone-50 rounded-xl cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0 border border-stone-200 group-hover:scale-105 transition-transform"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                                {highlightMatch(product.name, trimmedQuery)}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                                <span className="font-black text-stone-900">${product.price.toFixed(2)}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-stone-400 line-through text-[10px]">
                                    ${product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                                <span className="text-stone-300">•</span>
                                <span className="text-stone-500 uppercase text-[10px] font-semibold">{product.category}</span>
                                <span className="text-stone-300">•</span>
                                <div className="flex items-center gap-0.5 text-stone-600 font-bold text-[10px]">
                                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                                  <span>{product.rating.toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openQuickView(product);
                                setIsSearchFocused(false);
                              }}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Quick View
                            </button>
                            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-stone-500 space-y-2">
                      <p>No products found matching "<strong className="text-stone-800">{searchQuery}</strong>".</p>
                      <p className="text-[11px] text-stone-400">Try searching for generic keywords like "audio", "desk", "watch", or "case".</p>
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  {searchResults.length > 0 && (
                    <div className="pt-2 mt-1 border-t border-stone-100">
                      <button
                        onClick={handleViewAllSearchResults}
                        className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>View All Catalog Results</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Icons: Wishlist -> Shopping Bag (items only) -> Profile DP (Last) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

            {/* Wishlist */}
            <button
              id="wishlist-btn"
              onClick={() => {
                setActiveView('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative p-2.5 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0 ${
                activeView === 'wishlist' ? 'bg-stone-100 text-stone-900' : ''
              }`}
              aria-label="Wishlist"
              title="Saved Products"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button: Displays ONLY amount of added items, NOT money */}
            <button
              id="open-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
              aria-label="Open Shopping Bag"
              title={cartCount > 0 ? `${cartCount} items in bag` : 'Shopping Bag'}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartCount > 0 ? `${cartCount} ${cartCount === 1 ? 'item' : 'items'}` : 'Bag'}
              </span>
            </button>

            {/* Google Authentication & User Profile Menu (DP Only, Last in top icons) */}
            <UserMenu />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer shrink-0"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation Bar - Collapses smoothly on downward scroll, reappears on upward scroll without swinging */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showCategoryBar
              ? 'max-h-16 opacity-100 pointer-events-auto'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
          style={{ overflowAnchor: 'none' }}
        >
          <div className="hidden md:flex items-center justify-between border-t border-stone-100 py-2.5 text-xs font-semibold text-stone-600 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all' && activeView === 'home'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                All Products
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.slug && activeView === 'home'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 shrink-0 font-medium">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% Authentic Products
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown & Real-Time Mobile Search */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-4 shadow-lg"
          >
            {/* Real-time Mobile Search with Clear button */}
            <div ref={mobileSearchRef} className="relative">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                searchQuery.trim() ? 'text-amber-600' : 'text-stone-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Real-time product search..."
                className="w-full pl-10 pr-10 py-2.5 bg-stone-100 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Mobile live results preview */}
              {trimmedQuery.length > 0 && searchResults.length > 0 && (
                <div className="mt-2 bg-stone-50 border border-stone-200 rounded-xl p-2 max-h-60 overflow-y-auto divide-y divide-stone-200/60">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        viewProductDetail(product.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 py-2 px-1 cursor-pointer"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-9 h-9 object-cover rounded-md bg-stone-200 border border-stone-300 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{product.name}</p>
                        <p className="text-[11px] font-black text-stone-700">${product.price.toFixed(2)}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    </div>
                  ))}
                  <button
                    onClick={handleViewAllSearchResults}
                    className="w-full py-1.5 mt-1 text-center text-xs font-bold text-stone-900 hover:underline"
                  >
                    View All Matching Products →
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Categories */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Shop by Category</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                    selectedCategory === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-800'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      selectedCategory === cat.slug ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="pt-2 border-t border-stone-100 flex flex-col gap-1.5">
              {/* Mobile Auth Button */}
              {user ? (
                <div className="p-3 bg-stone-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full border border-amber-500 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{user.displayName || 'Customer'}</p>
                      <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-stone-200 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2">
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
                    <span>Sign In with Google</span>
                  </span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-1.5 py-0.5 rounded">
                    Firebase
                  </span>
                </button>
              )}


              <button
                onClick={() => {
                  setActiveView('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-2.5 bg-stone-100 rounded-xl text-xs font-bold text-stone-900 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-500" /> Store Owner Dashboard
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  setActiveView('orders');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-800 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-500" /> My Orders & Tracking
                </span>
                <div className="flex items-center gap-1.5">
                  {orders.length > 0 && (
                    <span className="bg-stone-200 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {orders.length}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveView('wishlist');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-800 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" /> Saved Wishlist ({wishlist.length})
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
};

