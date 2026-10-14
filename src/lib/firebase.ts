import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  Firestore,
  orderBy,
  limit
} from 'firebase/firestore';
import { AuthUser, Order, CartItem, ProductReview } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: firebaseConfigData.projectId || '',
  appId: firebaseConfigData.appId || '',
  apiKey: firebaseConfigData.apiKey || '',
  authDomain: firebaseConfigData.authDomain || `${firebaseConfigData.projectId}.firebaseapp.com`,
  firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId || '(default)',
  storageBucket: firebaseConfigData.storageBucket || `${firebaseConfigData.projectId}.firebasestorage.app`,
  messagingSenderId: firebaseConfigData.messagingSenderId || ''
};

// Initialize Firebase App instance
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore (pass custom database ID if available)
export const db: Firestore = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Format Firebase Auth errors into friendly user messages
 */
export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials or create an account.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please sign in or reset your password.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed attempts. Try resetting your password or try again later.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign in popup was closed.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    default:
      return error.message || 'Authentication failed. Please check your credentials.';
  }
}

/**
 * Sign In with Google popup
 */
export async function signInWithGoogle(): Promise<AuthUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (!user) return null;

    const authUser: AuthUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Store Customer',
      photoURL: user.photoURL,
      role: user.email?.includes('admin') || user.email === 'jackasteargas@gmail.com' ? 'admin' : 'customer',
      lastLoginAt: new Date().toISOString(),
      createdAt: user.metadata.creationTime || new Date().toISOString()
    };

    // Upsert user profile into Firestore
    await syncUserProfile(authUser);
    return authUser;
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/user-cancelled'
    ) {
      return null;
    }
    console.warn('Firebase Google Sign-In notification:', error?.message || error);
    throw error;
  }
}

/**
 * Sign In with Email and Password
 */
export async function signInWithEmailPassword(email: string, pass: string): Promise<AuthUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const user = userCredential.user;

    const authUser: AuthUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Store Customer',
      photoURL: user.photoURL,
      role: user.email?.includes('admin') || user.email === 'jackasteargas@gmail.com' ? 'admin' : 'customer',
      lastLoginAt: new Date().toISOString(),
      createdAt: user.metadata.creationTime || new Date().toISOString()
    };

    await syncUserProfile(authUser);
    return authUser;
  } catch (error: any) {
    console.warn('Firebase Email Sign-In Error:', error?.code || error);
    throw error;
  }
}

/**
 * Sign Up with Email, Password and Display Name
 */
export async function signUpWithEmailPassword(email: string, pass: string, name?: string): Promise<AuthUser> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const user = userCredential.user;

    const trimmedName = name?.trim() || email.split('@')[0] || 'Store Customer';

    // Update Firebase Auth profile displayName
    if (trimmedName) {
      try {
        await updateProfile(user, { displayName: trimmedName });
      } catch (profileErr) {
        console.warn('Failed to update profile displayName:', profileErr);
      }
    }

    const authUser: AuthUser = {
      uid: user.uid,
      email: user.email,
      displayName: trimmedName,
      photoURL: null,
      role: user.email?.includes('admin') || user.email === 'jackasteargas@gmail.com' ? 'admin' : 'customer',
      lastLoginAt: new Date().toISOString(),
      createdAt: user.metadata.creationTime || new Date().toISOString()
    };

    await syncUserProfile(authUser);
    return authUser;
  } catch (error: any) {
    console.warn('Firebase Email Sign-Up Error:', error?.code || error);
    throw error;
  }
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error: any) {
    console.warn('Firebase Password Reset Error:', error?.code || error);
    throw error;
  }
}

/**
 * Sign Out
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase Sign-Out Error:', error);
    throw error;
  }
}

/**
 * Sync / Save user profile to Firestore
 */
export async function syncUserProfile(user: AuthUser): Promise<void> {
  if (!user.uid) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const payload: any = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role: user.role || 'customer',
      lastLoginAt: new Date().toISOString()
    };

    if (!snap.exists()) {
      payload.createdAt = user.createdAt || new Date().toISOString();
      payload.wishlist = [];
      await setDoc(userRef, payload);
    } else {
      await updateDoc(userRef, payload);
    }
  } catch (error) {
    console.error('Error syncing user profile to Firestore:', error);
  }
}

/**
 * Fetch user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<any | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Save user cart to Firestore
 */
