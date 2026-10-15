import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, Category, CartItem, PromoCode, ToastMessage, Order, SortOption, StoreSettings, AuthUser, DeliveryLocation } from '../types';
import { MOCK_PRODUCTS, PROMO_CODES } from '../data/mockProducts';
import { CATEGORIES } from '../data/categories';
import {
  auth,
  signInWithGoogle,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  sendPasswordReset,
  signOutUser,
  saveUserCart,
  getUserCart,
  saveUserWishlist,
  getUserWishlist,
  saveOrderToFirestore,
  fetchFirestoreOrders,
  updateFirestoreOrderStatus,
  syncUserProfile,
  isAuthorizedAdmin,
  ADMIN_EMAIL
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface ShopContextType {
  // Authentication & Profile (Firebase)
  user: AuthUser | null;
  isAdmin: boolean;
  authLoading: boolean;
  loginWithGoogle: () => Promise<AuthUser | null>;
  loginWithEmail: (email: string, pass: string) => Promise<AuthUser>;
  signupWithEmail: (email: string, pass: string, name?: string) => Promise<AuthUser>;
  resetPasswordEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Catalog & Products
  products: Product[];
  categories: Category[];
  loading: boolean;
  filteredProducts: Product[];
  
  // Product Owner Operations (Admin)
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Product;
  editProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  restockProduct: (id: string, amount: number) => void;
  duplicateProduct: (id: string) => void;
  
  // Category Management (Admin)
  addCategory: (category: Omit<Category, 'id'>) => Category;
  editCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Promo / Coupons Management (Admin & Store)
  promos: PromoCode[];
  addPromoCode: (promo: PromoCode) => void;
  deletePromoCode: (code: string) => void;
  togglePromoCode: (code: string) => void;

  // Store Settings (Admin)
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  resetStoreToDefaults: () => void;

  // Filtering & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  minPrice: number;
  maxPrice: number;
  setPriceFilter: (min: number, max: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  resetFilters: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  discountAmount: number;
  shippingCost: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // App / Store Navigation Menu Drawer (Top-Left)
  isAppMenuOpen: boolean;
  setIsAppMenuOpen: (open: boolean) => void;

  // Delivery Location of Viewing User
  deliveryLocation: DeliveryLocation;
  setDeliveryLocation: (location: DeliveryLocation) => void;
  updateDeliveryAddress: (updates: Partial<DeliveryLocation>) => void;
  detectUserLocation: () => Promise<DeliveryLocation>;
  isDetectingLocation: boolean;

  // Chat Drawer & AI Assistant
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatInitialPrompt: string | null;
  openChatWithPrompt: (prompt?: string) => void;
  closeChat: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Navigation & Page State
  activeView: 'home' | 'shop' | 'product-detail' | 'checkout' | 'orders' | 'wishlist' | 'admin' | 'order-success';
  setActiveView: (view: 'home' | 'shop' | 'product-detail' | 'checkout' | 'orders' | 'wishlist' | 'admin' | 'order-success') => void;
  selectedProductId: string | null;
  viewProductDetail: (productId: string) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Orders & Store Admin Management
  orders: Order[];
  lastPlacedOrder: Order | null;
  placeOrder: (customer: any, paymentMethod: any, deliveryOption?: any) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string, carrier?: string) => void;
  deleteOrder: (orderId: string) => void;

  // Owner Financial Analytics
  storeAnalytics: {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    totalOrdersCount: number;
    totalProductsCount: number;
    lowStockCount: number;
  };
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 99;
const STANDARD_SHIPPING_FEE = 9.99;

// Initial sample orders for store owner visibility
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'JAB-84920',
    date: '2026-02-15T14:30:00.000Z',
    items: [
      {
        productId: 'jab-elec-1',
        name: 'JABUTE Studio Pro Wireless Headphones',
        price: 249.00,
        costPrice: 110.00,
        quantity: 1,
        selectedColor: 'Matte Obsidian',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    customer: {
      fullName: 'Marcus Vance',
      email: 'marcus.vance@designer.io',
      phone: '+1 (415) 555-0192',
      address: '742 Montgomery St, Floor 4',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      country: 'United States'
    },
    subtotal: 249.00,
    discount: 24.90,
    shipping: 0.00,
    tax: 17.43,
    total: 241.53,
    status: 'Delivered',
    paymentMethod: 'credit_card',
    deliveryOption: 'express',
    trackingNumber: 'TRK-994821-US',
    carrier: 'FedEx Express',
    estimatedDelivery: 'Feb 17, 2026'
  },
  {
    id: 'ord-102',
    orderNumber: 'JAB-84921',
    date: '2026-02-16T10:15:00.000Z',
    items: [
      {
        productId: 'jab-comp-1',
        name: 'ApexCraft 75% Mechanical Keyboard',
        price: 159.00,
        costPrice: 65.00,
        quantity: 1,
        selectedColor: 'Onyx Black',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80'
      },
      {
        productId: 'jab-tool-1',
        name: 'Precision EDC 64-in-1 Magnetic Screwdriver Kit',
        price: 45.00,
        costPrice: 15.00,
        quantity: 1,
        selectedColor: 'Space Gray',
        image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    customer: {
      fullName: 'Sophia Chen',
      email: 'sophia.chen@techworks.com',
      phone: '+1 (206) 555-8371',
      address: '1200 4th Ave, Suite 1800',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States'
    },
    subtotal: 204.00,
    discount: 0.00,
    shipping: 0.00,
    tax: 14.28,
    total: 218.28,
    status: 'Processing',
    paymentMethod: 'apple_pay',
    deliveryOption: 'standard',
    trackingNumber: 'TRK-582910-US',
    carrier: 'UPS Ground',
    estimatedDelivery: 'Feb 19, 2026'
  }
];

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'JABUTE',
  tagline: 'Independent Single-Seller Retail & Verified Direct Fulfillment',
  currency: 'USD ($)',
  taxRate: 7.0,
  freeShippingThreshold: 99,
  supportEmail: 'care@jabute.store',
  contactPhone: '+1 (800) 522-8831',
  warehouseAddress: 'JABUTE Logistics Hub, Bay 4, Logistics Way, San Francisco, CA 94107',
  bannerAnnouncement: '⚡ JABUTE Direct Launch Special: Use code JABUTE10 for 10% OFF | Free Express on orders over $99',
  isAnnouncementActive: true
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Store Settings (with persistence)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('jabute_settings');
      return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  // Products Catalog (with local persistence)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('jabute_products');
      return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
    } catch {
      return MOCK_PRODUCTS;
    }
  });

  // Categories (with local persistence)
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('jabute_categories');
      return saved ? JSON.parse(saved) : CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  // Promo Codes (with local persistence)
  const [promos, setPromos] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('jabute_promos');
      return saved ? JSON.parse(saved) : PROMO_CODES.map((p, idx) => ({ ...p, id: `promo-${idx + 1}`, active: true, usageCount: 12 + idx * 7 }));
    } catch {
      return PROMO_CODES.map((p, idx) => ({ ...p, id: `promo-${idx + 1}`, active: true, usageCount: 12 + idx * 7 }));
    }
  });

  const [loading] = useState<boolean>(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jabute_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState<boolean>(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('jabute_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Delivery Location State & Auto-Detection
  const [deliveryLocation, setDeliveryLocationState] = useState<DeliveryLocation>(() => {
    try {
      const saved = localStorage.getItem('jabute_delivery_location');
      if (saved) return JSON.parse(saved);
    } catch {}
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        const parts = tz.split('/');
        const city = parts[parts.length - 1].replace(/_/g, ' ');
        return {
          city,
          country: parts[0] || 'Global',
          formattedAddress: city,
          isAutoDetected: true
        };
      }
    } catch {}
    return {
      city: 'Detecting...',
      country: 'United States',
      formattedAddress: 'Detecting location...',
      isAutoDetected: true
    };
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  const setDeliveryLocation = (loc: DeliveryLocation) => {
    setDeliveryLocationState(loc);
    try {
      localStorage.setItem('jabute_delivery_location', JSON.stringify(loc));
    } catch {}
  };

  const updateDeliveryAddress = (updates: Partial<DeliveryLocation>) => {
    setDeliveryLocationState((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('jabute_delivery_location', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const detectUserLocation = async (): Promise<DeliveryLocation> => {
    setIsDetectingLocation(true);
    try {
      // 1. Try Browser HTML5 Geolocation API
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 6000,
              maximumAge: 300000
            });
          });

          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || 'Your City';
            const postalCode = data.postcode || '';
            const country = data.countryName || 'Global';
            const countryCode = data.countryCode || '';
            const loc: DeliveryLocation = {
              city,
              region: data.principalSubdivision,
              postalCode,
              country,
              countryCode,
              formattedAddress: postalCode ? `${city}, ${postalCode}` : `${city}, ${country}`,
              isAutoDetected: true,
              latitude: lat,
              longitude: lng
            };
            setDeliveryLocation(loc);
            return loc;
          }
        } catch {
          // Geolocation was denied or timed out; proceed to IP lookup
        }
      }

      // 2. Client-side IP lookup fallback
      try {
        const ipRes = await fetch('https://ipwho.is/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.success !== false && ipData.city) {
            const loc: DeliveryLocation = {
              city: ipData.city,
              region: ipData.region,
              postalCode: ipData.postal || '',
              country: ipData.country || 'Global',
              countryCode: ipData.country_code || '',
              formattedAddress: ipData.postal ? `${ipData.city}, ${ipData.postal}` : `${ipData.city}, ${ipData.country}`,
              isAutoDetected: true,
              latitude: ipData.latitude,
              longitude: ipData.longitude
            };
            setDeliveryLocation(loc);
            return loc;
          }
        }
      } catch {
        // IP lookup unavailable
      }

      // 3. Timezone heuristic fallback
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const city = tz ? tz.split('/')[tz.split('/').length - 1].replace(/_/g, ' ') : 'Local Area';
      const loc: DeliveryLocation = {
        city,
        country: 'Global',
        formattedAddress: city,
        isAutoDetected: true
      };
      setDeliveryLocation(loc);
      return loc;
    } finally {
      setIsDetectingLocation(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('jabute_delivery_location');
    if (!saved) {
      detectUserLocation();
    }
  }, []);

  // AI Assistant Chatbot Drawer State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | null>(null);

  // Firebase Auth State
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginWithGoogle = async (): Promise<AuthUser | null> => {
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        setUser(loggedUser);
      }
      return loggedUser;
    } catch (e: any) {
      if (
        e?.code === 'auth/popup-closed-by-user' ||
        e?.code === 'auth/cancelled-popup-request' ||
        e?.code === 'auth/user-cancelled'
      ) {
        return null;
      }
      console.warn('Google login notice:', e?.message || e);
      throw e;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<AuthUser> => {
    try {
      const loggedUser = await signInWithEmailPassword(email, pass);
      setUser(loggedUser);
      return loggedUser;
    } catch (e: any) {
      console.warn('Email sign in notice:', e?.message || e);
      throw e;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name?: string): Promise<AuthUser> => {
    try {
      const createdUser = await signUpWithEmailPassword(email, pass, name);
      setUser(createdUser);
      return createdUser;
    } catch (e: any) {
      console.warn('Email sign up notice:', e?.message || e);
      throw e;
    }
  };

  const resetPasswordEmail = async (email: string): Promise<void> => {
    try {
      await sendPasswordReset(email);
    } catch (e: any) {
      console.warn('Reset password notice:', e?.message || e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Store Customer',
          photoURL: firebaseUser.photoURL,
          role: isAuthorizedAdmin(firebaseUser.email) ? 'admin' : 'customer',
          lastLoginAt: new Date().toISOString(),
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
        };
        setUser(authUser);
        syncUserProfile(authUser).catch(console.error);

        // Fetch user's cart from Firestore
        try {
          const remoteCart = await getUserCart(firebaseUser.uid);
          if (remoteCart && remoteCart.length > 0) {
            setCart(remoteCart);
          }
        } catch (err) {
          console.error('Error fetching remote cart:', err);
        }

        // Fetch user's wishlist from Firestore
        try {
          const remoteWishlistIds = await getUserWishlist(firebaseUser.uid);
          if (remoteWishlistIds && remoteWishlistIds.length > 0) {
            const matchedWishlist = products.filter((p) => remoteWishlistIds.includes(p.id));
            if (matchedWishlist.length > 0) {
              setWishlist(matchedWishlist);
            }
          }
        } catch (err) {
          console.error('Error fetching remote wishlist:', err);
        }

        // Fetch user's orders from Firestore
        try {
          const remoteOrders = await fetchFirestoreOrders(firebaseUser.uid);
          if (remoteOrders && remoteOrders.length > 0) {
            setOrders((prev) => {
              const ids = new Set(prev.map((o) => o.id));
              const newItems = remoteOrders.filter((o) => !ids.has(o.id));
              return [...newItems, ...prev];
            });
          }
        } catch (err) {
          console.error('Error fetching remote orders:', err);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [products]);

  // Sync cart to Firestore when user is signed in
  useEffect(() => {
    if (user?.uid) {
      saveUserCart(user.uid, cart).catch(console.error);
    }
  }, [cart, user?.uid]);

  // Sync wishlist to Firestore when user is signed in
  useEffect(() => {
    if (user?.uid) {
      saveUserWishlist(user.uid, wishlist.map((p) => p.id)).catch(console.error);
    }
  }, [wishlist, user?.uid]);

  const openChatWithPrompt = (prompt?: string) => {
    if (prompt) {
      setChatInitialPrompt(prompt);
    }
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  // Navigation & Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'product-detail' | 'checkout' | 'orders' | 'wishlist' | 'admin' | 'order-success'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('jabute_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('jabute_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('jabute_categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('jabute_promos', JSON.stringify(promos));
    } catch (e) {
      console.error('Failed to save promos to localStorage', e);
    }
  }, [promos]);

  useEffect(() => {
    try {
      localStorage.setItem('jabute_settings', JSON.stringify(storeSettings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [storeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('jabute_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('jabute_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('jabute_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Toast Helpers
  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, description, type, timestamp: Date.now() };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const chosenColor = color || (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    const chosenSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === chosenColor &&
          item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(next[existingIndex].quantity + quantity, product.stock);
        next[existingIndex].quantity = newQty;
        return next;
      } else {
        return [...prev, { product, quantity: Math.min(quantity, product.stock), selectedColor: chosenColor, selectedSize: chosenSize }];
      }
    });

    addToast(`Added to Bag`, `${product.name} (x${quantity})`, 'success');
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
    addToast('Item removed', 'Product removed from your shopping bag', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          const maxStock = item.product.stock;
          const finalQty = Math.min(quantity, maxStock);
          if (quantity > maxStock) {
            addToast('Max stock reached', `Only ${maxStock} items available`, 'warning');
          }
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (inputCode: string) => {
    const clean = inputCode.trim().toUpperCase();
    const promo = PROMO_CODES.find((p) => p.code === clean);

    if (!promo) {
      addToast('Invalid Code', 'The promo code entered does not exist.', 'error');
      return { success: false, message: 'Invalid promo code' };
    }

    if (promo.minSpend && cartSubtotal < promo.minSpend) {
      const msg = `Minimum spend of $${promo.minSpend} required for code ${promo.code}.`;
      addToast('Requirement Not Met', msg, 'warning');
      return { success: false, message: msg };
    }

    setAppliedPromo(promo);
    addToast('Coupon Applied!', `${promo.description}`, 'success');
    return { success: true, message: promo.description };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    addToast('Promo removed', 'Discount code removed from order', 'info');
  };

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return (cartSubtotal * appliedPromo.discountPercentage) / 100;
  }, [appliedPromo, cartSubtotal]);

  const shippingCost = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (appliedPromo?.code === 'FREESHIP') return 0;
    return cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  }, [cartSubtotal, appliedPromo]);

  const amountNeededForFreeShipping = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  }, [cartSubtotal]);

  const cartTotal = useMemo(() => {
    const tax = cartSubtotal * 0.07; // 7% standard sales tax
    return Math.max(0, cartSubtotal - discountAmount + shippingCost + tax);
  }, [cartSubtotal, discountAmount, shippingCost]);

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      addToast('Removed from Wishlist', product.name, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast('Saved to Wishlist', product.name, 'success');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Quick View & Detail
  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const viewProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter actions
  const setPriceFilter = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
    setMinPrice(0);
    setMaxPrice(1000);
    setInStockOnly(false);
    setSelectedTag(null);
  };

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(
        (p) => p.categorySlug === selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Price range
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // In Stock
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    // Tag
    if (selectedTag) {
      list = list.filter((p) => p.tags.includes(selectedTag.toLowerCase()));
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popularity':
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, inStockOnly, selectedTag, sortBy]);

  // Store Owner (Admin) Product Operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `jab-prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      reviewsList: [
        {
          id: `rev-${Date.now()}`,
          author: 'JABUTE Store Verified',
          rating: 5,
          date: 'Just now',
          comment: 'Official retail product release verified by store owner.',
          verified: true
        }
      ]
    };

    setProducts((prev) => [newProduct, ...prev]);
    addToast('Product Added', `"${newProduct.name}" is now live on JABUTE`, 'success');
    return newProduct;
  };

  const editProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    addToast('Product Updated', 'Product changes saved successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product Deleted', `Removed "${target?.name || id}" from catalog`, 'info');
  };

  // Store Owner Category Operations
  const addCategory = (catData: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('Category Created', `Added category "${newCat.name}"`, 'success');
    return newCat;
  };

  const editCategory = (id: string, updatedData: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    addToast('Category Updated', 'Category details updated', 'success');
  };

  const restockProduct = (id: string, amount: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + amount);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
    addToast('Inventory Updated', `Stock adjusted by ${amount > 0 ? `+${amount}` : amount} units`, 'success');
  };

  const duplicateProduct = (id: string) => {
    const orig = products.find((p) => p.id === id);
    if (!orig) return;
    const cloned: Product = {
      ...orig,
      id: `jab-prod-${Date.now()}`,
      name: `${orig.name} (Copy)`,
      sku: `JAB-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) => [cloned, ...prev]);
    addToast('Product Duplicated', `Created duplicate "${cloned.name}"`, 'success');
  };

  // Promo operations
  const addPromoCode = (newPromo: PromoCode) => {
    const cleanCode = newPromo.code.trim().toUpperCase();
    if (promos.some((p) => p.code.toUpperCase() === cleanCode)) {
      addToast('Code Exists', 'A coupon with this code already exists', 'error');
      return;
    }
    const item: PromoCode = {
      ...newPromo,
      id: `promo-${Date.now()}`,
      code: cleanCode,
      active: true,
      usageCount: 0
    };
    setPromos((prev) => [item, ...prev]);
    addToast('Coupon Created', `Promo code "${cleanCode}" is now active`, 'success');
  };

  const deletePromoCode = (code: string) => {
    setPromos((prev) => prev.filter((p) => p.code.toUpperCase() !== code.toUpperCase()));
    addToast('Coupon Removed', `Code "${code}" has been deleted`, 'info');
  };

  const togglePromoCode = (code: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.code.toUpperCase() === code.toUpperCase() ? { ...p, active: !p.active } : p))
    );
    addToast('Coupon Status Changed', `Toggled status for "${code}"`, 'success');
  };

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Settings Saved', 'Store configuration updated successfully', 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    addToast('Order Deleted', `Order #${orderId} removed from records`, 'info');
  };

  const resetStoreToDefaults = () => {
    setProducts(MOCK_PRODUCTS);
    setCategories(CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setPromos(PROMO_CODES.map((p, idx) => ({ ...p, id: `promo-${idx + 1}`, active: true, usageCount: 12 + idx * 7 })));
    setStoreSettings(DEFAULT_STORE_SETTINGS);
    localStorage.removeItem('jabute_products');
    localStorage.removeItem('jabute_categories');
    localStorage.removeItem('jabute_orders');
    localStorage.removeItem('jabute_promos');
    localStorage.removeItem('jabute_settings');
    addToast('Store Reset', 'Demo products, categories, orders & settings restored to factory defaults', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('Category Deleted', 'Category removed from store', 'info');
  };

  // Order Operations
  const placeOrder = async (customer: any, paymentMethod: any, deliveryOption: any = 'standard'): Promise<Order> => {
    const tax = cartSubtotal * 0.07;
    const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost + tax);

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      costPrice: item.product.costPrice || item.product.price * 0.45,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      image: item.product.images[0]
    }));

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingCartItem = cart.find((ci) => ci.product.id === prod.id);
        if (matchingCartItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - matchingCartItem.quantity)
          };
        }
        return prod;
      })
    );

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: user?.uid,
      orderNumber: `JAB-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      items: orderItems,
      customer,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingCost,
      tax,
      total: finalTotal,
      status: 'Processing',
      paymentMethod,
      deliveryOption,
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}-US`,
      carrier: deliveryOption === 'express' ? 'FedEx Express' : 'USPS Priority',
      estimatedDelivery: deliveryOption === 'express' ? '1-2 Business Days' : '3-4 Business Days'
    };

    // Save to Firestore for durable persistence
    saveOrderToFirestore(newOrder).catch((err) =>
      console.error('Failed to persist order to Firestore:', err)
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    setActiveView('order-success');
    addToast('Order Placed Successfully!', `Order #${newOrder.orderNumber}`, 'success');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], trackingNumber?: string, carrier?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            trackingNumber: trackingNumber || o.trackingNumber,
            carrier: carrier || o.carrier
          };
        }
        return o;
      })
    );
    updateFirestoreOrderStatus(orderId, status, trackingNumber, carrier).catch((err) =>
      console.error('Failed to update order status in Firestore:', err)
    );
    addToast('Order Updated', `Order #${orderId} set to ${status}`, 'success');
  };

  // Owner Financial Analytics
  const storeAnalytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
    
    let totalCost = 0;
    orders.forEach((o) => {
      if (o.status !== 'Cancelled') {
        o.items.forEach((item) => {
          totalCost += (item.costPrice || item.price * 0.45) * item.quantity;
        });
      }
    });

    const totalProfit = Math.max(0, totalRevenue - totalCost);
    const lowStockCount = products.filter((p) => p.stock < 15).length;

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      totalOrdersCount: orders.length,
      totalProductsCount: products.length,
      lowStockCount
    };
  }, [orders, products]);

  const isAdmin = Boolean(user && isAuthorizedAdmin(user.email));

  return (
    <ShopContext.Provider
      value={{
        user,
        isAdmin,
        authLoading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPasswordEmail,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        products,
        categories,
        loading,
        filteredProducts,
        addProduct,
        editProduct,
        deleteProduct,
        restockProduct,
        duplicateProduct,
        addCategory,
        editCategory,
        deleteCategory,
        promos,
        addPromoCode,
        deletePromoCode,
        togglePromoCode,
        storeSettings,
        updateStoreSettings,
        resetStoreToDefaults,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        minPrice,
        maxPrice,
        setPriceFilter,
        inStockOnly,
        setInStockOnly,
        selectedTag,
        setSelectedTag,
        resetFilters,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        shippingCost,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isAppMenuOpen,
        setIsAppMenuOpen,
        deliveryLocation,
        setDeliveryLocation,
        updateDeliveryAddress,
        detectUserLocation,
        isDetectingLocation,
        isChatOpen,
        setIsChatOpen,
        chatInitialPrompt,
        openChatWithPrompt,
        closeChat,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        activeView,
        setActiveView,
        selectedProductId,
        viewProductDetail,
        toasts,
        addToast,
        removeToast,
        orders,
        lastPlacedOrder,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        storeAnalytics
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
