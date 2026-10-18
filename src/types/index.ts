export interface ProductVideoChapter {
  time: string;
  seconds: number;
  label: string;
}

export interface ProductVideo {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  type?: 'mp4' | 'youtube' | 'webm';
  badge?: string;
  description?: string;
  viewsCount?: number;
  chapters?: ProductVideoChapter[];
  author?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  discountPercentage?: number;
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  badge?: 'Best Seller' | 'New' | 'Sale' | 'Limited' | 'Staff Pick';
  images: string[];
  features?: string[];
  specifications?: Record<string, string>;
  colors?: { name: string; hex: string; inStock?: boolean }[];
  sizes?: string[];
  isFeatured?: boolean;
  isDiscounted?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  reviewsList?: ProductReview[];
  videos?: ProductVideo[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  image: string;
  featured?: boolean;
  iconName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface PromoCode {
  id?: string;
  code: string;
  discountPercentage: number;
  description: string;
  minSpend?: number;
  active?: boolean;
  usageCount?: number;
  expiresAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  currency: string;
  taxRate: number; // e.g. 7%
  freeShippingThreshold: number;
  supportEmail: string;
  contactPhone: string;
  warehouseAddress: string;
  bannerAnnouncement: string;
  isAnnouncementActive: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  costPrice?: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  image: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId?: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  customer: CustomerDetails;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'credit_card' | 'apple_pay' | 'google_pay' | 'cash_on_delivery';
  paymentStatus?: 'verified' | 'paid' | 'pending';
  transactionId?: string;
  authorizationCode?: string;
  cardLast4?: string;
  cardBrand?: string;
  verifiedAt?: string;
  deliveryOption?: 'standard' | 'express' | 'same_day';
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating-desc' | 'popularity';

export interface FilterState {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
  inStockOnly: boolean;
  minRating: number;
  selectedTag?: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'customer' | 'admin';
  createdAt?: string;
  lastLoginAt?: string;
  isAnonymous?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedProducts?: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    rating?: number;
    inStock?: boolean;
  }[];
  quickActions?: string[];
}

export interface DeliveryLocation {
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
  countryCode?: string;
  formattedAddress: string;
  isAutoDetected: boolean;
  latitude?: number;
  longitude?: number;
}
