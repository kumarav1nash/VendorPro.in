import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyDataService';
import { DummyShop, DummyProduct, DummySale } from '../../types/dummy';
import Card from '../../components/ui/Card';
import { CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';

export const ShopDashboardPage = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState<DummyShop | null>(null);
  const [products, setProducts] = useState<DummyProduct[]>([]);
  const [sales, setSales] = useState<DummySale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load shop data
        const shopResponse = await dummyDataService.getShops();
        console.log("shop data",shopResponse)
        if (shopResponse.success && shopResponse.data && shopResponse.data.length > 0) {
          setShop(shopResponse.data[0]); // For now, just use the first shop, TODO
        }

        // Load products
        const productsResponse = await dummyDataService.getProducts(shop?.id || '');
        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data);
        }

        // Load sales
        const salesResponse = await dummyDataService.getSales(shop?.id || '');
        if (salesResponse.success && salesResponse.data) {
          setSales(salesResponse.data);
        }

      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    
    loadDashboardData();
  }, [shop]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const totalProducts = products.length;
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const lowStockProducts = products.filter(p => p.quantity < 10).length;
  console.log("total product : ",totalProducts,products);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex space-x-4">
          <Button variant="primary">Add Product</Button>
          <Button variant="secondary">View Reports</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-full bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-semibold text-gray-900">{totalProducts}</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                  <dd className="text-lg font-semibold text-gray-900">{totalSales}</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-full bg-yellow-100">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-semibold text-gray-900">₹{totalRevenue.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                  <dd className="text-lg font-semibold text-gray-900">{lowStockProducts}</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Sales</h3>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Amount', accessor: 'total_amount', render: (value) => `₹${value.toFixed(2)}` },
              { header: 'Status', accessor: 'status' },
              { header: 'Date', accessor: 'created_at', render: (value) => new Date(value).toLocaleDateString() },
            ]}
            data={sales.slice(0, 5)}
          />
        </CardBody>
      </Card>

      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Low Stock Products</h3>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Quantity', accessor: 'quantity' },
              { header: 'Price', accessor: 'selling_price', render: (value) => `₹${value.toFixed(2)}` },
              { header: 'Status', accessor: 'status' },
            ]}
            data={products.filter(p => p.quantity < 10).slice(0, 5)}
          />
        </CardBody>
      </Card>
    </div>
  );
}; 