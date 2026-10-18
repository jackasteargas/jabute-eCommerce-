import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Category } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  Package,
  X,
  Check
} from 'lucide-react';

interface AdminCategoriesTabProps {
  onRequestDeleteCategory: (category: Category) => void;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  onRequestDeleteCategory,
}) => {
  const { categories, products, addCategory, editCategory, addToast } = useShop();

  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setIsAdding(false);
    setEditingCategory(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setIsAdding(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Validation Error', 'Category name is required', 'error');
      return;
    }

    const generatedSlug = slug.trim()
      ? slug.trim().toLowerCase().replace(/\s+/g, '-')
      : name.trim().toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      editCategory(editingCategory.id, {
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim(),
        image: image.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      });
    } else {
      addCategory({
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim(),
        image: image.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        productCount: 0,
      });
    }

    resetForm();
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-stone-900">
            Store Categories & Collections
          </h2>
          <p className="text-xs text-stone-500">
            Structure your storefront taxonomy to help buyers browse your catalog efficiently.
          </p>
        </div>

        {!isAdding && !editingCategory && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create New Category</span>
          </button>
        )}
      </div>

      {/* Inline Create / Edit Category Card */}
      {(isAdding || editingCategory) && (
        <form
          onSubmit={handleSave}
          className="bg-stone-50 border border-stone-300 rounded-2xl p-5 space-y-4 text-xs animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="text-sm font-black text-stone-900">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Collection'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCategory) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="e.g., Luxury Audio & Sound"
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Slug Identifier</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., luxury-audio"
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-700 font-bold mb-1">Cover Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-700 font-bold mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of items in this category for storefront SEO & badges..."
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
              <span>{editingCategory ? 'Update Category' : 'Publish Category'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Category Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const matchingProducts = products.filter(
            (p) => p.categorySlug === cat.slug || p.category === cat.name
          );

          return (
            <div
              key={cat.id}
              className="bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-2xl p-4 transition-all space-y-3 relative group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
                  alt={cat.name}
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-stone-900 text-sm truncate">{cat.name}</h3>
                  <p className="text-[11px] font-mono text-stone-400 truncate">slug: {cat.slug}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full mt-1">
                    <Package className="w-3 h-3" />
                    {matchingProducts.length} Products
                  </span>
                </div>
              </div>

              {cat.description && (
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              )}

              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-stone-200">
                <button
                  onClick={() => handleStartEdit(cat)}
                  className="px-3 py-1.5 bg-white hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onRequestDeleteCategory(cat)}
                  className="p-1.5 hover:bg-rose-100 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Delete Category"
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
