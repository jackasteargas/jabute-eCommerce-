import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../products/ProductCard';
import { ProductFilterBar } from '../products/ProductFilterBar';
import {
  FlashSalePanoramicAd,
  MysteryRewardInGridAd
} from '../products/InFeedAds';
import { Sparkles, PackageSearch, RefreshCw, ChevronDown, Grid3X3, Search, X } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { filteredProducts, resetFilters, selectedCategory, categories, searchQuery, setSearchQuery } = useShop();

  // Desktop requirement: 3 columns x 4 rows = 12 products initially visible
  const INITIAL_VISIBLE_COUNT = 12;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const currentCategoryTitle = selectedCategory === 'all'
    ? 'All Store Products'
    : activeCategoryObj?.name || 'Category Products';

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = filteredProducts.length > visibleCount;

  // Track dismissed ads during user session
  const [dismissedAds, setDismissedAds] = useState<Record<string, boolean>>({});

  const handleDismissAd = (adKey: string) => {
    setDismissedAds((prev) => ({ ...prev, [adKey]: true }));
  };

  return (
    <section id="jabute-catalog" className="py-8 sm:py-10 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        
        {/* Section Header with Quick Counts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest text-amber-600">
              <Sparkles className="w-4 h-4" />
              <span>Direct Store Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-0.5">
              {currentCategoryTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-900 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-lg font-semibold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Interactive Offers Feed</span>
              <span className="sm:hidden">Deals Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg font-semibold">
              <Grid3X3 className="w-4 h-4 text-stone-700" />
              <span>
                <strong className="text-stone-900">{displayedProducts.length}</strong> /{' '}
                <strong className="text-stone-900">{filteredProducts.length}</strong> items
              </span>
            </div>
          </div>
        </div>

        {/* Dense Interactive Filter Bar */}
        <ProductFilterBar />

        {/* Real-Time Active Search Banner */}
        {searchQuery.trim() && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-3 text-sm text-amber-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold shrink-0">
                <Search className="w-4 h-4" />
              </span>
              <span>
                Filtering in real-time for <strong className="font-extrabold text-stone-900">"{searchQuery}"</strong> —{' '}
                <strong className="font-bold text-amber-950">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'} matching
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 rounded-lg text-xs sm:text-sm font-bold border border-amber-200 transition-colors shadow-2xs cursor-pointer"
            >
              <X className="w-4 h-4 text-stone-500" />
              <span>Clear Search</span>
            </button>
          </div>
        )}

        {/* Dynamic Editorial Non-Uniform Grid with Smooth In-Feed Ads */}
        {displayedProducts.length > 0 ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-6 items-stretch">
              {(() => {
                const elements: React.ReactNode[] = [];
                // Asymmetric showcase cards to break the 3-3-3 pattern
                const showcaseIndices = new Set([0, 8, 13]);
                
                displayedProducts.forEach((product, idx) => {
                  // Smooth Panoramic Flash Drop Banner (after 5 products)
                  if (idx === 5 && !dismissedAds['ad-flash']) {
                    elements.push(
                      <FlashSalePanoramicAd
                        key="ad-flash"
                        onDismiss={() => handleDismissAd('ad-flash')}
                      />
                    );
                  }

                  // Smooth In-Grid Mystery Voucher Scratcher Card (after product 5, before product 6)
                  if (idx === 6 && !dismissedAds['ad-mystery']) {
                    elements.push(
                      <MysteryRewardInGridAd
                        key="ad-mystery"
                        onDismiss={() => handleDismissAd('ad-mystery')}
                      />
                    );
                  }

                  const isShowcase = showcaseIndices.has(idx);

                  elements.push(
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={isShowcase ? 'showcase' : 'standard'}
                    />
                  );
                });

                return elements;
              })()}
            </div>

            {/* Load More Button if more than 12 products */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Load More Products ({filteredProducts.length - visibleCount} remaining)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-10 text-center max-w-lg mx-auto my-6">
            <div className="w-14 h-14 rounded-2xl bg-stone-200/80 text-stone-600 flex items-center justify-center mx-auto mb-3">
              <PackageSearch className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">No products match your criteria</h3>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              We couldn't find any items matching your active search query or filter range. Try adjusting your filters.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
