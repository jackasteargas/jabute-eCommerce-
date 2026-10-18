import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product, Order, Category, PromoCode } from '../../types';
import {
  Store,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Tag,
  Users,
  Settings,
  ArrowLeft,
  Eye,
  Plus,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { AdminCouponsTab } from './AdminCouponsTab';
import { AdminCustomersTab } from './AdminCustomersTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminProductModal } from './AdminProductModal';
import { AdminOrderModal } from './AdminOrderModal';
import { AdminPackingSlipModal } from './AdminPackingSlipModal';

type AdminTab = 'overview' | 'products' | 'orders' | 'categories' | 'coupons' | 'customers' | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    isAdmin,
    user,
    products,
    categories,
    orders,
    promos,
    deleteProduct,
    deleteCategory,
    deletePromoCode,
    deleteOrder,
    resetStoreToDefaults,
    setActiveView,
    storeSettings
  } = useShop();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [packingSlipOrder, setPackingSlipOrder] = useState<Order | null>(null);
  const [isPackingSlipOpen, setIsPackingSlipOpen] = useState(false);

  // Strict Store Owner Access Guard: Only jackasteargas@gmail.com can view
  if (!isAdmin || !user || user.email?.toLowerCase().trim() !== 'jackasteargas@gmail.com') {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-stone-50">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">Restricted Store Owner Area</h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md leading-relaxed">
          The Admin Dashboard is strictly reserved for the verified store owner (jackasteargas@gmail.com). You are currently viewing as a store customer.
        </p>
        <button
          onClick={() => setActiveView('home')}
          className="mt-6 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>
      </div>
    );
  }

  // Deletion & Action Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemName?: string;
    confirmLabel?: string;
    confirmVariant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    confirmLabel: 'Delete Item',
    confirmVariant: 'danger',
    onConfirm: () => {},
  });

  // Product modal triggers
  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  // Order modal triggers
  const handleOpenOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleOpenPackingSlip = (order: Order) => {
    setPackingSlipOrder(order);
    setIsPackingSlipOpen(true);
  };

  // Delete Request Handlers (In-App Confirmations)
  const handleRequestDeleteProduct = (product: Product) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product from Catalog?',
      message: 'This will permanently remove this item from your storefront catalog and inventory records.',
      itemName: `${product.name} (SKU: ${product.sku})`,
      confirmLabel: 'Delete Product',
      confirmVariant: 'danger',
      onConfirm: () => {
        deleteProduct(product.id);
      },
    });
  };

  const handleRequestDeleteCategory = (category: Category) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category Collection?',
      message: 'Removing this category will unbind associated storefront filters. Products under this category will remain safe in your catalog.',
      itemName: `${category.name} (${category.slug})`,
      confirmLabel: 'Delete Category',
      confirmVariant: 'danger',
      onConfirm: () => {
        deleteCategory(category.id);
      },
    });
  };

  const handleRequestDeleteCoupon = (coupon: PromoCode) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Promotional Voucher?',
      message: 'Customers will no longer be able to apply this discount code during checkout.',
      itemName: `Coupon Code: ${coupon.code} (${coupon.discountPercentage}% OFF)`,
      confirmLabel: 'Delete Coupon',
      confirmVariant: 'danger',
      onConfirm: () => {
        deletePromoCode(coupon.code);
      },
    });
  };

  const handleRequestDeleteOrder = (order: Order) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Order Record?',
      message: 'This will permanently remove this customer order from dispatch fulfillment lists and store records.',
      itemName: `Order #${order.orderNumber} - ${order.customer.fullName} ($${order.total.toFixed(2)})`,
      confirmLabel: 'Delete Order Record',
      confirmVariant: 'danger',
      onConfirm: () => {
        deleteOrder(order.id);
      },
    });
  };

  const handleRequestResetStore = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Store to Factory Defaults?',
      message: 'This will restore all default demo products, categories, sample customer orders, and promo codes. Any custom added products will be reset.',
      confirmLabel: 'Reset Entire Store',
      confirmVariant: 'warning',
      onConfirm: () => {
        resetStoreToDefaults();
      },
    });
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20">
      {/* Top Admin Header Bar */}
      <div className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-base">{storeSettings.storeName} OWNER OS</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Direct Retail
                </span>
              </div>
              <p className="text-xs text-stone-400">Single-Seller Store Management & Fulfillment Center</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>View Live Storefront</span>
            </button>

            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-black transition-all shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products & Inventory ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Dispatch ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'coupons'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Coupons ({promos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer CRM</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 pt-6">
        {activeTab === 'overview' && (
          <AdminOverviewTab
            onOpenProductModal={handleOpenAddProduct}
            onOpenOrderModal={handleOpenOrderModal}
            onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
          />
        )}

        {activeTab === 'products' && (
          <AdminProductsTab
            onOpenAddModal={handleOpenAddProduct}
            onOpenEditModal={handleOpenEditProduct}
            onRequestDeleteProduct={handleRequestDeleteProduct}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersTab
            onOpenOrderModal={handleOpenOrderModal}
            onOpenPackingSlip={handleOpenPackingSlip}
            onRequestDeleteOrder={handleRequestDeleteOrder}
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategoriesTab
            onRequestDeleteCategory={handleRequestDeleteCategory}
          />
        )}

        {activeTab === 'coupons' && (
          <AdminCouponsTab
            onRequestDeleteCoupon={handleRequestDeleteCoupon}
          />
        )}

        {activeTab === 'customers' && (
          <AdminCustomersTab />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsTab
            onRequestResetStore={handleRequestResetStore}
          />
        )}
      </main>

      {/* Product Create & Edit Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        productToEdit={productToEdit}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
      />

      {/* Order Dispatch & Fulfillment Modal */}
      <AdminOrderModal
        isOpen={isOrderModalOpen}
        order={selectedOrder}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        onOpenPackingSlip={handleOpenPackingSlip}
      />

      {/* Printable Packing Slip / Receipt Modal */}
      <AdminPackingSlipModal
        isOpen={isPackingSlipOpen}
        order={packingSlipOrder}
        onClose={() => {
          setIsPackingSlipOpen(false);
          setPackingSlipOrder(null);
        }}
      />

      {/* In-App Confirmation Modal (for reliable, non-blocking deletions) */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        itemName={confirmModal.itemName}
        confirmLabel={confirmModal.confirmLabel}
        confirmVariant={confirmModal.confirmVariant}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
