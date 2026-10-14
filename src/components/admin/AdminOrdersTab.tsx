import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';
import {
  Search,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Trash2,
  Eye,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';

interface AdminOrdersTabProps {
  onOpenOrderModal: (order: Order) => void;
  onOpenPackingSlip: (order: Order) => void;
  onRequestDeleteOrder: (order: Order) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  onOpenOrderModal,
  onOpenPackingSlip,
  onRequestDeleteOrder,
}) => {
  const { orders, updateOrderStatus } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('all');

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q) ||
          o.customer.city.toLowerCase().includes(q) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter);
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, searchTerm, statusFilter]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      processing: orders.filter((o) => o.status === 'Processing').length,
      shipped: orders.filter((o) => o.status === 'Shipped').length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    };
  }, [orders]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-stone-900">
            Store Orders & Dispatch Fulfillment
          </h2>
          <p className="text-xs text-stone-500">
            Manage customer deliveries, carrier tracking numbers, and order packing slips.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Orders ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter('Processing')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'Processing'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Processing ({counts.processing})
          </button>
          <button
            onClick={() => setStatusFilter('Shipped')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'Shipped'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-stone-100 text-blue-800 hover:bg-blue-100'
            }`}
          >
            Shipped ({counts.shipped})
          </button>
          <button
            onClick={() => setStatusFilter('Delivered')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'Delivered'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-stone-100 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Delivered ({counts.delivered})
          </button>
          <button
            onClick={() => setStatusFilter('Cancelled')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'Cancelled'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-stone-100 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Cancelled ({counts.cancelled})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order #, customer, city..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>
      </div>

      {/* Orders List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
              <th className="pb-3">Order Number</th>
              <th className="pb-3">Customer & Destination</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Items Summary</th>
              <th className="pb-3">Payment</th>
              <th className="pb-3">Order Total</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-stone-400">
                  <p className="font-bold text-stone-700 text-sm">No orders matching criteria</p>
                  <p className="mt-1">Try resetting the search query or status filter.</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5">
                    <div className="font-black text-stone-900">#{order.orderNumber}</div>
                    {order.trackingNumber && (
                      <span className="text-[10px] text-stone-400 font-mono block">
                        {order.trackingNumber}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5">
                    <div className="font-bold text-stone-900">{order.customer.fullName}</div>
                    <div className="text-[11px] text-stone-500">{order.customer.city}, {order.customer.state}</div>
                  </td>

                  <td className="py-3.5 text-stone-500">
                    {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="py-3.5">
                    <span className="font-bold text-stone-800">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                    </span>
                    <span className="text-[10px] text-stone-400 block truncate max-w-[150px]">
                      {order.items[0]?.name}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="font-semibold text-stone-600 capitalize">
                      {order.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 font-black text-stone-900 text-sm">
                    ${order.total.toFixed(2)}
                  </td>

                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
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

                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenPackingSlip(order)}
                        className="p-1.5 hover:bg-stone-100 text-stone-500 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
                        title="Print Packing Slip / Receipt"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenOrderModal(order)}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                      >
                        Fulfill
                      </button>
                      <button
                        onClick={() => onRequestDeleteOrder(order)}
                        className="p-1.5 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Order Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
