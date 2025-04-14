import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { LoginPage } from './pages/auth/LoginPage';
import { ShopListPage } from './pages/shop/ShopListPage';
import { ShopDetailsPage } from './pages/shop/ShopDetailsPage';
import { ShopDashboardPage } from './pages/shop/ShopDashboardPage';
import { ProductListPage } from './pages/product/ProductListPage';
import { ProductAddPage } from './pages/product/ProductAddPage';
import { ProductDetailsPage } from './pages/product/ProductDetailsPage';
import { ProductEditPage } from './pages/product/ProductEditPage';
import { SaleListPage } from './pages/sale/SaleListPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import SalesmanAddPage from './pages/salesman/SalesmanAddPage';
import { SalesmanListPage } from './pages/salesman/SalesmanListPage';
import { SalesEntryPage } from './pages/sale/SalesEntryPage';
import { SaleDetailsPage } from './pages/sale/SaleDetailsPage';
import { CommissionStructurePage } from './pages/commission/CommissionStructurePage';

export const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
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
              <Route
                path="products/add"
                element={
                  <ProtectedRoute roles={['shop_owner']}>
                    <ProductAddPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products/:productId"
                element={
                  <ProtectedRoute roles={['shop_owner']}>
                    <ProductDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products/:productId/edit"
                element={
                  <ProtectedRoute roles={['shop_owner']}>
                    <ProductEditPage />
                  </ProtectedRoute>
                }
              />

              {/* Sales Routes */}
              <Route path="sales" element={<SaleListPage />} />
              <Route path="sales/new" element={<SalesEntryPage />} />
              <Route path="sales/:saleId" element={<SaleDetailsPage />} />

              {/* Salesman Routes - Only accessible by shop owners */}
              <Route
                path="salesmen"
                element={
                  <ProtectedRoute roles={['shop_owner']}>
                    <SalesmanListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="salesmen/add"
                element={
                  <ProtectedRoute roles={['shop_owner']}>
                    <SalesmanAddPage />
                  </ProtectedRoute>
                }
              />

              {/* Commission Routes - Only accessible by shop owners */}
              <Route
                path="commission"
                element={
                  <ProtectedRoute roles={['shop_owner']}>
                    <CommissionStructurePage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};
