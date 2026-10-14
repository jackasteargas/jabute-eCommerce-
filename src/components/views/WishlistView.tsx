import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../products/ProductCard';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, setActiveView } = useShop();

  return (
    <div className="py-8 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => setActiveView('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3.5 py-1.5 rounded-xl border border-stone-200 shadow-2xs mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Saved Wishlist</h1>
            <p className="text-xs text-stone-500">Your saved items from JABUTE direct catalog.</p>
          </div>
          <span className="text-xs font-bold text-stone-400">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
            <Heart className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-900">Your wishlist is empty</h3>
            <p className="text-xs text-stone-500">Tap the heart icon on any product in the store to save it here.</p>
            <button
              onClick={() => setActiveView('home')}
              className="mt-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
