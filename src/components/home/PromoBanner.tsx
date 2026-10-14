import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Tag, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const PromoBanner: React.FC = () => {
  const { applyPromoCode, setSelectedCategory, addToast } = useShop();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('VIP20');
    applyPromoCode('VIP20');
    setCopied(true);
    addToast('Code VIP20 Copied & Applied!', '20% discount on orders over $150', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShopLiving = () => {
    setSelectedCategory('minimalist-living');
    const el = document.getElementById('featured-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl border border-stone-800">
          {/* Background image with gradient blend */}
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80"
              alt="Promo background"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 border border-stone-700 text-amber-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited Mid-Season Special</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Transform Your Space with 20% Off Architectural Living.
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Elevate your home studio with cast ceramic lighting, Japanese matcha ritual kits, and precision aluminum risers. Use code <strong className="text-white">VIP20</strong> on orders over $150.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleCopyCode}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-full text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-stone-950" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Code Applied!' : 'Claim VIP20 Code'}</span>
              </button>

              <button
                onClick={handleShopLiving}
                className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 font-semibold rounded-full text-xs flex items-center gap-2 transition-colors"
              >
                <span>Shop Minimalist Living</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
