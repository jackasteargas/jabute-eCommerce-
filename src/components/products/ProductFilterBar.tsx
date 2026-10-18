import React from 'react';
import { useShop } from '../../context/ShopContext';
import { SortOption } from '../../types';
import { SlidersHorizontal, X, Check, ArrowUpDown } from 'lucide-react';

export const ProductFilterBar: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    minPrice,
    maxPrice,
    setPriceFilter,
    inStockOnly,
    setInStockOnly,
    selectedTag,
    setSelectedTag,
    resetFilters,
    filteredProducts
  } = useShop();

  const priceRanges = [
    { label: 'All Prices', min: 0, max: 1000 },
    { label: 'Under $100', min: 0, max: 100 },
    { label: '$100 – $250', min: 100, max: 250 },
    { label: '$250+', min: 250, max: 1000 }
  ];

  const popularTags = ['audio', 'workspace', 'minimalist', 'wireless', 'backpack', 'luxury', 'ceramic'];

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    minPrice > 0 ||
    maxPrice < 1000 ||
    inStockOnly ||
    selectedTag !== null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4 mb-8">
      {/* Top Row: Categories & Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Products ({filteredProducts.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto">
          <div className="flex items-center gap-1.5 text-sm text-stone-600 font-semibold">
            <ArrowUpDown className="w-4 h-4 text-stone-500" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-xl px-3.5 py-2 text-sm font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors cursor-pointer"
          >
            <option value="featured">Featured Curations</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Secondary Row: Quick Filters & Active Chips */}
      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-sm">
        {/* Left: Price Presets & In-Stock */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-stone-500 font-bold text-xs uppercase">Price:</span>
          {priceRanges.map((range) => {
            const isSelected = minPrice === range.min && maxPrice === range.max;
            return (
              <button
                key={range.label}
                onClick={() => setPriceFilter(range.min, range.max)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {range.label}
              </button>
            );
          })}

          <label className="flex items-center gap-2 cursor-pointer ml-2 text-stone-800 select-none font-semibold text-xs sm:text-sm">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-stone-300 text-stone-900 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <span>In-Stock Only</span>
          </label>
        </div>

        {/* Right: Tag Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-stone-500 font-bold text-xs uppercase">Tags:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              #{tag}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-stone-600 hover:text-rose-600 text-xs sm:text-sm font-bold flex items-center gap-1.5 pl-2 underline decoration-stone-300 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
