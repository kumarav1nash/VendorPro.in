import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { ShopListPage } from './pages/shop/ShopListPage';
import { ShopDetailsPage } from './pages/shop/ShopDetailsPage';
import { ShopDashboardPage } from './pages/shop/ShopDashboardPage';
import { ProductListPage } from './pages/product/ProductListPage';
import { SaleListPage } from './pages/sale/SaleListPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Shop Routes */}
            <Route path="dashboard" element={<ShopDashboardPage />} />
            <Route path="shops" element={<ShopListPage />} />
            <Route path="shops/:shopId" element={<ShopDetailsPage />} />

            {/* Product Routes - Only accessible by shop owners */}
            <Route
              path="products"
              element={
                <ProtectedRoute roles={['shop_owner']}>
                  <ProductListPage />
                </ProtectedRoute>
              }
            />

            {/* Sale Routes */}
            <Route path="sales" element={<SaleListPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};
