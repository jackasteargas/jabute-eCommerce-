import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    setActiveView
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImageIndex(0);
      setSelectedColor(quickViewProduct.colors?.[0]?.name || '');
      setSelectedSize(quickViewProduct.sizes?.[0] || '');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity, selectedColor, selectedSize);
    closeQuickView();
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      <div id="quick-view-overlay" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-stone-200 z-10 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 bg-stone-100/80 hover:bg-stone-200 text-stone-700 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Column (Fixed / Non-scrolling) */}
            <div className="bg-stone-100/60 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200 md:sticky md:top-0 md:self-start">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-inner mb-4">
                <img
                  src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                {quickViewProduct.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-stone-900 text-white text-[11px] font-bold tracking-wider uppercase rounded-md shadow-xs">
                    {quickViewProduct.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {quickViewProduct.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {quickViewProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-white transition-all shrink-0 ${
                        selectedImageIndex === idx ? 'border-stone-900 ring-2 ring-stone-900/20' : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column: Price is Pinned at Top, Description Scrolls Below */}
            <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Pinned Title & Price Section */}
                <div className="sticky top-0 bg-white z-10 pb-3 border-b border-stone-100 -mt-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
                    <span className="uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px]">{quickViewProduct.category}</span>
                    <span className="text-[11px]">SKU: {quickViewProduct.sku}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                    {quickViewProduct.name}
                  </h2>
                  {quickViewProduct.subtitle && (
                    <p className="text-xs text-stone-500 mt-0.5">{quickViewProduct.subtitle}</p>
                  )}

                  {/* Pinned Price Display */}
                  <div className="flex items-baseline gap-3 pt-2">
                    <span className="text-2xl sm:text-3xl font-black text-stone-900">${quickViewProduct.price.toFixed(2)}</span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-sm text-stone-400 line-through">
                        ${quickViewProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                    {quickViewProduct.discountPercentage && (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-md border border-rose-200">
                        Save {quickViewProduct.discountPercentage}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating & Stock */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{quickViewProduct.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500 font-medium">{quickViewProduct.reviewCount} customer reviews</span>
                  <span className="text-stone-400">•</span>
                  <span className={`font-semibold ${quickViewProduct.stock > 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {quickViewProduct.stock > 10 ? 'In Stock' : `Only ${quickViewProduct.stock} left`}
                  </span>
                </div>

                {/* Description (Scrolls smoothly) */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Description</div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {quickViewProduct.description}
                  </p>
                </div>

                {/* Color Swatches */}
                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-semibold text-stone-800 flex items-center justify-between">
                      <span>Color Option:</span>
                      <span className="text-stone-500 font-normal">{selectedColor}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`relative p-0.5 rounded-full transition-all ${
                            selectedColor === c.name ? 'ring-2 ring-stone-900 ring-offset-2' : 'hover:scale-105'
                          }`}
                          title={c.name}
                        >
                          <span
                            className="w-6 h-6 rounded-full block border border-stone-300 shadow-inner"
                            style={{ backgroundColor: c.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-semibold text-stone-800 flex items-center justify-between">
                      <span>Size:</span>
                      <span className="text-stone-500 font-normal">{selectedSize}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            selectedSize === s
                              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications Checklist */}
                {quickViewProduct.features && (
                  <div className="pt-2 border-t border-stone-100 space-y-1.5">
                    <p className="text-xs font-bold text-stone-800">Highlights</p>
                    <ul className="text-xs text-stone-600 space-y-1">
                      {quickViewProduct.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons & Quantity */}
              <div className="pt-6 border-t border-stone-200 mt-6 space-y-3">
                <div className="flex gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl px-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                      className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • ${(quickViewProduct.price * quantity).toFixed(2)}</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(quickViewProduct)}
                    className={`p-3 rounded-xl border transition-colors flex items-center justify-center ${
                      inWishlist
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Buy Now Direct Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2">
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-stone-400" /> Dispatched within 24 hours</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official 2-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
