import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag } from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { lastPlacedOrder, setActiveView } = useShop();

  if (!lastPlacedOrder) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-stone-900">No recent order found</h2>
        <button
          onClick={() => setActiveView('home')}
          className="mt-4 px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-stone-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-center space-y-6">
          
          {/* Check Circle */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Payment & Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Thank you, {lastPlacedOrder.customer.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              We've received your order and dispatched confirmation to{' '}
              <strong className="text-stone-800">{lastPlacedOrder.customer.email}</strong>.
            </p>
          </div>

          {/* Tracking & Info Pill Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs">
            <div>
              <span className="text-stone-400 text-[11px] block">Order Number</span>
              <strong className="text-stone-900 text-sm font-mono">{lastPlacedOrder.orderNumber}</strong>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] block">Tracking Code</span>
              <strong className="text-stone-900 text-sm font-mono">{lastPlacedOrder.trackingNumber}</strong>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] block">Est. Delivery</span>
              <strong className="text-emerald-700 text-sm">{lastPlacedOrder.estimatedDelivery}</strong>
            </div>
          </div>

          {/* Ordered Items Breakdown */}
          <div className="text-left border-t border-stone-100 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Items In This Shipment
            </h3>
            <div className="divide-y divide-stone-100">
              {lastPlacedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-stone-500">
                      Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor}`}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-stone-200 pt-3 flex justify-between text-sm font-extrabold text-stone-900">
              <span>Total Paid</span>
              <span>${lastPlacedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
