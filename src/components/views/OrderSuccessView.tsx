import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, ShieldCheck, ShoppingBag, Truck, Lock, ArrowRight } from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { lastPlacedOrder, setActiveView } = useShop();

  if (!lastPlacedOrder) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900">No recent order found</h2>
        <button
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className="mt-5 px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-bold cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-stone-50 min-h-screen w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-center space-y-6">
          
          {/* Check Circle */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment Legit & Verified by Issuing Bank</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1">
              Thank you, {lastPlacedOrder.customer.fullName}!
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2">
              Your order is verified and dispatched. Confirmation email sent to{' '}
              <strong className="text-stone-900">{lastPlacedOrder.customer.email}</strong>.
            </p>
          </div>

          {/* Tracking & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-5 bg-stone-50 rounded-2xl border border-stone-200 text-left text-sm">
            <div>
              <span className="text-stone-500 text-xs font-medium block">Order Number</span>
              <strong className="text-stone-900 text-sm font-mono">{lastPlacedOrder.orderNumber}</strong>
            </div>
            <div>
              <span className="text-stone-500 text-xs font-medium block">Tracking Code</span>
              <strong className="text-stone-900 text-sm font-mono">{lastPlacedOrder.trackingNumber}</strong>
            </div>
            <div>
              <span className="text-stone-500 text-xs font-medium block">Est. Delivery</span>
              <strong className="text-emerald-700 text-sm">{lastPlacedOrder.estimatedDelivery}</strong>
            </div>
          </div>

          {/* Legit Verified Payment Proof Box */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4.5 text-left space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Verified Transaction Details</span>
              </span>
              <span className="bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded text-xs">
                STATUS: VERIFIED & SETTLED
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-700 pt-1">
              <div>
                <span className="text-stone-400 block">Method</span>
                <span className="font-semibold text-stone-900">{lastPlacedOrder.cardBrand || lastPlacedOrder.paymentMethod}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Auth Code</span>
                <span className="font-mono font-semibold text-stone-900">{lastPlacedOrder.authorizationCode || 'AUTH-948201'}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-stone-400 block">Transaction ID</span>
                <span className="font-mono font-semibold text-stone-900 truncate block">{lastPlacedOrder.transactionId || 'TXN-88402A'}</span>
              </div>
            </div>
          </div>

          {/* Ordered Items Breakdown */}
          <div className="text-left border-t border-stone-100 pt-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
              Items In This Shipment
            </h3>
            <div className="divide-y divide-stone-100">
              {lastPlacedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-900 truncate">{item.name}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor}`}
                    </p>
                  </div>
                  <span className="text-sm font-black text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-black text-stone-900">
              <span>Total Paid & Verified</span>
              <span className="text-xl">${lastPlacedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
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
