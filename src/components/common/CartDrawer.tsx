import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    shippingCost,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    cartTotal,
    setActiveView
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-stone-900">Your Shopping Bag</h2>
                    <p className="text-xs text-stone-500">
                      {cart.reduce((t, i) => t + i.quantity, 0)} item{cart.length === 1 ? '' : 's'} selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="px-5 py-3.5 bg-stone-100/70 border-b border-stone-200">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
                  {amountNeededForFreeShipping > 0 ? (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Add <strong className="text-stone-900">${amountNeededForFreeShipping.toFixed(2)}</strong> more for Free Shipping
                    </span>
                  ) : (
                    <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Unlocked Free Express Delivery!
                    </span>
                  )}
                  <span className="text-stone-500 font-medium">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      freeShippingProgress >= 100 ? 'bg-emerald-500' : 'bg-stone-900'
                    }`}
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mb-1">Your bag is empty</h3>
                    <p className="text-xs text-stone-500 max-w-xs mb-6 leading-relaxed">
                      Discover our curated collection of minimalist audio, lifestyle essentials, and modern workspace goods.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-5 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      className="flex gap-4 p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200/80 group"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl bg-white border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() =>
                                removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                              }
                              className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                            {item.selectedColor && (
                              <span className="bg-stone-200/70 px-2 py-0.5 rounded-md text-stone-700">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="bg-stone-200/70 px-2 py-0.5 rounded-md text-stone-700">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-xs font-bold text-stone-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                            {item.quantity > 1 && (
                              <span className="text-[10px] font-normal text-stone-500 ml-1">
                                (${item.product.price.toFixed(2)} ea)
                              </span>
                            )}
                          </span>

                          {/* Stepper */}
                          <div className="flex items-center bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.selectedColor,
                                  item.selectedSize
                                )
                              }
                              className="p-1 text-stone-600 hover:bg-stone-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold text-stone-900 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.selectedColor,
                                  item.selectedSize
                                )
                              }
                              disabled={item.quantity >= item.product.stock}
                              className="p-1 text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer / Summary */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
                  {/* Promo Code Box */}
                  <div>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            <strong>{appliedPromo.code}</strong> applied ({appliedPromo.discountPercentage}% OFF)
                          </span>
                        </div>
                        <button
                          onClick={removePromoCode}
                          className="text-emerald-700 hover:text-emerald-900 underline font-semibold text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="space-y-1">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                            <input
                              type="text"
                              value={promoInput}
                              onChange={(e) => setPromoInput(e.target.value)}
                              placeholder="Promo code (try WELCOME10)"
                              className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-3.5 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && <p className="text-[11px] text-rose-500 pl-1">{promoError}</p>}
                      </form>
                    )}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-stone-900">${cartSubtotal.toFixed(2)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount ({appliedPromo?.discountPercentage}%)</span>
                        <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="font-semibold text-stone-900">
                        {shippingCost === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated Tax (7%)</span>
                      <span className="font-semibold text-stone-900">
                        ${(cartSubtotal * 0.07).toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-extrabold text-stone-900">
                      <span>Estimated Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    id="checkout-btn"
                    onClick={handleProceedToCheckout}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit SSL Encrypted & Protected</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
