import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, Search, ShoppingBag, User, Cloud } from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const { user, openAuthModal, orders, setActiveView, viewProductDetail } = useShop();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="py-8 bg-stone-50 min-h-screen w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setActiveView('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3.5 py-1.5 rounded-xl border border-stone-200 shadow-2xs mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">Order Tracking & History</h1>
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <Cloud className="w-3 h-3" />
                Firestore Persistent
              </span>
            </div>
            <p className="text-xs text-stone-500">Track and view your direct orders from JABUTE.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order # or product..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium"
            />
          </div>
        </div>

        {/* User Account Bar */}
        {!user && (
          <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Sign in with Google for Cross-Device Sync</p>
                <p className="text-[11px] text-stone-500">Link your orders and wishlist to your Google account securely backed by Firebase.</p>
              </div>
            </div>
            <button
              onClick={openAuthModal}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
            >
              Sign In with Google
            </button>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
            <Package className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-900">No orders found</h3>
            <p className="text-xs text-stone-500">You haven't placed any orders matching this search.</p>
            <button
              onClick={() => setActiveView('home')}
              className="mt-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900 text-sm font-mono">
                        #{order.orderNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Placed on {new Date(order.date).toLocaleDateString()} • {order.customer.fullName}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-base font-black text-stone-900">${order.total.toFixed(2)}</div>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Payment: {order.paymentMethod.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Tracking Code if Shipped */}
                {order.trackingNumber && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-500" />
                      <span className="text-stone-600 font-medium">
                        Carrier: <strong className="text-stone-900">{order.carrier || 'USPS Priority'}</strong> • Tracking: <span className="font-mono font-bold text-stone-900">{order.trackingNumber}</span>
                      </span>
                    </div>
                    <span className="text-emerald-700 font-bold text-[11px]">
                      Est. Arrival: {order.estimatedDelivery}
                    </span>
                  </div>
                )}

                {/* Items in order */}
                <div className="divide-y divide-stone-100">
                  {order.items.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-11 h-11 object-cover rounded-lg bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{item.name}</p>
                          <p className="text-[11px] text-stone-500">Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}</p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
