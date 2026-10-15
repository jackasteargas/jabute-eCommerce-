import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/common/Header';
import { CartDrawer } from './components/common/CartDrawer';
import { AppMenuDrawer } from './components/common/AppMenuDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { ProductDetailView } from './components/views/ProductDetailView';
import { CheckoutView } from './components/views/CheckoutView';
import { OrderSuccessView } from './components/views/OrderSuccessView';
import { OrderHistoryView } from './components/views/OrderHistoryView';
import { WishlistView } from './components/views/WishlistView';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainContent: React.FC = () => {
  const { activeView, setActiveView, isAdmin, user } = useShop();

  const isVerifiedOwner = Boolean(
    isAdmin && user && user.email?.toLowerCase().trim() === 'jackasteargas@gmail.com'
  );

  React.useEffect(() => {
    if (activeView === 'admin' && !isVerifiedOwner) {
      setActiveView('home');
    }
  }, [activeView, isVerifiedOwner, setActiveView]);

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 w-full overflow-x-hidden">
      <Header />

      <main className="flex-1 w-full">
        {activeView === 'home' && <FeaturedProducts />}

        {activeView === 'product-detail' && <ProductDetailView />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'order-success' && <OrderSuccessView />}
        {activeView === 'orders' && <OrderHistoryView />}
        {activeView === 'wishlist' && <WishlistView />}
        {activeView === 'admin' && (isVerifiedOwner ? <AdminDashboard /> : <FeaturedProducts />)}
      </main>

      <CartDrawer />
      <AppMenuDrawer />
      <QuickViewModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
