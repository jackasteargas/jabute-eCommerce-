import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Sparkles, ShieldCheck, Zap, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, products, openQuickView } = useShop();

  const flagshipProduct = products[0];

  const scrollToCatalog = (categorySlug = 'all') => {
    setSelectedCategory(categorySlug);
    const el = document.getElementById('jabute-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-stone-100/70 border-b border-stone-200 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Brand Summary & Value Props */}
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-stone-100 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>JABUTE Official Direct Retail Catalog</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight">
              Premium Gear, Tech & Daily Essentials.
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Every item is inspected, packed, and fulfilled directly by JABUTE. Enjoy guaranteed authentic goods, direct pricing, fast express dispatch, and responsive customer care.
            </p>

            {/* Value Trust Tags */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-stone-700 font-semibold">
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                <Truck className="w-3.5 h-3.5 text-amber-500" /> Direct Warehouse Dispatch
              </span>
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 1-Year Direct Store Warranty
              </span>
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-900" /> 100% Guaranteed Authentic
              </span>
            </div>
          </div>

          {/* Right Spotlight Highlight */}
          {flagshipProduct && (
            <div className="lg:col-span-4 bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs flex items-center gap-3.5">
              <img
                src={flagshipProduct.images[0]}
                alt={flagshipProduct.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                  Flagship Arrival
                </span>
                <h3 className="text-xs font-bold text-stone-900 truncate mt-0.5">
                  {flagshipProduct.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-black text-stone-900">${flagshipProduct.price.toFixed(2)}</span>
                  {flagshipProduct.originalPrice && (
                    <span className="text-xs text-stone-400 line-through">${flagshipProduct.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <button
                  onClick={() => openQuickView(flagshipProduct)}
                  className="mt-2 text-[11px] font-bold text-stone-900 hover:text-stone-700 underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Quick View Item</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
