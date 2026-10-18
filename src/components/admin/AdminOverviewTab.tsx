import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product, Order } from '../../types';
import {
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  AlertTriangle,
  ShoppingBag,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Truck,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';

interface AdminOverviewTabProps {
  onOpenProductModal: () => void;
  onOpenOrderModal: (order: Order) => void;
  onOpenRestockModal?: (product: Product) => void;
  onNavigateTab: (tab: 'products' | 'orders' | 'categories' | 'coupons' | 'customers' | 'settings') => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onOpenProductModal,
  onOpenOrderModal,
  onNavigateTab,
}) => {
  const { products, orders, categories, storeAnalytics, restockProduct, storeSettings } = useShop();
  const [chartView, setChartView] = useState<'7days' | '30days'>('7days');

  // Low stock products
  const lowStockItems = useMemo(() => {
    return products.filter((p) => p.stock < 15).sort((a, b) => a.stock - b.stock);
  }, [products]);

  // Average Order Value
  const averageOrderValue = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    if (validOrders.length === 0) return 0;
    return storeAnalytics.totalRevenue / validOrders.length;
  }, [orders, storeAnalytics.totalRevenue]);

  // Category distribution
  const categoryStats = useMemo(() => {
    const map = new Map<string, { count: number; name: string }>();
    categories.forEach((c) => map.set(c.slug, { count: 0, name: c.name }));
    products.forEach((p) => {
      const existing = map.get(p.categorySlug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(p.categorySlug, { count: 1, name: p.category });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [categories, products]);

  // Mock timeline data for revenue & profit
  const timelineData = useMemo(() => {
    const days = chartView === '7days' ? 7 : 14;
    const items = [];
    const baseRevenue = storeAnalytics.totalRevenue > 0 ? storeAnalytics.totalRevenue / days : 450;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const factor = 0.6 + (Math.sin(i * 1.5) + 1) * 0.4;
      const rev = Math.round(baseRevenue * factor * (1 + (i % 3) * 0.15));
      const profit = Math.round(rev * 0.48);
      items.push({
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        shortDay: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
        revenue: rev,
        profit: profit,
        orders: Math.max(1, Math.round(rev / 140))
      });
    }
    return items;
  }, [chartView, storeAnalytics.totalRevenue]);

  const maxRevenueInChart = Math.max(...timelineData.map((d) => d.revenue), 100);

  return (
    <div className="space-y-6">
      {/* Announcement bar status */}
      {storeSettings.isAnnouncementActive && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="font-bold">Live Store Banner:</span>
            <span className="truncate">{storeSettings.bannerAnnouncement}</span>
          </div>
          <button
            onClick={() => onNavigateTab('settings')}
            className="text-amber-800 hover:text-amber-950 font-bold hover:underline shrink-0 cursor-pointer"
          >
            Edit Banner
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider">
            <span>Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2 tracking-tight">
            ${storeAnalytics.totalRevenue.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-xs text-stone-500 mt-2 pt-2 border-t border-stone-100">
            <span>{orders.length} direct orders</span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
        </div>

        {/* Net Profit & Margin */}
        <div className="bg-emerald-950 text-white p-5 rounded-2xl shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300 uppercase tracking-wider">
            <span>Net Estimated Profit</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 tracking-tight">
            ${storeAnalytics.totalProfit.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-300/80 mt-2 pt-2 border-t border-emerald-800/80">
            <span>
              Margin:{' '}
              <strong className="text-emerald-300">
                {storeAnalytics.totalRevenue > 0
                  ? ((storeAnalytics.totalProfit / storeAnalytics.totalRevenue) * 100).toFixed(1)
                  : 0}
                %
              </strong>
            </span>
            <span className="font-semibold text-[11px] bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-200">
              Direct Sales
            </span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider">
            <span>Average Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2 tracking-tight">
            ${averageOrderValue.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-xs text-stone-500 mt-2 pt-2 border-t border-stone-100">
            <span>Wholesale Cost: ${storeAnalytics.totalCost.toFixed(2)}</span>
            <span className="text-stone-700 font-semibold">{products.length} catalog items</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`p-5 rounded-2xl border transition-all ${
          lowStockItems.length > 0
            ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
            : 'bg-white border-stone-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-800">
            <span>Inventory Restock</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2 tracking-tight">
            {lowStockItems.length} <span className="text-xs text-amber-700 font-bold">Items Low</span>
          </div>
          <div className="flex items-center justify-between text-xs text-amber-800 mt-2 pt-2 border-t border-amber-200">
            <span>Under 15 units left</span>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-stone-900 font-bold hover:underline cursor-pointer"
            >
              Restock All
            </button>
          </div>
        </div>
      </div>

      {/* Main Row: Financial Timeline Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Profit Visualizer */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-stone-900">Revenue & Profit Performance</h3>
              <p className="text-xs text-stone-500">Real-time breakdown of storefront sales & estimated margins.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 text-xs mr-2">
                <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-stone-900 inline-block" /> Revenue
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Net Profit
                </span>
              </div>
              <div className="flex bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs font-bold">
                <button
                  onClick={() => setChartView('7days')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartView === '7days' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setChartView('30days')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartView === '30days' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  14 Days
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Bar Visualization */}
          <div className="h-64 flex items-end gap-2 sm:gap-4 pt-6 pb-2 border-b border-stone-100">
            {timelineData.map((item, idx) => {
              const revHeight = Math.max(12, (item.revenue / maxRevenueInChart) * 100);
              const profitHeight = Math.max(8, (item.profit / maxRevenueInChart) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] py-1 px-2.5 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    <p className="font-bold">{item.label}</p>
                    <p className="text-stone-300">Rev: ${item.revenue} | Profit: ${item.profit}</p>
                  </div>

                  <div className="w-full max-w-[32px] flex items-end justify-center gap-1 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-full bg-stone-900 rounded-t-md transition-all group-hover:bg-stone-700"
                    />
                    {/* Profit Bar */}
                    <div
                      style={{ height: `${profitHeight}%` }}
                      className="w-full bg-emerald-500 rounded-t-md transition-all group-hover:bg-emerald-400"
                    />
                  </div>

                  <span className="text-[10px] text-stone-400 font-semibold mt-2 truncate max-w-full">
                    {item.shortDay}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary Footer */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs pt-1">
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Period Revenue</span>
              <span className="font-black text-stone-900 text-sm">
                ${timelineData.reduce((acc, d) => acc + d.revenue, 0).toLocaleString()}
              </span>
            </div>
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 block text-[10px] font-bold uppercase">Period Profit</span>
              <span className="font-black text-emerald-900 text-sm">
                ${timelineData.reduce((acc, d) => acc + d.profit, 0).toLocaleString()}
              </span>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Avg Daily Orders</span>
              <span className="font-black text-stone-900 text-sm">
                {(timelineData.reduce((acc, d) => acc + d.orders, 0) / timelineData.length).toFixed(1)} / day
              </span>
            </div>
          </div>
        </div>

        {/* Category Share & Quick Restock Widget */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Inventory Share */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-stone-900">Catalog By Category</h3>
              <button
                onClick={() => onNavigateTab('categories')}
                className="text-xs font-bold text-stone-900 hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {categoryStats.slice(0, 5).map((cat, idx) => {
                const percentage = products.length > 0 ? ((cat.count / products.length) * 100).toFixed(0) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold text-stone-800">
                      <span>{cat.name}</span>
                      <span className="text-stone-500 font-semibold">{cat.count} items ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-stone-900 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Restock Center */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Urgent Restock</span>
              </h3>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {lowStockItems.length} Low
              </span>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="text-center py-6 text-xs text-stone-400">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                <p className="font-bold text-stone-700">All inventory levels healthy</p>
                <p>No products currently below safety threshold.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
                {lowStockItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 truncate">{item.name}</p>
                      <span className="text-[10px] text-amber-700 font-bold">
                        Only {item.stock} left in stock
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => restockProduct(item.id, 10)}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        title="Add 10 units"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => restockProduct(item.id, 25)}
                        className="px-2 py-1 bg-stone-900 text-white hover:bg-stone-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        title="Add 25 units"
                      >
                        +25
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Live Table */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-stone-900">Recent Customer Orders</h3>
            <p className="text-xs text-stone-500">Live order fulfillment stream directly from JABUTE buyers.</p>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-stone-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({orders.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Order #</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 font-bold text-stone-900">
                    #{order.orderNumber}
                  </td>
                  <td className="py-3">
                    <div className="font-semibold text-stone-900">{order.customer.fullName}</div>
                    <div className="text-[10px] text-stone-400">{order.customer.email}</div>
                  </td>
                  <td className="py-3 text-stone-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-stone-700 font-medium">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="py-3 font-extrabold text-stone-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'Processing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onOpenOrderModal(order)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[11px] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      Manage & Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
