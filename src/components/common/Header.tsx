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
    setIsAppMenuOpen,
    isAdmin
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Stable scroll listener for elevation shadow without any height movement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    setIsSearchFocused(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllSearchResults = () => {
    setIsSearchFocused(false);
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
        {/* Main Navbar: Full screen edge-to-edge width, all icons visible on mobile and desktop */}
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-6">
          
          {/* Top-Left: 3-Lines (☰) Menu Icon, Brand Name & Delivery Address */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* 3-Lines Hamburger Menu Button */}
            <button
              id="top-left-menu-btn"
              onClick={() => setIsAppMenuOpen(true)}
              className="p-1.5 sm:p-2.5 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 active:bg-stone-200 transition-colors cursor-pointer group flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stone-900 shrink-0"
              aria-label="Open Store Menu"
              title="Open Store Menu (3 lines)"
            >
              <Menu className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-stone-800 group-hover:scale-105 transition-transform" />
            </button>

            {/* Brand Logo Button: Tap logo to go Home */}
            <button
              id="jabute-logo-btn"
              onClick={handleLogoClick}
              className="group text-left focus:outline-none flex flex-col cursor-pointer shrink-0"
              title="Return to Home"
            >
              <span className="font-black text-lg sm:text-2xl tracking-tighter text-stone-900 leading-none group-hover:text-amber-600 transition-colors">
                {storeSettings.storeName || 'JABUTE'}
              </span>
              <span className="text-[8px] sm:text-[10px] tracking-widest uppercase text-stone-400 font-bold mt-0.5 hidden xs:inline">
                Direct Retail Store
              </span>
            </button>

            {/* Auto-detected Delivery Address */}
            <div className="shrink-0">
              <DeliveryLocationPicker />
            </div>
          </div>

          {/* Large Real-Time Product Search Bar with Live Recommendations (Desktop & Tablet) */}
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

          {/* Right Action Icons: Wishlist -> Shopping Bag (items only) -> Profile DP (Last) - ALL visible on mobile! */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

            {/* Wishlist */}
            <button
              id="wishlist-btn"
              onClick={() => {
                setActiveView('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative p-1.5 sm:p-2.5 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0 ${
                activeView === 'wishlist' ? 'bg-stone-100 text-stone-900' : ''
              }`}
              aria-label="Wishlist"
              title="Saved Products"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1.5 sm:right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button: Displays ONLY amount of added items, NOT money */}
            <button
              id="open-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1 sm:gap-2 bg-stone-900 hover:bg-stone-800 text-white px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
              aria-label="Open Shopping Bag"
              title={cartCount > 0 ? `${cartCount} items in bag` : 'Shopping Bag'}
            >
              <div className="relative">
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xs:inline text-[11px] sm:text-xs">
                {cartCount > 0 ? `${cartCount} ${cartCount === 1 ? 'item' : 'items'}` : 'Bag'}
              </span>
              <span className="xs:hidden text-[11px] font-bold">
                {cartCount > 0 ? cartCount : 'Bag'}
              </span>
            </button>

            {/* Google Authentication & User Profile Menu (DP Only, Last in top icons) */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile Real-Time Search Bar Row (Directly visible on mobile, exactly like desktop) */}
        <div ref={mobileSearchRef} className="md:hidden pb-2.5 pt-0.5 px-1 relative">
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none ${
              searchQuery.trim() ? 'text-amber-600' : 'text-stone-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search products in real-time..."
              className="w-full pl-9 pr-9 py-2 bg-stone-100 rounded-xl text-xs text-stone-900 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 bg-stone-200 p-0.5 rounded-full cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Bar - Stable, never swinging or moving, full-screen on mobile and desktop */}
        <div className="border-t border-stone-100 py-2 text-xs font-semibold text-stone-600 overflow-x-auto no-scrollbar flex items-center justify-between">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs ${
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
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs ${
                  selectedCategory === cat.slug && activeView === 'home'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-stone-500 shrink-0 font-medium ml-4">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% Authentic Products
            </span>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

