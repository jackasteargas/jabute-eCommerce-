import React from 'react';
import { Truck, ShieldCheck, Clock, Headphones } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const values = [
    {
      icon: <Truck className="w-6 h-6 text-stone-900" />,
      title: 'Free Express Shipping',
      description: 'Complimentary expedited delivery on all orders over $100 with live door-to-door tracking.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-stone-900" />,
      title: '30-Day Risk-Free Trial',
      description: 'Love your piece or return it with our pre-paid complimentary labels. Zero hassle guaranteed.'
    },
    {
      icon: <Clock className="w-6 h-6 text-stone-900" />,
      title: '2-Year Craft Warranty',
      description: 'Every mechanical, acoustic, and leather product is backed by full manufacturer warranty.'
    },
    {
      icon: <Headphones className="w-6 h-6 text-stone-900" />,
      title: '24/7 Design Concierge',
      description: 'Our customer care team is available around the clock for sizing, advice, and assistance.'
    }
  ];

  return (
    <section className="py-12 bg-stone-100/70 border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, idx) => (
            <div key={idx} className="flex items-start gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-xs">
                {v.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900">{v.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
