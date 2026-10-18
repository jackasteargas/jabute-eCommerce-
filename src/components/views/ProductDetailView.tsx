import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../products/ProductCard';
import { saveReviewToFirestore, fetchProductReviews } from '../../lib/firebase';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Share2,
  Zap,
  CheckCircle2,
  MessageSquare,
  Bot,
  Sparkles,
  User,
  Cloud,
  Video
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    user,
    openAuthModal,
    products,
    selectedProductId,
    setActiveView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    addToast
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [newReviewAuthor, setNewReviewAuthor] = useState(user?.displayName || user?.email?.split('@')[0] || '');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState(product.reviewsList || []);

  useEffect(() => {
    if (user?.displayName && !newReviewAuthor) {
      setNewReviewAuthor(user.displayName);
    }
  }, [user]);

  // Load Firestore reviews for this product
  useEffect(() => {
    let isMounted = true;
    fetchProductReviews(product.id)
      .then((remoteReviews) => {
        if (isMounted && remoteReviews && remoteReviews.length > 0) {
          setLocalReviews((prev) => {
            const ids = new Set(prev.map((r) => r.id));
            const newItems = remoteReviews.filter((r) => !ids.has(r.id));
            return [...newItems, ...prev];
          });
        }
      })
      .catch((err) => console.error('Error fetching reviews:', err));

    return () => {
      isMounted = false;
    };
  }, [product.id]);

  const inWishlist = isInWishlist(product.id);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.category === product.category))
    .slice(0, 6);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Link Copied!', 'Direct product link copied to clipboard', 'info');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const reviewObj = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      verified: true
    };

    // Save to Firestore
    saveReviewToFirestore({
      productId: product.id,
      productName: product.name,
      userId: user?.uid,
      author: reviewObj.author,
      rating: reviewObj.rating,
      comment: reviewObj.comment,
      verified: true
    }).catch((err) => console.error('Error saving review to Firestore:', err));

    setLocalReviews([reviewObj, ...localReviews]);
    setNewReviewComment('');
    addToast('Review Submitted', 'Thank you for your verified product review! Saved to Firestore.', 'success');
  };

  return (
    <div className="py-6 sm:py-8 bg-stone-50 min-h-screen w-full">
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Back Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-stone-900 transition-colors bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store Catalog</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900 transition-colors bg-white px-4 py-2.5 rounded-xl border border-stone-200 cursor-pointer shadow-2xs font-bold"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Product</span>
          </button>
        </div>

        {/* 2-Column Split Layout: Sticky Left Column (Photo & Price STAY PERMANENTLY FIXED) | Scrollable Right Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT COLUMN: Stretches full grid height; inner div is sticky so Photo & Price stay in view */}
          <div className="lg:col-span-5 xl:col-span-5 relative">
            <div className="lg:sticky lg:top-24 space-y-4">
              
              {/* Product Photo Gallery Card */}
              <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner group">
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                  />
                  {product.badge && (
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-stone-900/90 backdrop-blur-xs text-white text-xs font-bold uppercase rounded-lg shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <span className="absolute top-3.5 right-3.5 px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-sm">
                      -{product.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Thumbnails Row */}
                {product.images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                          selectedImage === i ? 'border-stone-900 ring-2 ring-stone-900/20 scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pinned Price & Instant Order Action Box (Permanently stays with photo on scroll) */}
              <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4">
                
                {/* Price & Stock Header */}
                <div className="flex items-baseline justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Direct Retail Price</div>
                    <div className="flex items-baseline gap-2.5 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-stone-400 line-through font-normal">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
                      product.stock > 15 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-amber-700 bg-amber-50 border border-amber-200'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      <span>{product.stock > 15 ? 'In Stock' : `Only ${product.stock} left`}</span>
                    </span>
                  </div>
                </div>

                {/* Quantity & Action Buttons */}
                <div className="space-y-3">
                  <div className="flex gap-2.5">
                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl px-2 shrink-0">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-10 flex items-center justify-center font-bold text-base text-stone-700 hover:text-stone-950 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-stone-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-8 h-10 flex items-center justify-center font-bold text-base text-stone-700 hover:text-stone-950 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                      onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
                      className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • ${(product.price * quantity).toFixed(2)}</span>
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-3 rounded-xl border transition-colors flex items-center justify-center cursor-pointer shrink-0 ${
                        inWishlist
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
                      }`}
                      title="Save to wishlist"
                      aria-label="Save to wishlist"
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Instant Checkout Button */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-stone-950" />
                    <span>Instant Checkout</span>
                  </button>
                </div>

                {/* Direct Store Guarantees */}
                <div className="grid grid-cols-3 gap-2 text-xs text-stone-600 pt-3 border-t border-stone-100 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Free Ship &gt;$99</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-stone-500 shrink-0" />
                    <span>30-Day Return</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1-Yr Warranty</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Scrollable Product Details (Description & Others scroll freely) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8 min-w-0">

            {/* Product Title, Category, Rating & Quick Jump */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 font-semibold">
                <span className="uppercase tracking-widest text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-md border border-amber-200/60">
                  {product.category}
                </span>
                <span className="font-mono text-xs">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-base text-stone-600 font-medium leading-relaxed">{product.subtitle}</p>
              )}

              {/* Rating & Video Jump */}
              <div className="flex flex-wrap items-center gap-3 text-sm border-y border-stone-100 py-3.5">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star className="w-4.5 h-4.5 fill-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="text-stone-600 font-semibold">{localReviews.length || product.reviewCount} verified reviews</span>
                <span className="text-stone-300">•</span>
                <button
                  onClick={() => {
                    document.getElementById('product-videos-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 text-stone-700 hover:text-amber-600 font-bold transition-colors cursor-pointer bg-stone-100 hover:bg-amber-50 px-3 py-1 rounded-lg"
                >
                  <Video className="w-4 h-4 text-amber-500" />
                  <span>Watch Videos</span>
                </button>
              </div>

              {/* Color Finish Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex justify-between text-sm font-bold text-stone-800">
                    <span>Color Finish:</span>
                    <span className="text-stone-600 font-normal">{selectedColor}</span>
                  </div>
                  <div className="flex gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`relative p-1 rounded-full transition-all cursor-pointer ${
                          selectedColor === c.name ? 'ring-2 ring-stone-900 ring-offset-2 scale-110' : 'hover:scale-105'
                        }`}
                      >
                        <span
                          className="w-8 h-8 rounded-full block border border-stone-300 shadow-inner"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description Section (Scrolls naturally) */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-3.5">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>Product Description</span>
              </h3>
              <div className="prose prose-stone text-sm sm:text-base text-stone-700 leading-relaxed space-y-3.5">
                <p>{product.description}</p>
                <p className="text-stone-600">
                  Engineered with premium materials for maximum durability and everyday performance. Backed by JABUTE direct-to-consumer quality assurance and 30-day risk-free guarantee.
                </p>
              </div>
            </div>

            {/* Specifications & Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features && (
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
                  <h3 className="text-sm font-bold text-stone-900 mb-3.5 uppercase tracking-wider text-stone-500">
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-stone-700 leading-relaxed">
                        <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specifications && (
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
                  <h3 className="text-sm font-bold text-stone-900 mb-3.5 uppercase tracking-wider text-stone-500">
                    Specifications
                  </h3>
                  <div className="divide-y divide-stone-100">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="py-2.5 flex items-center justify-between text-sm">
                        <span className="text-stone-500">{key}</span>
                        <span className="font-semibold text-stone-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">Verified Customer Reviews</h3>
                  <p className="text-sm text-stone-500">Real feedback from genuine JABUTE store buyers.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-black text-stone-900">{product.rating.toFixed(1)} out of 5</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localReviews.map((rev) => (
                  <div key={rev.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-bold text-stone-900 flex items-center gap-2">
                        <span>{rev.author}</span>
                        {rev.verified && (
                          <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-400">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <div className="pt-5 border-t border-stone-100">
                <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3.5">Write a Product Review</h4>
                <form onSubmit={handleAddReview} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-sm">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-sm"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                      <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                      <option value={3}>⭐⭐⭐ 3 Stars</option>
                      <option value={2}>⭐⭐ 2 Stars</option>
                      <option value={1}>⭐ 1 Star</option>
                    </select>
                  </div>
                  <div className="sm:col-span-5 flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your feedback and experience..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold rounded-xl cursor-pointer shrink-0"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16 mb-12">
            <h3 className="text-xl font-bold text-stone-900 mb-5">You May Also Like in {product.category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Sticky Action Dock (On mobile, keeps Photo and Price pinned on screen) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-stone-200 p-3.5 shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-sm font-bold text-stone-900 truncate">{product.name}</div>
              <div className="text-base font-black text-stone-900">${product.price.toFixed(2)}</div>
            </div>
          </div>
          <button
            onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
};
