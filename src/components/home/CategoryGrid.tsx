import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Headphones, Watch, Lamp, Shirt, Briefcase, Laptop, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const CategoryGrid: React.FC = () => {
  const { categories, setSelectedCategory } = useShop();

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Headphones':
        return <Headphones className="w-5 h-5" />;
      case 'Watch':
        return <Watch className="w-5 h-5" />;
      case 'Lamp':
        return <Lamp className="w-5 h-5" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'Laptop':
      default:
        return <Laptop className="w-5 h-5" />;
    }
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    const el = document.getElementById('featured-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Curated Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Shop by Essential Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md">
            Meticulously designed products built with premium materials, sustainable principles, and modern functionality.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleSelectCategory(cat.slug)}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 cursor-pointer hover:shadow-lg hover:border-stone-400 transition-all duration-300"
            >
              {/* Image with subtle overlay */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
                
                {/* Icon Pill */}
                <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-900 flex items-center justify-center shadow-xs">
                  {getCategoryIcon(cat.iconName)}
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <h3 className="font-bold text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-stone-300 mt-0.5">
                    <span>{cat.itemCount} items</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
