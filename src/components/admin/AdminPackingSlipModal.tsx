import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';
import { X, Printer, CheckCircle, Package } from 'lucide-react';

interface AdminPackingSlipModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export const AdminPackingSlipModal: React.FC<AdminPackingSlipModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  const { storeSettings } = useShop();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white rounded-2xl max-w-xl w-full my-8 p-8 shadow-2xl border border-stone-200 space-y-6 text-xs text-stone-900 print:border-none print:shadow-none print:m-0 print:w-full"
        >
          {/* Actions toolbar */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4 print:hidden">
            <span className="font-black text-sm uppercase tracking-wider text-stone-500">
              Official Warehouse Packing Slip
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Document</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Packing slip header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-stone-950">
                {storeSettings.storeName}
              </h1>
              <p className="text-stone-500 text-[11px] font-medium mt-0.5">
                {storeSettings.warehouseAddress}
              </p>
              <p className="text-stone-500 text-[11px]">{storeSettings.supportEmail}</p>
            </div>

            <div className="text-right">
              <div className="font-mono text-base font-black text-stone-950">
                PACKING SLIP #{order.orderNumber}
              </div>
              <p className="text-stone-500 text-[11px]">
                Date: {new Date(order.date).toLocaleDateString()}
              </p>
              <p className="text-stone-700 font-bold text-[11px]">
                Carrier: {order.carrier || 'USPS Priority'}
              </p>
              {order.trackingNumber && (
                <p className="text-stone-500 font-mono text-[10px]">
                  Tracking: {order.trackingNumber}
                </p>
              )}
            </div>
          </div>

          {/* Recipient */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <h2 className="font-black text-stone-500 uppercase text-[10px] tracking-wider mb-1">
              Ship To Customer:
            </h2>
            <p className="font-extrabold text-sm text-stone-950">{order.customer.fullName}</p>
            <p className="text-stone-700">{order.customer.address}</p>
            <p className="text-stone-700">
              {order.customer.city}, {order.customer.state} {order.customer.zipCode}
            </p>
            <p className="text-stone-500">{order.customer.country} • {order.customer.phone}</p>
          </div>

          {/* Table */}
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                  <th className="pb-2">SKU / Item</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5">
                      <div className="font-bold text-stone-900">{item.name}</div>
                      {(item.selectedColor || item.selectedSize) && (
                        <div className="text-[10px] text-stone-400">
                          {item.selectedColor && `Color: ${item.selectedColor} `}
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 font-black text-stone-900">{item.quantity}</td>
                    <td className="py-2.5 text-right font-medium text-stone-600">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-black text-stone-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-stone-200 pt-3 space-y-1 text-right text-xs">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-500">
              <span>Shipping ({order.deliveryOption}):</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Estimated Sales Tax:</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-stone-950 pt-2 border-t border-stone-200">
              <span>Total Paid:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-4 border-t border-dashed border-stone-200 text-stone-400 text-[11px]">
            <p className="font-bold text-stone-700">Thank you for ordering directly from JABUTE!</p>
            <p className="mt-0.5">Direct Retail Guarantee • All items inspected prior to dispatch.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
