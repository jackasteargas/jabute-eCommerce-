import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  DollarSign,
  Award,
  Calendar,
  Copy,
  Check
} from 'lucide-react';

export const AdminCustomersTab: React.FC = () => {
  const { orders, addToast } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Group orders by customer email
  const customers = useMemo(() => {
    const map = new Map<string, {
      fullName: string;
      email: string;
      phone: string;
      city: string;
      state: string;
      ordersCount: number;
      lifetimeSpend: number;
      lastOrderDate: string;
      recentOrderNumber: string;
    }>();

    orders.forEach((order) => {
      const email = order.customer.email.toLowerCase();
      const existing = map.get(email);

      if (existing) {
        existing.ordersCount += 1;
        existing.lifetimeSpend += order.total;
        if (new Date(order.date) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.date;
          existing.recentOrderNumber = order.orderNumber;
        }
      } else {
        map.set(email, {
          fullName: order.customer.fullName,
          email: order.customer.email,
          phone: order.customer.phone,
          city: order.customer.city,
          state: order.customer.state,
          ordersCount: 1,
          lifetimeSpend: order.total,
          lastOrderDate: order.date,
          recentOrderNumber: order.orderNumber,
        });
      }
    });

    let list = Array.from(map.values());

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
  }, [orders, searchTerm]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    addToast('Email Copied', email, 'info');
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-stone-900">
            Customer Directory & CRM ({customers.length})
          </h2>
          <p className="text-xs text-stone-500">
            Verified buyers who have completed direct purchases on JABUTE.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, email, city..."
            className="w-full pl-9 pr-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
              <th className="pb-3">Customer Name</th>
              <th className="pb-3">Contact Email & Phone</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Total Orders</th>
              <th className="pb-3">Lifetime Spend</th>
              <th className="pb-3">Last Active Order</th>
              <th className="pb-3 text-right">Customer Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-400">
                  <p className="font-bold text-stone-700 text-sm">No customers found</p>
                  <p className="mt-1">Customer profiles are automatically created when new orders are placed.</p>
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const isVIP = customer.lifetimeSpend >= 300 || customer.ordersCount >= 2;
                const isCopied = copiedEmail === customer.email;

                return (
                  <tr key={customer.email} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5">
                      <div className="font-black text-stone-900 flex items-center gap-1.5">
                        <span>{customer.fullName}</span>
                        {isVIP && (
                          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" title="VIP Buyer" />
                        )}
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stone-700">{customer.email}</span>
                        <button
                          onClick={() => handleCopyEmail(customer.email)}
                          className="text-stone-400 hover:text-stone-900 cursor-pointer"
                          title="Copy Email"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{customer.phone}</div>
                    </td>

                    <td className="py-3.5 text-stone-600 font-medium">
                      {customer.city}, {customer.state}
                    </td>

                    <td className="py-3.5 font-bold text-stone-800">
                      {customer.ordersCount} {customer.ordersCount === 1 ? 'order' : 'orders'}
                    </td>

                    <td className="py-3.5 font-black text-stone-900 text-sm">
                      ${customer.lifetimeSpend.toFixed(2)}
                    </td>

                    <td className="py-3.5 text-stone-500">
                      <div>{new Date(customer.lastOrderDate).toLocaleDateString()}</div>
                      <span className="text-[10px] text-stone-400 font-mono">#{customer.recentOrderNumber}</span>
                    </td>

                    <td className="py-3.5 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isVIP
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {isVIP ? '★ VIP Patron' : 'Standard Buyer'}
                      </span>
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
