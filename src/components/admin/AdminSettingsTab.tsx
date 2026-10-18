import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { StoreSettings } from '../../types';
import {
  Settings,
  Store,
  DollarSign,
  Truck,
  Mail,
  Phone,
  MapPin,
  Megaphone,
  Download,
  RotateCcw,
  Save,
  CheckCircle,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';

interface AdminSettingsTabProps {
  onRequestResetStore: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  onRequestResetStore,
}) => {
  const { storeSettings, updateStoreSettings, products, orders, categories, addToast } = useShop();

  const [formData, setFormData] = useState<StoreSettings>(storeSettings);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
  };

  // Export JSON Catalog
  const handleExportJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      storeSettings: formData,
      products,
      categories,
      orders,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jabute-store-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Backup Downloaded', 'Exported complete store catalog and orders JSON file', 'success');
  };

  // Export CSV Products
  const handleExportProductsCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'CostPrice', 'Stock', 'Rating', 'CreatedAt'];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      `"${p.category}"`,
      p.price,
      p.costPrice || (p.price * 0.45).toFixed(2),
      p.stock,
      p.rating,
      p.createdAt
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jabute-products-inventory-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Inventory CSV Downloaded', 'Exported products catalog to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-500" />
              <span>Store Configuration & Policies</span>
            </h2>
            <p className="text-xs text-stone-500">
              Control your brand details, sales tax calculation, free shipping limits, and support info.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save Store Settings</span>
          </button>
        </div>

        {/* Store Brand & Financials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-stone-700 font-bold mb-1">Store Brand Name *</label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none font-black text-stone-900"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Currency Code</label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Standard Sales Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="30"
              value={formData.taxRate}
              onChange={(e) => handleChange('taxRate', Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-stone-700 font-bold mb-1">Brand Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Free Shipping Threshold ($)</label>
            <input
              type="number"
              min="0"
              value={formData.freeShippingThreshold}
              onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none font-bold"
            />
          </div>
        </div>

        {/* Contact & Logistics */}
        <div className="border-t border-stone-200 pt-5 space-y-4 text-xs">
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-stone-700" />
            <span>Fulfillment Logistics & Direct Support</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-stone-700 font-bold mb-1">Warehouse Address (Origin on Shipping Labels)</label>
              <input
                type="text"
                value={formData.warehouseAddress}
                onChange={(e) => handleChange('warehouseAddress', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="border-t border-stone-200 pt-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-stone-700" />
              <span>Top Announcement Bar</span>
            </h3>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAnnouncementActive}
                onChange={(e) => handleChange('isAnnouncementActive', e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-0"
              />
              <span className="font-bold text-stone-800">Show on Storefront</span>
            </label>
          </div>

          <div>
            <input
              type="text"
              value={formData.bannerAnnouncement}
              onChange={(e) => handleChange('bannerAnnouncement', e.target.value)}
              placeholder="e.g., ⚡ JABUTE Direct Launch: 15% OFF with code WELCOME15..."
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
          </div>
        </div>
      </form>

      {/* Data Backup & Factory Reset Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-stone-900">Export Store Data</h3>
              <p className="text-xs text-stone-500">Download complete catalog and order databases to your device.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2 text-xs">
            <button
              onClick={handleExportJSON}
              className="flex-1 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <FileJson className="w-4 h-4 text-amber-400" />
              <span>Full Store JSON Backup</span>
            </button>
            <button
              onClick={handleExportProductsCSV}
              className="flex-1 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Products Catalog CSV</span>
            </button>
          </div>
        </div>

        {/* Factory Reset Card */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-stone-900">Factory Store Reset</h3>
              <p className="text-xs text-stone-500">Restore default demo products, categories, coupons, and orders.</p>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Use this if you would like to reset your test data back to the clean retail demo template.
          </p>

          <button
            onClick={onRequestResetStore}
            className="w-full px-4 py-2.5 bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-300 text-rose-700 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Store to Factory Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
