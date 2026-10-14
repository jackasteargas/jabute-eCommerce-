import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';
import {
  X,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Package,
  Calendar,
  ExternalLink,
  Save,
  FileText,
  AlertCircle
} from 'lucide-react';

interface AdminOrderModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onOpenPackingSlip?: (order: Order) => void;
}

export const AdminOrderModal: React.FC<AdminOrderModalProps> = ({
  isOpen,
  order,
  onClose,
  onOpenPackingSlip,
}) => {
  const { updateOrderStatus, addToast } = useShop();

  const [status, setStatus] = useState<Order['status']>('Processing');
  const [carrier, setCarrier] = useState('USPS Priority');
  const [trackingNumber, setTrackingNumber] = useState('');

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
      setCarrier(order.carrier || (order.deliveryOption === 'express' ? 'FedEx Express' : 'USPS Priority'));
      setTrackingNumber(order.trackingNumber || `TRK-${Math.floor(100000 + Math.random() * 900000)}-US`);
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleSaveDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderStatus(order.id, status, trackingNumber.trim(), carrier);
    onClose();
  };

  const handleGenerateTracking = () => {
    const code = `${carrier.slice(0, 3).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTrackingNumber(code);
    addToast('Tracking Generated', `Assigned ${code}`, 'info');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white rounded-2xl max-w-2xl w-full my-8 p-6 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-stone-900">
                  Order #{order.orderNumber}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
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
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Placed on {new Date(order.date).toLocaleString()} • Direct Customer Order
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onOpenPackingSlip && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPackingSlip(order);
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Packing Slip</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Customer & Shipping Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Customer Box */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <h3 className="font-black text-stone-900 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-700" />
                <span>Customer Details</span>
              </h3>
              <p className="font-bold text-stone-900">{order.customer.fullName}</p>
              <p className="text-stone-600">{order.customer.email}</p>
              <p className="text-stone-600">{order.customer.phone}</p>
            </div>

            {/* Delivery Destination */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <h3 className="font-black text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-700" />
                <span>Shipping Address</span>
              </h3>
              <p className="text-stone-800 font-medium">{order.customer.address}</p>
              <p className="text-stone-800 font-medium">
                {order.customer.city}, {order.customer.state} {order.customer.zipCode}
              </p>
              <p className="text-stone-500 font-medium">{order.customer.country}</p>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="space-y-3">
            <h3 className="font-black text-stone-900 text-xs flex items-center gap-1.5">
              <Package className="w-4 h-4 text-stone-700" />
              <span>Items to Pack & Dispatch ({order.items.length})</span>
            </h3>

            <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                    />
                    <div>
                      <p className="font-black text-stone-900">{item.name}</p>
                      <p className="text-stone-500 text-[11px]">
                        Qty: <strong className="text-stone-800">{item.quantity}</strong>
                        {item.selectedColor && ` • Color: ${item.selectedColor}`}
                        {item.selectedSize && ` • Size: ${item.selectedSize}`}
                      </p>
                    </div>
                  </div>
                  <div className="font-black text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary Line */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs flex flex-wrap items-center justify-between gap-2 font-medium text-stone-600">
              <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
              {order.discount > 0 && <span className="text-emerald-700">Discount: -${order.discount.toFixed(2)}</span>}
              <span>Shipping: ${order.shipping.toFixed(2)}</span>
              <span>Tax: ${order.tax.toFixed(2)}</span>
              <span className="font-black text-stone-900 text-sm">
                Total Paid: ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Fulfillment & Tracking Updater Form */}
          <form onSubmit={handleSaveDispatch} className="bg-stone-900 text-white p-5 rounded-2xl space-y-4 text-xs shadow-md">
            <h3 className="font-black text-amber-400 flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4" />
              <span>Fulfillment & Dispatch Station</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-white font-bold focus:outline-none"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Shipping Carrier</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="USPS Priority">USPS Priority Express</option>
                  <option value="FedEx Express">FedEx Express Direct</option>
                  <option value="UPS Ground">UPS Commercial Ground</option>
                  <option value="DHL Express">DHL International Express</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-300 font-bold">Tracking #</label>
                  <button
                    type="button"
                    onClick={handleGenerateTracking}
                    className="text-amber-400 hover:underline text-[10px] cursor-pointer"
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="TRK-100234-US"
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-white font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-black transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Dispatch Details</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
