import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      name: 'Marcus Vance',
      role: 'Industrial Designer',
      productName: 'Aether Flow Studio Headphones',
      rating: 5,
      comment: 'The soundstage clarity and tactile materials on the Aether Flow are unmatched. Truly architectural design meets audiophile acoustic performance.',
      date: '2 weeks ago',
      verified: true
    },
    {
      name: 'Claire Beauchamp',
      role: 'Architect & Collector',
      productName: 'Nordic Cast Ceramic Lamp',
      rating: 5,
      comment: 'The warm stepless dimmer creates the exact mood I wanted for my studio reading nook. The ceramic glaze has subtle organic texture.',
      date: '1 month ago',
      verified: true
    },
    {
      name: 'Devon Wright',
      role: 'Software Architect',
      productName: 'Apex Precision Mechanical Keyboard',
      rating: 5,
      comment: 'The acoustic gasket dampening makes typing an absolute joy every workday. Solid CNC build that feels like it will last decades.',
      date: '3 weeks ago',
      verified: true
    }
  ];

  return (
    <section className="py-14 sm:py-18 bg-stone-50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
            Verified Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Loved by Designers, Creators, & Craftsmen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                    <span>{rev.name}</span>
                    {rev.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Buyer" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400">{rev.role}</p>
                </div>
                <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-1 rounded-md max-w-[130px] truncate">
                  {rev.productName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
