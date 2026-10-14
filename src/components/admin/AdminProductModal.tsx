import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Package,
  DollarSign,
  TrendingUp,
  Image as ImageIcon,
  Tag,
  Check,
  Video,
  Play,
  Film,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

interface AdminProductModalProps {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
}) => {
  const { categories, addProduct, editProduct, addToast } = useShop();

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [price, setPrice] = useState<number>(99);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [costPrice, setCostPrice] = useState<number>(45);
  const [stock, setStock] = useState<number>(25);
  const [sku, setSku] = useState('');
  const [badge, setBadge] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [tags, setTags] = useState<string>('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSubtitle(productToEdit.subtitle || '');
      setCategory(productToEdit.category);
      setCategorySlug(productToEdit.categorySlug);
      setPrice(productToEdit.price);
      setOriginalPrice(productToEdit.originalPrice);
      setCostPrice(productToEdit.costPrice || Number((productToEdit.price * 0.45).toFixed(2)));
      setStock(productToEdit.stock);
      setSku(productToEdit.sku);
      setBadge(productToEdit.badge || '');
      setIsFeatured(Boolean(productToEdit.isFeatured));
      setDescription(productToEdit.description);
      setImages(productToEdit.images.length > 0 ? productToEdit.images : ['']);
      setVideoUrl(productToEdit.videos?.[0]?.videoUrl || '');
      setVideoTitle(productToEdit.videos?.[0]?.title || '');
      setFeatures(productToEdit.features && productToEdit.features.length > 0 ? productToEdit.features : ['']);
      setTags(productToEdit.tags ? productToEdit.tags.join(', ') : '');
    } else {
      setName('');
      setSubtitle('');
      const defaultCat = categories[0] || { name: 'Audio', slug: 'audio' };
      setCategory(defaultCat.name);
      setCategorySlug(defaultCat.slug);
      setPrice(99);
      setOriginalPrice(undefined);
      setCostPrice(45);
      setStock(30);
      setSku(`JAB-${Math.floor(100 + Math.random() * 900)}`);
      setBadge('');
      setIsFeatured(false);
      setDescription('');
      setImages(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80']);
      setVideoUrl('');
      setVideoTitle('');
      setFeatures(['Precision engineered single-seller craftsmanship', 'Direct factory fulfillment with 2-year warranty']);
      setTags('retail, flagship, curated');
    }
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (slug: string) => {
    const matched = categories.find((c) => c.slug === slug);
    if (matched) {
      setCategory(matched.name);
      setCategorySlug(matched.slug);
    }
  };

  const handleAddImageField = () => {
    setImages((prev) => [...prev, '']);
  };

  const handleUpdateImage = (index: number, val: string) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, '']);
  };

  const handleUpdateFeature = (index: number, val: string) => {
    setFeatures((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length === 1) return;
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const profitPerUnit = Math.max(0, price - costPrice);
  const marginPercentage = price > 0 ? ((profitPerUnit / price) * 100).toFixed(0) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Validation Error', 'Product name is required', 'error');
      return;
    }

    const cleanImages = images.filter((img) => img.trim().length > 0);
    if (cleanImages.length === 0) {
      cleanImages.push('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80');
    }

    const cleanFeatures = features.filter((f) => f.trim().length > 0);
    const cleanTags = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const productPayload = {
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      category,
      categorySlug,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      costPrice: Number(costPrice),
      stock: Number(stock),
      sku: sku.trim() || `JAB-${Date.now().toString().slice(-4)}`,
      badge: badge.trim() || undefined,
      isFeatured,
      description: description.trim() || 'Premium retail product direct from JABUTE.',
      images: cleanImages,
      features: cleanFeatures,
      tags: cleanTags,
      videos: videoUrl.trim()
        ? [
            {
              id: productToEdit?.videos?.[0]?.id || `vid-${Date.now()}`,
              title: videoTitle.trim() || `${name.trim()} — Official Video Walkthrough`,
              duration: productToEdit?.videos?.[0]?.duration || '1:15',
              thumbnailUrl: cleanImages[0],
              videoUrl: videoUrl.trim(),
              type: (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) ? 'youtube' : 'mp4',
              badge: 'Official Video',
              viewsCount: productToEdit?.videos?.[0]?.viewsCount || 1240
            },
            ...(productToEdit?.videos || []).filter((v) => v.videoUrl !== videoUrl.trim())
          ]
        : productToEdit?.videos,
      colors: [
        { name: 'Matte Onyx', hex: '#1c1917', inStock: true },
        { name: 'Sterling Silver', hex: '#e7e5e4', inStock: true },
      ],
      specs: {
        'Origin': 'JABUTE Certified Direct Logistics',
        'Fulfillment': 'Ships same business day',
        'Warranty': '2 Years Comprehensive Store Guarantee'
      }
    };

    if (productToEdit) {
      editProduct(productToEdit.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white rounded-2xl max-w-2xl w-full my-8 p-6 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-stone-900">
                {productToEdit ? `Edit Product: ${productToEdit.name}` : 'Add Product to JABUTE Catalog'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Set customer pricing, wholesale cost, stock units, and storefront images.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-bold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., JABUTE Master Studio Headphones"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Subtitle / Short Hook</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g., Active Noise Cancelling & Direct DAC"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Category *</label>
                <select
                  value={categorySlug}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none font-bold text-stone-800"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">SKU Code *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder="JAB-801"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Store Badge</label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none"
                >
                  <option value="">No Badge</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="New Release">New Release</option>
                  <option value="Limited Batch">Limited Batch</option>
                  <option value="Staff Pick">Staff Pick</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>
            </div>

            {/* Financials & Stock Box */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-stone-900">Pricing, Wholesale & Margin</span>
                <span className="text-emerald-700 font-extrabold text-[11px] bg-emerald-100 px-2 py-0.5 rounded-full">
                  Profit: ${profitPerUnit.toFixed(2)} ({marginPercentage}%)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Retail Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={originalPrice ?? ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Compare at..."
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Wholesale Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Stock Units *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-700">Product Images (URLs)</label>
                <button
                  type="button"
                  onClick={handleAddImageField}
                  className="text-stone-900 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Image URL
                </button>
              </div>

              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleUpdateImage(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  />
                  {img && (
                    <img
                      src={img}
                      alt="preview"
                      className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                  )}
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Product Video Walkthrough & Live Working Player */}
            <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-5 border border-stone-800 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span>Product Video Walkthrough</span>
                      {videoUrl.trim() && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Video Attached</span>
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Renders below verified customer reviews in a 4K demonstration player
                    </p>
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">
                  Video Demonstration Title
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. Official 4K Overview & Unboxing Walkthrough"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* URL Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-300">
                    Video Stream URL (MP4, WebM, or YouTube Link)
                  </label>
                  {videoUrl.trim() && (
                    <button
                      type="button"
                      onClick={() => setVideoUrl('')}
                      className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Clear Link
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://...mp4 or https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-mono text-amber-300 placeholder-stone-600 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Quick Sample Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Quick Video Presets (Click to Test)
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: '🎬 4K Studio Tour (MP4)',
                      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                      title: 'Official 4K Cinematic Overview & 360° Walkthrough'
                    },
                    {
                      label: '📦 Unboxing & Hands-on (MP4)',
                      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                      title: 'Unboxing Experience & Setup Guide'
                    },
                    {
                      label: '🔬 Stress Test & Materials (MP4)',
                      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                      title: 'Real-World Performance & Durability Test'
                    },
                    {
                      label: '📺 YouTube Demo Link',
                      url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                      title: 'YouTube Stream Walkthrough'
                    }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setVideoUrl(preset.url);
                        if (!videoTitle.trim()) setVideoTitle(preset.title);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700/80 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Working Video Player Preview */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Live Video Player Verification</span>
                  {videoUrl.trim() ? (
                    <span className="text-emerald-400 font-mono text-[10px]">● Player Operational</span>
                  ) : (
                    <span className="text-stone-500 font-mono text-[10px]">No Video Loaded</span>
                  )}
                </div>

                {videoUrl.trim() ? (
                  <div className="rounded-xl overflow-hidden bg-black border border-stone-800 relative group aspect-video flex items-center justify-center">
                    {(() => {
                      const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
                      if (ytMatch) {
                        return (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${ytMatch[1]}`}
                            title="Admin Video Preview"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        );
                      }
                      return (
                        <video
                          src={videoUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-contain"
                        />
                      );
                    })()}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-800 bg-stone-950/60 p-6 text-center text-stone-500">
                    <Film className="w-8 h-8 mx-auto mb-2 text-stone-700" />
                    <p className="text-xs">No video URL entered yet.</p>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      Paste a direct MP4 or YouTube link or select a preset above to test the player.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-stone-700 font-bold mb-1">Story & Detailed Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe material craftsmanship, technical specs, and utility..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Features list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-700">Key Feature Bullet Points</label>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-stone-900 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Bullet
                </button>
              </div>

              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                    placeholder="e.g., Ultra-light aerospace grade titanium enclosure"
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Tags & Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="audio, premium, wireless, titanium"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-900">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-stone-300 text-stone-900 focus:ring-0"
                  />
                  <span>Feature on Storefront Homepage</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-amber-400" />
                <span>{productToEdit ? 'Save Changes' : 'Publish Product'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
