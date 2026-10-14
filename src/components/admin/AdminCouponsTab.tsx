import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { PromoCode } from '../../types';
import {
  Tag,
  Plus,
  Trash2,
  Copy,
  Check,
  Percent,
  Calendar,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  X
} from 'lucide-react';

interface AdminCouponsTabProps {
  onRequestDeleteCoupon: (coupon: PromoCode) => void;
}

export const AdminCouponsTab: React.FC<AdminCouponsTabProps> = ({
  onRequestDeleteCoupon,
}) => {
  const { promos, addPromoCode, togglePromoCode, addToast } = useShop();

  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(15);
  const [minSpend, setMinSpend] = useState<number | undefined>(50);
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const resetForm = () => {
    setCode('');
    setDiscountPercentage(15);
    setMinSpend(50);
    setDescription('');
    setExpiresAt('2026-12-31');
    setIsAdding(false);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      addToast('Validation Error', 'Coupon code is required', 'error');
      return;
    }

    addPromoCode({
      code: code.trim().toUpperCase(),
      discountPercentage: Number(discountPercentage),
      minSpend: minSpend ? Number(minSpend) : undefined,
      description: description.trim() || `${discountPercentage}% OFF Storewide`,
      expiresAt: expiresAt || undefined,
      active: true,
    });

    resetForm();
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    addToast('Copied to Clipboard', `Promo code ${couponCode} copied`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-stone-900">
            Promotional Coupons & Store Discounts
          </h2>
          <p className="text-xs text-stone-500">
            Create percentage discount codes and free shipping coupons to boost customer conversions.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create New Coupon</span>
          </button>
        )}
      </div>

      {/* Create Promo Code Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateCoupon}
          className="bg-stone-50 border border-stone-300 rounded-2xl p-5 space-y-4 text-xs animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>New Promotional Voucher</span>
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., SUMMER20"
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Discount (% Off) *</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none font-bold text-stone-900"
                />
                <Percent className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Min Spend Threshold ($)</label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={minSpend ?? ''}
                  onChange={(e) => setMinSpend(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g., 75 (Optional)"
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
                <DollarSign className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-stone-700 font-bold mb-1">Customer Facing Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., 20% off all orders over $75 | Summer Sale"
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Publish Coupon</span>
            </button>
          </div>
        </form>
      )}

      {/* Promo Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((promo) => {
          const isCopied = copiedCode === promo.code;
          const isActive = promo.active !== false;

          return (
            <div
              key={promo.code}
              className={`rounded-2xl border p-4.5 space-y-3.5 transition-all relative ${
                isActive
                  ? 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  : 'bg-stone-100/60 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-stone-900 text-amber-400 font-mono font-black text-sm rounded-xl tracking-wider shadow-2xs">
                    {promo.code}
                  </div>
                  <button
                    onClick={() => handleCopy(promo.code)}
                    className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePromoCode(promo.code)}
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isActive ? 'Active' : 'Paused'}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-sm font-extrabold text-stone-900">
                  {promo.discountPercentage}% Discount
                </div>
                <p className="text-stone-600 leading-snug">{promo.description}</p>
                {promo.minSpend && (
                  <div className="text-stone-500 text-[11px]">
                    Requires minimum spend of <strong>${promo.minSpend}</strong>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-[11px] text-stone-400">
                <span>{promo.usageCount ?? 0} times used</span>
                <button
                  onClick={() => onRequestDeleteCoupon(promo)}
                  className="text-stone-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
