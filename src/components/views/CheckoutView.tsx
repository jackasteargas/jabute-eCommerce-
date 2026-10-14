import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { ArrowLeft, ShieldCheck, Lock, CreditCard, Check, Truck, Tag, User, CheckCircle2, Sparkles } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    user,
    openAuthModal,
    cart,
    cartSubtotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    shippingCost,
    cartTotal,
    placeOrder,
    setActiveView,
    addToast,
    deliveryLocation
  } = useShop();

  const [fullName, setFullName] = useState(user?.displayName || 'Alex Mercer');
  const [email, setEmail] = useState(user?.email || 'alex.mercer@example.com');
  const [phone, setPhone] = useState('+1 (555) 349-8821');
  const [address, setAddress] = useState('1042 Montgomery Street, Suite 400');
  const [city, setCity] = useState(deliveryLocation?.city && deliveryLocation.city !== 'Detecting...' ? deliveryLocation.city : 'San Francisco');
  const [state, setState] = useState(deliveryLocation?.region || 'CA');
  const [postalCode, setPostalCode] = useState(deliveryLocation?.postalCode || '94133');
  const [country, setCountry] = useState(deliveryLocation?.country || 'United States');

  useEffect(() => {
    if (user) {
      if (user.displayName) setFullName(user.displayName);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (deliveryLocation?.city && deliveryLocation.city !== 'Detecting...') {
      setCity(deliveryLocation.city);
      if (deliveryLocation.postalCode) setPostalCode(deliveryLocation.postalCode);
      if (deliveryLocation.country) setCountry(deliveryLocation.country);
      if (deliveryLocation.region) setState(deliveryLocation.region);
    }
  }, [deliveryLocation]);

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'google_pay' | 'cash_on_delivery'>('credit_card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [promoInput, setPromoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast('Cart is Empty', 'Please add items before checking out', 'warning');
      return;
    }

    if (!fullName || !email || !address || !city || !postalCode) {
      addToast('Missing Details', 'Please fill in all required shipping fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Smooth simulation
      const customer = {
        fullName,
        email,
        phone,
        address,
        city,
        state,
        postalCode,
        country
      };
      await placeOrder(customer, paymentMethod);
    } catch (err) {
      addToast('Order Failed', 'An error occurred while placing your order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
    setPromoInput('');
  };

  return (
    <div className="py-8 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Back Link */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-full border border-stone-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shop</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form: Customer & Shipping & Payment */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Google Account Authentication Banner */}
              {user ? (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full border border-emerald-400"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-emerald-950">Signed in with Google</p>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-[11px] text-emerald-800">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
                    Cloud Synced
                  </span>
                </div>
              ) : (
                <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-amber-300 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Have a Google Account?</p>
                      <p className="text-[11px] text-stone-600">Sign in to save this order to Firestore and track delivery anytime.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Step 1: Contact Details */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-stone-400">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-stone-400">
                  2. Shipping Destination
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">State / Province</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="Japan">Japan</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-stone-400">
                  3. Payment Method
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'credit_card', label: 'Credit Card', icon: <CreditCard className="w-4 h-4" /> },
                    { id: 'apple_pay', label: 'Apple Pay', icon: <span> Pay</span> },
                    { id: 'google_pay', label: 'Google Pay', icon: <span>G Pay</span> },
                    { id: 'cash_on_delivery', label: 'Pay on Delivery', icon: <Truck className="w-4 h-4" /> },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === p.id
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {p.icon}
                      <span className="text-[11px]">{p.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-3 pt-3 border-t border-stone-100">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• ••••"
                        className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Expiration (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">CVC / Security Code</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5 sticky top-24">
              <h3 className="text-sm font-bold text-stone-900">Order Summary ({cart.length} items)</h3>

              {/* Items List */}
              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1 space-y-3">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}`} className="pt-3 flex gap-3 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg bg-stone-100 border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor}`}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo input */}
              <div className="pt-3 border-t border-stone-100">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <strong>{appliedPromo.code}</strong> (-{appliedPromo.discountPercentage}%)
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo Code"
                      className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${cartSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-stone-900">
                    {shippingCost === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (7%)</span>
                  <span className="font-semibold text-stone-900">${(cartSubtotal * 0.07).toFixed(2)}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-base font-extrabold text-stone-900">
                  <span>Total Due</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize & Place Order • ${cartTotal.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>30-Day Guaranteed Returns & Full Warranty</span>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