export async function saveUserCart(uid: string, cartItems: CartItem[]): Promise<void> {
  if (!uid) return;
  try {
    const cartRef = doc(db, 'users', uid, 'cart', 'current');
    await setDoc(cartRef, {
      items: cartItems.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice || item.product.price,
          images: item.product.images,
          category: item.product.category,
          categorySlug: item.product.categorySlug,
          sku: item.product.sku,
          stock: item.product.stock,
          rating: item.product.rating,
          reviewCount: item.product.reviewCount,
          badge: item.product.badge || null,
          tags: item.product.tags || []
        },
        quantity: item.quantity,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null
      })),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving user cart to Firestore:', error);
  }
}

/**
 * Fetch user cart from Firestore
 */
export async function getUserCart(uid: string): Promise<CartItem[]> {
  if (!uid) return [];
  try {
    const cartRef = doc(db, 'users', uid, 'cart', 'current');
    const snap = await getDoc(cartRef);
    if (snap.exists() && snap.data().items) {
      return snap.data().items as CartItem[];
    }
    return [];
  } catch (error) {
    console.error('Error getting user cart from Firestore:', error);
    return [];
  }
}

/**
 * Save user wishlist to Firestore
 */
export async function saveUserWishlist(uid: string, wishlistProductIds: string[]): Promise<void> {
  if (!uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { wishlist: wishlistProductIds }, { merge: true });
  } catch (error) {
    console.error('Error saving user wishlist to Firestore:', error);
  }
}

/**
 * Fetch user wishlist from Firestore
 */
export async function getUserWishlist(uid: string): Promise<string[]> {
  if (!uid) return [];
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists() && snap.data().wishlist) {
      return snap.data().wishlist;
    }
    return [];
  } catch (error) {
    console.error('Error fetching user wishlist from Firestore:', error);
    return [];
  }
}

/**
 * Save Order to Firestore
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      createdAt: order.date || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
    throw error;
  }
}

/**
 * Fetch orders for a user or all orders
 */
export async function fetchFirestoreOrders(userId?: string): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    let q;
    if (userId) {
      q = query(ordersCol, where('userId', '==', userId));
    } else {
      q = query(ordersCol, limit(50));
    }
    const snapshot = await getDocs(q);
    const list: Order[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Order);
    });
    return list;
  } catch (error) {
    console.error('Error fetching orders from Firestore:', error);
    return [];
  }
}

/**
 * Update order status in Firestore
 */
export async function updateFirestoreOrderStatus(
  orderId: string,
  status: Order['status'],
  trackingNumber?: string,
  carrier?: string
): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (carrier !== undefined) updateData.carrier = carrier;

    await updateDoc(orderRef, updateData);
  } catch (error) {
    console.error('Error updating order in Firestore:', error);
    throw error;
  }
}

/**
 * Save review to Firestore
 */
export async function saveReviewToFirestore(
  reviewData: {
    id?: string;
    productId: string;
    productName?: string;
    userId?: string;
    author: string;
    rating: number;
    comment: string;
    verified?: boolean;
    date?: string;
  }
): Promise<void> {
  try {
    const reviewId = reviewData.id || `rev-${Date.now()}`;
    const reviewRef = doc(db, 'reviews', reviewId);
    await setDoc(reviewRef, {
      id: reviewId,
      productId: reviewData.productId,
      productName: reviewData.productName || '',
      userId: reviewData.userId || 'anonymous',
      author: reviewData.author,
      userName: reviewData.author,
      rating: reviewData.rating,
      comment: reviewData.comment,
      verified: reviewData.verified !== undefined ? reviewData.verified : true,
      createdAt: reviewData.date || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving review to Firestore:', error);
  }
}

/**
 * Fetch reviews for a specific product from Firestore
 */
export async function fetchProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    const reviewsCol = collection(db, 'reviews');
    const q = query(reviewsCol, where('productId', '==', productId), limit(25));
    const snapshot = await getDocs(q);
    const list: ProductReview[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: data.id || docSnap.id,
        author: data.author || data.userName || 'Verified Buyer',
        rating: data.rating || 5,
        date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Recent',
        comment: data.comment || '',
        verified: data.verified !== undefined ? data.verified : true
      });
    });
    return list;
  } catch (error) {
    console.error('Error fetching reviews from Firestore:', error);
    return [];
  }
}
