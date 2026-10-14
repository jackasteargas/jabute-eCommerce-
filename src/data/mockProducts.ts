import { Product, PromoCode } from '../types';

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'JABUTE10',
    discountPercentage: 10,
    description: '10% off your entire order directly from JABUTE Store',
  },
  {
    code: 'SAVE20',
    discountPercentage: 20,
    description: '20% off on orders over $120',
    minSpend: 120,
  },
  {
    code: 'FREESHIP',
    discountPercentage: 0,
    description: 'Free expedited delivery on any order size',
  },
  {
    code: 'FLASH25',
    discountPercentage: 25,
    description: '25% off Flash Drop on orders over $120',
    minSpend: 120,
  },
  {
    code: 'VIP20',
    discountPercentage: 20,
    description: '20% off JABUTE Privé special order',
  },
  {
    code: 'SECRET15',
    discountPercentage: 15,
    description: '15% off mystery reward voucher',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // 1. Electronics
  {
    id: 'jab-elec-1',
    name: 'JABUTE Studio Pro Wireless Headphones',
    subtitle: 'Adaptive Active Noise Cancelling & Spatial Audio',
    description: 'Engineered with custom 40mm titanium composite drivers, delivering studio-grade acoustic clarity and deep controlled bass. Features up to 45 hours battery life, ambient pass-through mode, and memory foam ear cushions.',
    price: 249.00,
    originalPrice: 299.00,
    costPrice: 110.00,
    discountPercentage: 17,
    category: 'Electronics',
    categorySlug: 'electronics',
    rating: 4.9,
    reviewCount: 128,
    stock: 35,
    sku: 'JAB-AUD-001',
    badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
    ],
    features: [
      'Custom 40mm titanium diaphragm transducers',
      'Hybrid active noise cancellation with 3 ambient modes',
      'Up to 45 hours playtime on single charge (10 min charge = 5 hours)',
      'Multi-point Bluetooth 5.3 with AAC, aptX Adaptive and LDAC',
      'CNC machined aluminum accents with protein leather headband'
    ],
    specifications: {
      'Driver Size': '40mm Titanium Composite',
      'Frequency Range': '10Hz – 40,000Hz',
      'Impedance': '32 Ohms',
      'Battery Life': '45 Hours (ANC Off), 36 Hours (ANC On)',
      'Charging': 'USB-C Fast Charge (10 min for 5 hours)'
    },
    colors: [
      { name: 'Matte Obsidian', hex: '#1e2022', inStock: true },
      { name: 'Lunar Silver', hex: '#d1d5db', inStock: true },
      { name: 'Sand Beige', hex: '#e2d5c3', inStock: true }
    ],
    isFeatured: true,
    isBestSeller: true,
    isDiscounted: true,
    tags: ['audio', 'wireless', 'noise-cancelling', 'electronics'],
    reviewsList: [
      {
        id: 'rev-1',
        author: 'Marcus Vance',
        rating: 5,
        date: '3 days ago',
        comment: 'The soundstage clarity and build quality are incredible for the price. Fast direct shipping from JABUTE too!',
        verified: true
      },
      {
        id: 'rev-2',
        author: 'Elena Rostova',
        rating: 5,
        date: '1 week ago',
        comment: 'Very comfortable for all-day office work. Active noise cancelling isolates background chatter easily.',
        verified: true
      }
    ],
    createdAt: '2026-01-15'
  },

  // 2. Phones & Accessories
  {
    id: 'jab-phone-1',
    name: 'MagFlow 3-in-1 Foldable Wireless Charging Station',
    subtitle: '15W Fast Charge for Phone, Watch & Earbuds',
    description: 'Anodized aerospace aluminum folding stand that simultaneously powers your smartphone, smartwatch, and wireless earbuds with strong magnetic alignment and intelligent thermal regulation.',
    price: 79.00,
    originalPrice: 99.00,
    costPrice: 28.00,
    discountPercentage: 20,
    category: 'Phones & Accessories',
    categorySlug: 'phones-accessories',
    rating: 4.8,
    reviewCount: 94,
    stock: 42,
    sku: 'JAB-MAG-301',
    badge: 'Sale',
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Official MagSafe compatible 15W peak output',
      'Fold-flat pocket design for travel and clean bedside organization',
      'Over-temperature and foreign object detection safety matrix',
      'Weighted anti-slip base with ambient status LED'
    ],
    specifications: {
      'Total Output': '25W Max (15W Phone + 5W Watch + 5W Buds)',
      'Input Interface': 'USB-C (Power Delivery 3.0)',
      'Dimensions': '145 x 72 x 18 mm (Folded)',
      'Weight': '210g'
    },
    colors: [
      { name: 'Space Gray', hex: '#4b5563', inStock: true },
      { name: 'Silver White', hex: '#e5e7eb', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['magsafe', 'charger', 'phone', 'wireless', 'accessories'],
    reviewsList: [
      {
        id: 'rev-3',
        author: 'Daniel Kim',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Cleaned up my nightstand completely. Super solid hinges and fast charging.',
        verified: true
      }
    ],
    createdAt: '2026-02-01'
  },

  // 3. Computers
  {
    id: 'jab-comp-1',
    name: 'ApexCraft 75% Mechanical Keyboard (Gasket Mount)',
    subtitle: 'Hot-Swappable RGB, Lubed Linear Switches & PBT Keycaps',
    description: 'CNC anodized solid aluminum chassis featuring a flexible poron gasket mount, pre-lubricated custom linear switches, south-facing per-key RGB backlighting, and triple connectivity (2.4GHz / Bluetooth 5.1 / Type-C).',
    price: 159.00,
    originalPrice: 189.00,
    costPrice: 65.00,
    discountPercentage: 16,
    category: 'Computers',
    categorySlug: 'computers',
    rating: 4.9,
    reviewCount: 164,
    stock: 22,
    sku: 'JAB-KEY-75G',
    badge: 'Staff Pick',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'CNC 6063 aluminum case with bead-blasted anodized finish',
      'Poron gasket mounting structure for pleasant acoustic typing feel',
      'Hot-swappable 3/5-pin switch sockets (No soldering required)',
      '4000mAh rechargeable lithium battery with 200 hours standby'
    ],
    specifications: {
      'Layout': '75% Compact (82 Keys)',
      'Switch Type': 'Pre-lubed Matcha Linear (45g actuation)',
      'Keycaps': 'Dye-Sublimated Double-Shot PBT (Cherry Profile)',
      'Connectivity': 'Tri-mode (2.4Ghz wireless / BT 5.1 / Wired Type-C)'
    },
    colors: [
      { name: 'Onyx Black', hex: '#18181b', inStock: true },
      { name: 'Frost White', hex: '#f4f4f5', inStock: true },
      { name: 'Botanical Green', hex: '#2d4f3b', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['keyboard', 'mechanical', 'computer', 'desk-setup', 'gaming'],
    reviewsList: [
      {
        id: 'rev-4',
        author: 'Julian Thorne',
        rating: 5,
        date: '5 days ago',
        comment: 'Thocky sound right out of the box. Zero rattle on the spacebar stabilizers.',
        verified: true
      }
    ],
    createdAt: '2026-02-10'
  },

  // 4. Fashion
  {
    id: 'jab-fash-1',
    name: 'JABUTE Minimalist Automatic Field Watch',
    subtitle: 'Japanese NH35 Movement & Scratchproof Sapphire Crystal',
    description: 'A timeless, rugged automatic field watch crafted from surgical 316L stainless steel. Equipped with high-visibility Swiss Super-LumiNova BGW9 indices, 100m water resistance, and quick-release oiled leather strap.',
    price: 219.00,
    originalPrice: 260.00,
    costPrice: 85.00,
    discountPercentage: 15,
    category: 'Fashion',
    categorySlug: 'fashion',
    rating: 4.8,
    reviewCount: 79,
    stock: 18,
    sku: 'JAB-WTC-FLD',
    badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Self-winding mechanical caliber with 41-hour power reserve',
      'Double-domed anti-reflective scratch-proof sapphire crystal',
      '10 ATM / 100m water resistance with screw-down crown',
      'Hand-stitched genuine Italian calfskin leather strap'
    ],
    specifications: {
      'Case Diameter': '38mm',
      'Case Thickness': '11.2mm',
      'Lug to Lug': '45mm',
      'Glass': 'AR Sapphire Crystal',
      'Movement': 'Seiko NH35 Automatic'
    },
    colors: [
      { name: 'Brushed Steel & Black', hex: '#27272a', inStock: true },
      { name: 'Vintage Bronze & Brown', hex: '#78350f', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['watch', 'fashion', 'automatic', 'leather', 'accessories'],
    reviewsList: [
      {
        id: 'rev-5',
        author: 'Robert S.',
        rating: 5,
        date: '1 week ago',
        comment: 'Keeps accurate time within +4s per day. The lume glows bright all night long.',
        verified: true
      }
    ],
    createdAt: '2026-01-20'
  },

  // 5. Home & Living
  {
    id: 'jab-home-1',
    name: 'Nordic Cast Ceramic Ambient Table Lamp',
    subtitle: 'Stepless Warm Dimming with Solid Brass Rotary Dial',
    description: 'Hand-cast artisanal textured stoneware ceramic body paired with a solid brushed brass dimmer. Emits a cozy 2200K–3000K warm glow that elevates bedside tables, living room consoles, and reading alcoves.',
    price: 129.00,
    originalPrice: 155.00,
    costPrice: 48.00,
    discountPercentage: 16,
    category: 'Home & Living',
    categorySlug: 'home-living',
    rating: 4.9,
    reviewCount: 68,
    stock: 25,
    sku: 'JAB-LMP-01',
    badge: 'New',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Warm integrated LED with stepless analog brass rotary dial',
      'Hand-finished porous terracotta stoneware ceramic glaze',
      'Braided 2.0m woven linen cord with grounded brass plug',
      '95+ CRI high color rendering index for restful eye comfort'
    ],
    specifications: {
      'Dimensions': '24cm (H) x 18cm (W)',
      'Brightness': '450 Lumens Max (Dimmable to 1%)',
      'Color Temperature': '2200K – 3000K Stepless',
      'Voltage': '100V – 240V Global Compatible'
    },
    colors: [
      { name: 'Warm Terracotta', hex: '#b45309', inStock: true },
      { name: 'Bone Ceramic', hex: '#e7e5e4', inStock: true },
      { name: 'Charcoal Basalt', hex: '#3f3f46', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['home', 'lamp', 'lighting', 'ceramic', 'living'],
    reviewsList: [
      {
        id: 'rev-6',
        author: 'Claire B.',
        rating: 5,
        date: '2 weeks ago',
        comment: 'The tactile brass dial has such a smooth, high-end weight to it. Transforms my bedroom mood.',
        verified: true
      }
    ],
    createdAt: '2026-02-05'
  },

  // 6. Beauty
  {
    id: 'jab-beauty-1',
    name: 'Ultrasonic Ionic Facial Cleanser & Sculpting Wand',
    subtitle: '30,000Hz Ultrasonic Micro-Vibrations & Red Light Therapy',
    description: 'Dermatologist-grade at-home skincare device combining 30kHz ultrasonic pore deep cleaning, positive ion extraction, negative ion serum infusion, and 630nm red LED collagen stimulation.',
    price: 89.00,
    originalPrice: 115.00,
    costPrice: 32.00,
    discountPercentage: 22,
    category: 'Beauty',
    categorySlug: 'beauty',
    rating: 4.8,
    reviewCount: 86,
    stock: 30,
    sku: 'JAB-BEA-WND',
    badge: 'Sale',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512290900672-1f5be661f211?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Medical-grade 316 stainless steel spatula head',
      '4 Smart Modes: Peeling, Ion+, Ion-, and EMS Microcurrent',
      'IPX7 waterproof design for easy bathroom sink rinsing',
      'USB-C magnetic wireless charging dock included'
    ],
    specifications: {
      'Vibration Frequency': '30,000 Hz',
      'Battery Capacity': '650mAh (Up to 4 weeks per charge)',
      'Waterproof Rating': 'IPX7',
      'Weight': '88g'
    },
    colors: [
      { name: 'Rose Pearl', hex: '#fda4af', inStock: true },
      { name: 'Frost White', hex: '#f8fafc', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['beauty', 'skincare', 'ultrasonic', 'wellness'],
    reviewsList: [
      {
        id: 'rev-7',
        author: 'Sophia Chen',
        rating: 5,
        date: '4 days ago',
        comment: 'Pores look noticeably clearer within the first week. Very gentle on sensitive skin.',
        verified: true
      }
    ],
    createdAt: '2026-02-12'
  },

  // 7. Tools
  {
    id: 'jab-tool-1',
    name: 'Precision EDC 64-in-1 Magnetic Screwdriver Kit',
    subtitle: 'S2 Hardened Steel Bits with Pop-Up Aluminum Storage Case',
    description: 'Professional repair tool set featuring 64 precision CNC-machined S2 alloy steel bits (60HRC hardness). Built for repairing smartphones, laptops, drones, watches, gaming consoles, and electronics.',
    price: 45.00,
    originalPrice: 59.00,
    costPrice: 15.00,
    discountPercentage: 23,
    category: 'Tools',
    categorySlug: 'tools',
    rating: 4.9,
    reviewCount: 112,
    stock: 50,
    sku: 'JAB-TLS-64M',
    badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      '64 high-grade S2 alloy steel bits with anti-corrosion phosphate coating',
      'Push-to-eject spring-loaded anodized aluminum storage case',
      '360° rotating bearing cap with magnetic bit holder and extension rod',
      'Includes Phillips, Torx Security, Pentalobe, Tri-wing, and Hex bits'
    ],
    specifications: {
      'Bit Hardness': '60 HRC S2 Steel',
      'Handle Material': 'Anodized Aluminum with Ball Bearing Cap',
      'Case Dimensions': '168 x 67 x 17 mm',
      'Weight': '280g'
    },
    colors: [
      { name: 'Space Gray', hex: '#374151', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['tools', 'screwdriver', 'electronics-repair', 'precision', 'edc'],
    reviewsList: [
      {
        id: 'rev-8',
        author: 'Tyler Ross',
        rating: 5,
        date: '6 days ago',
        comment: 'The magnetic retention is super strong and the bits do not strip screw heads. Essential tool kit.',
        verified: true
      }
    ],
    createdAt: '2026-01-28'
  },

  // 8. Computers
  {
    id: 'jab-comp-2',
    name: 'Precision Aluminum Laptop Riser & Stand',
    subtitle: 'Ergonomic Viewing Angle with Integrated Cable Management',
    description: 'Precision CNC-machined from single-piece 4mm aircraft aluminum. Elevates your laptop 6 inches to eye level to eliminate neck fatigue, while maximizing open airflow for cooler CPU operation.',
    price: 49.00,
    originalPrice: 65.00,
    costPrice: 18.00,
    discountPercentage: 24,
    category: 'Computers',
    categorySlug: 'computers',
    rating: 4.9,
    reviewCount: 140,
    stock: 40,
    sku: 'JAB-STD-ALU',
    badge: 'Staff Pick',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Single-piece sandblasted aluminum build holds up to 10kg',
      'Silicone non-slip protective pads protect laptop finish',
      'Rear pass-through routing canal keeps charging cords neat',
      'Supports all 11" to 17" laptops and tablets'
    ],
    specifications: {
      'Material': '4mm Solid Aircraft Aluminum',
      'Elevation Height': '150mm (5.9 inches)',
      'Angle': '18° Optimal Ergonomic Incline',
      'Compatibility': '11-inch to 17-inch Laptops'
    },
    colors: [
      { name: 'Silver Anodized', hex: '#d1d5db', inStock: true },
      { name: 'Space Gray', hex: '#4b5563', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['stand', 'laptop', 'workspace', 'ergonomics', 'computers'],
    reviewsList: [
      {
        id: 'rev-9',
        author: 'Rachel Adams',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Rock solid on my desk. No wobbling while typing on an external keyboard.',
        verified: true
      }
    ],
    createdAt: '2026-02-02'
  },

  // 9. Electronics
  {
    id: 'jab-elec-2',
    name: 'SoundSphere Portable 360° Waterproof Speaker',
    subtitle: 'IP67 Dust & Water Proof with 24-Hour Battery Life',
    description: 'Rugged yet refined outdoor acoustic speaker featuring dual neodymium passive radiators and true 360-degree omnidirectional sound projection. Built with floating water-resistant casing and USB-C powerbank charging.',
    price: 119.00,
    originalPrice: 149.00,
    costPrice: 45.00,
    discountPercentage: 20,
    category: 'Electronics',
    categorySlug: 'electronics',
    rating: 4.8,
    reviewCount: 95,
    stock: 28,
    sku: 'JAB-SPK-360',
    badge: 'Sale',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1529359744902-86b2ab9ed2e1?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Dual 20W acoustic drivers with twin passive subwoofers',
      'IP67 fully waterproof, dustproof and buoyant (floats in water)',
      'PartySync mode: wirelessly connect up to 50 speakers together',
      'Built-in 5200mAh battery also charges your phone'
    ],
    specifications: {
      'Power Output': '40W Total Peak',
      'Battery Capacity': '5200mAh (24 Hours Playtime)',
      'Waterproof': 'IP67 Submersible (1m for 30 min)',
      'Wireless Range': '30 Meters (Bluetooth 5.3)'
    },
    colors: [
      { name: 'Forest Green', hex: '#1e3a2f', inStock: true },
      { name: 'Midnight Black', hex: '#0f172a', inStock: true },
      { name: 'Glacier Blue', hex: '#38bdf8', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['speaker', 'bluetooth', 'waterproof', 'audio', 'electronics'],
    reviewsList: [
      {
        id: 'rev-10',
        author: 'Chris Palmer',
        rating: 5,
        date: '1 week ago',
        comment: 'Incredible punchy bass for its portable size. Took it camping and battery lasted the whole weekend.',
        verified: true
      }
    ],
    createdAt: '2026-02-08'
  },

  // 10. Phones & Accessories
  {
    id: 'jab-phone-2',
    name: 'AeroShield Ultra-Slim Kevlar Aramid Phone Case',
    subtitle: 'Real 1500D Ballistic Aramid Fiber with Built-in MagSafe',
    description: 'Form-fitted from 100% genuine aerospace-grade aramid fiber (5x stronger than steel of same weight). At just 0.85mm ultra-thin thickness, it provides scratch and drop protection without adding bulk.',
    price: 39.00,
    originalPrice: 49.00,
    costPrice: 12.00,
    discountPercentage: 20,
    category: 'Phones & Accessories',
    categorySlug: 'phones-accessories',
    rating: 4.9,
    reviewCount: 153,
    stock: 60,
    sku: 'JAB-CS-KVL',
    badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      '1500D genuine military-grade aramid fiber weave',
      '3D silky-smooth carbon texture with non-slip tactile grip',
      'Integrated N52 neodymium magnetic ring for instant MagSafe snap',
      'Raised 0.6mm camera ring prevents lens surface scratches'
    ],
    specifications: {
      'Thickness': '0.85 mm',
      'Weight': '18.5 grams',
      'Material': '100% 1500D Ballistic Aramid Fiber',
      'Compatibility': 'iPhone 15/16 Pro & Galaxy S24 Ultra'
    },
    colors: [
      { name: 'Twill Carbon Black', hex: '#1c1917', inStock: true },
      { name: 'Sunset Amber Weave', hex: '#b45309', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['case', 'phone', 'magsafe', 'kevlar', 'accessories'],
    reviewsList: [
      {
        id: 'rev-11',
        author: 'David L.',
        rating: 5,
        date: '3 days ago',
        comment: 'Extremely thin, feels almost like having no case at all with great grip. MagSafe holds tight in my car mount.',
        verified: true
      }
    ],
    createdAt: '2026-02-14'
  },

  // 11. Fashion
  {
    id: 'jab-fash-2',
    name: 'Everyday Commuter Weatherproof Cordura Backpack',
    subtitle: '22L Expandable Capacity with Dedicated 16" Padded Laptop Sleeve',
    description: 'Designed for daily urban commuting and weekend flights. Constructed from ballistic 1000D Cordura nylon with YKK AquaGuard weatherproof zippers, magnetic fidlock buckle, and hidden passport pocket.',
    price: 139.00,
    originalPrice: 175.00,
    costPrice: 52.00,
    discountPercentage: 20,
    category: 'Fashion',
    categorySlug: 'fashion',
    rating: 4.8,
    reviewCount: 88,
    stock: 24,
    sku: 'JAB-BPK-22L',
    badge: 'Staff Pick',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      '1000D water-repellent Cordura shell with TPU waterproof base',
      'Dedicated suspended 16-inch laptop compartment with soft microfiber lining',
      'Fidlock German magnetic quick-release chest sternum buckle',
      'Luggage trolley pass-through handle for effortless airport travel'
    ],
    specifications: {
      'Volume': '22 Liters (Expandable to 26L)',
      'Dimensions': '48 x 31 x 16 cm',
      'Laptop Pocket': 'Fits up to 16-inch MacBook Pro',
      'Weight': '980g'
    },
    colors: [
      { name: 'Matte Stealth Black', hex: '#18181b', inStock: true },
      { name: 'Olive Drab', hex: '#3f4f3a', inStock: true },
      { name: 'Graphite Heather', hex: '#52525b', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['backpack', 'travel', 'fashion', 'bags', 'commute'],
    reviewsList: [
      {
        id: 'rev-12',
        author: 'Jonathan King',
        rating: 5,
        date: '1 week ago',
        comment: 'Survived a torrential downpour and my laptop remained bone dry. Clean architectural look.',
        verified: true
      }
    ],
    createdAt: '2026-01-30'
  },

  // 12. Home & Living
  {
    id: 'jab-home-2',
    name: 'Precision Double-Wall Vacuum Insulated Thermal Carafe',
    subtitle: '1.2L Stainless Steel with Solid Oak Wood Handle',
    description: 'Minimalist Scandinavian thermal server keeping coffee or tea steaming hot for 12 hours or ice cold for 24 hours. Features a solid turned FSC-certified natural beechwood handle and one-touch leakproof pour spout.',
    price: 59.00,
    originalPrice: 75.00,
    costPrice: 22.00,
    discountPercentage: 21,
    category: 'Home & Living',
    categorySlug: 'home-living',
    rating: 4.9,
    reviewCount: 75,
    stock: 32,
    sku: 'JAB-CRF-120',
    badge: 'New',
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Double-wall 18/8 food-grade stainless steel vacuum insulation',
      'Ergonomic solid natural beechwood handle stays cool to touch',
      'Push-button thumb lever allows easy one-handed controlled pouring',
      'Wide mouth design accommodates ice cubes and facilitates quick cleaning'
    ],
    specifications: {
      'Capacity': '1.2 Liters (40 oz)',
      'Thermal Performance': 'Hot 12 Hours / Cold 24 Hours',
      'Materials': '18/8 Stainless Steel, FSC Beech Wood, Silicone',
      'Dimensions': '21.5cm (H) x 13cm (Dia)'
    },
    colors: [
      { name: 'Matte Chalk White', hex: '#f4f4f5', inStock: true },
      { name: 'Basalt Charcoal', hex: '#27272a', inStock: true },
      { name: 'Sage Green', hex: '#84a98c', inStock: true }
    ],
    isFeatured: true,
    isDiscounted: true,
    tags: ['coffee', 'carafe', 'home', 'kitchen', 'living'],
    reviewsList: [
      {
        id: 'rev-13',
        author: 'Hannah M.',
        rating: 5,
        date: '5 days ago',
        comment: 'Looks beautiful sitting on our kitchen island. Keeps morning French press coffee piping hot until afternoon.',
        verified: true
      }
    ],
    createdAt: '2026-02-11'
  },

  // 13. Tools
  {
    id: 'jab-tool-2',
    name: 'Digital Precision Laser Distance Meter (50m / 165ft)',
    subtitle: 'Millimeter Accuracy with Angle Sensor & Backlit LCD',
    description: 'High-precision handheld digital laser measure with continuous real-time measurement, Pythagorean area and volume calculations, and built-in electronic bubble level for instant layout validation.',
    price: 49.00,
    originalPrice: 65.00,
    costPrice: 19.00,
    discountPercentage: 24,
    category: 'Tools',
    categorySlug: 'tools',
    rating: 4.8,
    reviewCount: 62,
    stock: 38,
    sku: 'JAB-LSR-50M',
    badge: 'Sale',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Measures distance up to 50 meters (165 feet) with ±1.5mm precision',
      'Electronic angle sensor displays real-time tilt orientation',
      'Backlit 4-line high-contrast LCD for clear readability in dark job sites',
      'Stores up to 30 measurement history sets in internal memory'
    ],
    specifications: {
      'Range': '0.05m – 50m',
      'Accuracy': '±1.5mm',
      'Laser Class': 'Class II 635nm, <1mW',
      'Power': 'Rechargeable Type-C (3000 Measurements per charge)'
    },
    colors: [
      { name: 'Matte Black & Safety Yellow', hex: '#eab308', inStock: true }
    ],
    isFeatured: false,
    isDiscounted: true,
    tags: ['tools', 'laser', 'measuring', 'architecture', 'diy'],
    reviewsList: [
      {
        id: 'rev-14',
        author: 'Brian Walker',
        rating: 5,
        date: '2 weeks ago',
        comment: 'So much faster than snapping traditional tape measures across long rooms. Super accurate.',
        verified: true
      }
    ],
    createdAt: '2026-02-03'
  },

  // 14. Beauty
  {
    id: 'jab-beauty-2',
    name: 'Botanical Cold-Pressed Organic Beard & Face Oil',
    subtitle: '100% Pure Argan, Jojoba & Cedarwood Essence (50ml)',
    description: 'Crafted in small artisan batches from organic Moroccan argan, golden jojoba, and wild cedarwood essential oil. Nourishes skin beneath facial hair, softens coarse whiskers, and prevents dryness with a subtle woody scent.',
    price: 28.00,
    originalPrice: 35.00,
    costPrice: 8.00,
    discountPercentage: 20,
    category: 'Beauty',
    categorySlug: 'beauty',
    rating: 4.9,
    reviewCount: 92,
    stock: 45,
    sku: 'JAB-OIL-50M',
    badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1608248597359-0021b1b68146?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      '100% pure organic cold-pressed botanicals without synthetic fragrances',
      'Non-greasy fast-absorbing formula leaves clean matte finish',
      'Amber UV-blocking glass bottle preserves active phytonutrients',
      'Cruelty-free, vegan certified and hand-blended'
    ],
    specifications: {
      'Volume': '50ml (1.7 fl oz)',
      'Key Ingredients': 'Organic Argan, Jojoba, Vitamin E, Atlas Cedarwood',
      'Container': 'Amber Glass with Glass Dropper Pipette'
    },
    colors: [
      { name: 'Amber Glow', hex: '#d97706', inStock: true }
    ],
    isFeatured: false,
    isDiscounted: true,
    tags: ['beauty', 'grooming', 'organic', 'skincare', 'botanical'],
    reviewsList: [
      {
        id: 'rev-15',
        author: 'Samuel Croft',
        rating: 5,
        date: '1 week ago',
        comment: 'Absorbs within seconds without feeling greasy. Smells amazing and very subtle.',
        verified: true
      }
    ],
    createdAt: '2026-02-09'
  },

  // 15. Electronics
  {
    id: 'jab-elec-3',
    name: 'Smart Compact 4K Action Camera with Gyro Stabilization',
    subtitle: 'Dual Color Touchscreens, 6-Axis EIS & 20MP Still Photography',
    description: 'Pocket-sized powerhouse filming buttery-smooth 4K 60FPS video with 6-axis electronic image stabilization. Features dual front and rear preview screens, voice control, and 10m native waterproof body.',
    price: 189.00,
    originalPrice: 229.00,
    costPrice: 78.00,
    discountPercentage: 17,
    category: 'Electronics',
    categorySlug: 'electronics',
    rating: 4.8,
    reviewCount: 77,
    stock: 20,
    sku: 'JAB-CAM-4K',
    badge: 'New',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      '4K 60FPS Ultra-HD video recording and 20MP HDR photo capture',
      'HyperSmooth 6-axis hardware gyro image stabilization',
      'Dual color LCD screens for perfect self-vlogging and framing',
      '10-meter native waterproof casing without external housing'
    ],
    specifications: {
      'Video Resolution': '4K@60fps, 2.7K@120fps, 1080p@240fps',
      'Sensor': 'Sony 1/2.3" CMOS 20MP',
      'Battery': '1350mAh (90 min 4K recording)',
      'Storage': 'MicroSD up to 256GB U3'
    },
    colors: [
      { name: 'Matte Stealth Black', hex: '#18181b', inStock: true }
    ],
    isFeatured: false,
    isDiscounted: true,
    tags: ['camera', 'electronics', 'action-cam', '4k', 'video'],
    reviewsList: [
      {
        id: 'rev-16',
        author: 'Alexandre Roy',
        rating: 5,
        date: '4 days ago',
        comment: 'Stabilization while mountain biking is unreal. Great companion for active outdoor trips.',
        verified: true
      }
    ],
    createdAt: '2026-02-13'
  }
];
