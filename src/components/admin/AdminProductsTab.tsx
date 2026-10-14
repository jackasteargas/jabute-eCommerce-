import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  SlidersHorizontal,
  Layers,
  ChevronDown,
  Video
} from 'lucide-react';

interface AdminProductsTabProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (product: Product) => void;
  onRequestDeleteProduct: (product: Product) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  onRequestDeleteProduct,
}) => {
  const {
    products,
    categories,
    restockProduct,
    duplicateProduct,
    viewProductDetail,
    addToast
  } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc' | 'margin'>('stock_asc');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Filtered & Sorted Product list
  const processedProducts = useMemo(() => {
    let list = [...products];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categorySlug === selectedCategory || p.category === selectedCategory);
    }

    // Stock filter
    if (stockFilter === 'in_stock') {
      list = list.filter((p) => p.stock >= 15);
    } else if (stockFilter === 'low_stock') {
      list = list.filter((p) => p.stock > 0 && p.stock < 15);
    } else if (stockFilter === 'out_of_stock') {
      list = list.filter((p) => p.stock === 0);
    }

    // Sorting
    switch (sortBy) {
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'stock_asc':
        list.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock_desc':
        list.sort((a, b) => b.stock - a.stock);
        break;
      case 'margin':
        list.sort((a, b) => {
          const marginA = ((a.price - (a.costPrice || a.price * 0.45)) / a.price);
          const marginB = ((b.price - (b.costPrice || b.price * 0.45)) / b.price);
          return marginB - marginA;
        });
        break;
      default:
        break;
    }

    return list;
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy]);

  // Bulk Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(processedProducts.map((p) => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkRestock = (units: number) => {
    selectedProductIds.forEach((id) => restockProduct(id, units));
    addToast('Bulk Restock Complete', `Added +${units} units to ${selectedProductIds.length} products`, 'success');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-5">
      {/* Top Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-stone-900">
            Product Catalog & Stock Management
          </h2>
          <p className="text-xs text-stone-500">
            Total of {products.length} store inventory items. Manage pricing, wholesale costs, and restocks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, SKU, tag..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        {/* Category */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Stock status filter */}
        <div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (15+ units)</option>
            <option value="low_stock">Low Stock (1-14 units)</option>
            <option value="out_of_stock">Out of Stock (0 units)</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
          >
            <option value="stock_asc">Sort: Lowest Stock First</option>
            <option value="stock_desc">Sort: Highest Stock First</option>
            <option value="price_desc">Sort: Highest Price</option>
            <option value="price_asc">Sort: Lowest Price</option>
            <option value="margin">Sort: Best Profit Margin</option>
            <option value="name">Sort: Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar (when items selected) */}
      {selectedProductIds.length > 0 && (
        <div className="bg-stone-900 text-white px-4 py-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-bold">{selectedProductIds.length} products selected</span>
            <button
              onClick={() => setSelectedProductIds([])}
              className="text-stone-400 hover:text-white underline text-[11px] ml-2 cursor-pointer"
            >
              Clear selection
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkRestock(10)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold rounded-lg transition-colors cursor-pointer"
            >
              +10 Stock to Selected
            </button>
            <button
              onClick={() => handleBulkRestock(50)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold rounded-lg transition-colors cursor-pointer"
            >
              +50 Stock to Selected
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
              <th className="pb-3 w-8">
                <input
                  type="checkbox"
                  checked={selectedProductIds.length > 0 && selectedProductIds.length === processedProducts.length}
                  onChange={handleSelectAll}
                  className="rounded border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="pb-3">Product</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Retail Price</th>
              <th className="pb-3">Wholesale Cost</th>
              <th className="pb-3">Profit / Unit</th>
              <th className="pb-3">Stock Units (Quick Adjust)</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {processedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-stone-400">
                  <p className="font-bold text-stone-700 text-sm">No products found</p>
                  <p className="mt-1">Try adjusting your search query or filter settings.</p>
                </td>
              </tr>
            ) : (
              processedProducts.map((product) => {
                const cost = product.costPrice || product.price * 0.45;
                const profitPerUnit = product.price - cost;
                const margin = ((profitPerUnit / product.price) * 100).toFixed(0);
                const isSelected = selectedProductIds.includes(product.id);

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      isSelected ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(product.id)}
                        className="rounded border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-11 h-11 object-cover rounded-xl bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-black text-stone-900 line-clamp-1">{product.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-stone-400 font-mono font-medium">
                              SKU: {product.sku}
                            </span>
                            {product.badge && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                                {product.badge}
                              </span>
                            )}
                            {product.videos && product.videos.length > 0 && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                <Video className="w-2.5 h-2.5" />
                                <span>Video</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 font-semibold text-stone-700">
                      {product.category}
                    </td>

                    <td className="py-3 font-extrabold text-stone-900">
                      ${product.price.toFixed(2)}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] text-stone-400 line-through block font-normal">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-stone-500 font-medium">
                      ${cost.toFixed(2)}
                    </td>

                    <td className="py-3">
                      <span className="font-bold text-emerald-700">
                        +${profitPerUnit.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-600 block">({margin}% margin)</span>
                    </td>

                    {/* Stock Stepper */}
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-extrabold text-[11px] ${
                          product.stock <= 0
                            ? 'bg-rose-100 text-rose-800'
                            : product.stock < 15
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}>
                          {product.stock} units
                        </span>

                        {/* Inline Stepper +/- */}
                        <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                          <button
                            onClick={() => restockProduct(product.id, -1)}
                            disabled={product.stock <= 0}
                            className="w-5 h-5 flex items-center justify-center font-bold text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                            title="Decrease 1 unit"
                          >
                            -
                          </button>
                          <button
                            onClick={() => restockProduct(product.id, 5)}
                            className="w-5 h-5 flex items-center justify-center font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                            title="Add 5 units"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => viewProductDetail(product.id)}
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer"
                          title="View on Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateProduct(product.id)}
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer"
                          title="Duplicate Product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenEditModal(product)}
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRequestDeleteProduct(product)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-stone-400 hover:text-rose-600 cursor-pointer transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
