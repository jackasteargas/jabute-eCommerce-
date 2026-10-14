import React, { useState } from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Star, ShoppingBag, Eye, Heart, Check, Zap, Video, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  variant?: 'standard' | 'showcase';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'standard' }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    openQuickView,
    viewProductDetail
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.name || ''
  );
  const [isAdded, setIsAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor, product.sizes?.[0]);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const isLowStock = product.stock > 0 && product.stock <= 15;
  const isOutOfStock = product.stock <= 0;

  if (variant === 'showcase') {
    return (
      <motion.div
        id={`product-card-${product.id}`}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative col-span-2 md:col-span-2 flex flex-col sm:flex-row bg-white rounded-2xl sm:rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-stone-300 transition-all duration-300"
      >
        {/* Left Side: Wide Landscape Image */}
        <div
          className="relative w-full sm:w-1/2 aspect-16/10 sm:aspect-auto bg-stone-100 overflow-hidden cursor-pointer"
          onClick={() => viewProductDetail(product.id)}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-stone-900 text-amber-400 shadow-md">
              {product.badge || 'Curator Spotlight'}
            </span>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="px-2 py-1 bg-rose-600 text-white text-[10px] font-black rounded-lg shadow-sm">
                Save {product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
              inWishlist
                ? 'bg-white text-rose-500 shadow-md'
                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-950'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Video Preview Tag if video available */}
          {product.videos && product.videos.length > 0 && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/85 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                <Video className="w-3 h-3 text-amber-400" />
                <span>4K Video Attached</span>
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Editorial Content & Fast Buy */}
        <div className="w-full sm:w-1/2 p-4 sm:p-6 flex flex-col justify-between space-y-3 sm:space-y-4">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="uppercase tracking-widest font-black text-[10px] text-amber-700">
                {product.category}
              </span>
              <div className="flex items-center gap-1 font-bold text-stone-800 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-stone-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h3
              onClick={() => viewProductDetail(product.id)}
              className="text-base sm:text-lg lg:text-xl font-black text-stone-900 hover:text-stone-700 cursor-pointer line-clamp-2 leading-tight transition-colors"
            >
              {product.name}
            </h3>

            {/* Description / Subtitle */}
            <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
              {product.subtitle || product.description}
            </p>

            {/* Feature Bullets (Show 2) */}
            {product.features && product.features.length > 0 && (
              <div className="mt-3 space-y-1 hidden sm:block">
                {product.features.slice(0, 2).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-stone-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Actions & Price */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400">Direct Price</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-black text-stone-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-stone-400 line-through">
                    ${product.originalPrice.toFixed(0)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickViewClick}
                className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                title="Quick Preview"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={handleQuickAdd}
                disabled={isOutOfStock}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-lg hover:border-stone-300 transition-all duration-250"
    >
      {/* Product Image Container */}
      <div
        className="relative aspect-4/3 sm:aspect-square bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => viewProductDetail(product.id)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-400 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md shadow-2xs ${
                product.badge === 'Sale'
                  ? 'bg-rose-600 text-white'
                  : product.badge === 'Best Seller'
                  ? 'bg-stone-900 text-white'
                  : product.badge === 'New'
                  ? 'bg-emerald-600 text-white'
                  : product.badge === 'Staff Pick'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-800 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-black rounded-md border border-rose-200">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all shadow-2xs cursor-pointer ${
            inWishlist
              ? 'bg-white text-rose-500 shadow-sm'
              : 'bg-white/85 text-stone-600 hover:bg-white hover:text-stone-900'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Floating Button */}
        <div
          className={`absolute inset-x-3 bottom-3 z-10 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={handleQuickViewClick}
            className="w-full py-2 bg-white/95 hover:bg-white text-stone-900 text-xs font-bold rounded-xl border border-stone-200 shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Preview</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-2.5">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-stone-500 mb-0.5 sm:mb-1">
            <span className="uppercase tracking-wider font-bold text-[9px] sm:text-[10px] text-stone-400 truncate max-w-[60%]">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 font-semibold text-stone-700 text-[10px] sm:text-xs shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-500" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-stone-400 text-[9px] sm:text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => viewProductDetail(product.id)}
            className="text-xs sm:text-sm font-bold text-stone-900 hover:text-stone-700 cursor-pointer line-clamp-1 leading-snug transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Subtitle / Short description */}
          {product.subtitle ? (
            <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-1 mt-0.5 leading-relaxed hidden sm:block">
              {product.subtitle}
            </p>
          ) : (
            <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-1 mt-0.5 leading-relaxed hidden sm:block">
              {product.description}
            </p>
          )}

          {/* Color Swatch Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-2">
              {product.colors.slice(0, 3).map((c) => (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c.name);
                  }}
                  className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border transition-all cursor-pointer ${
                    selectedColor === c.name ? 'ring-1.5 sm:ring-2 ring-stone-900 ring-offset-1 scale-110' : 'border-stone-300'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
              <span className="text-[9px] sm:text-[10px] text-stone-400 font-medium ml-0.5">
                {product.colors.length} {product.colors.length === 1 ? 'col' : 'cols'}
              </span>
            </div>
          )}
        </div>

        {/* Pricing, Stock Status & Add to Cart Button */}
        <div className="pt-1.5 sm:pt-2 border-t border-stone-100 flex items-center justify-between gap-1 sm:gap-2">
          {/* Price & Stock Badge */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-base font-black text-stone-900 truncate">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[9px] sm:text-xs text-stone-400 line-through font-normal hidden xs:inline">
                  ${product.originalPrice.toFixed(0)}
                </span>
              )}
            </div>

            {isOutOfStock ? (
              <span className="text-[9px] sm:text-[10px] font-bold text-rose-600">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 flex items-center gap-0.5 truncate">
                <Zap className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-amber-500 text-amber-500 shrink-0" />
                <span className="truncate">Only {product.stock} left</span>
              </span>
            ) : (
              <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600">In Stock</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs active:scale-95'
            }`}
            aria-label="Add to Bag"
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline text-[10px] sm:text-[11px]">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-[11px]">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
