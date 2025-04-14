import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyData';
import { DummyShop } from '../../types/dummy';
import { ProductList } from '../../components/product/ProductList';
import { ProductForm } from '../../components/product/ProductForm';
import { SaleList } from '../../components/sale/SaleList';
import { SaleForm } from '../../components/sale/SaleForm';

type Tab = 'products' | 'sales';

export const ShopDetailsPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { user } = useAuth();
  const [shop, setShop] = useState<DummyShop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [key, setKey] = useState(0); // Used to force re-render of lists

  useEffect(() => {
    const fetchShop = async () => {
      if (!shopId) return;

      try {
        const response = await dummyDataService.getShop(shopId);
        if (!response.success || !response.data) {
          throw new Error('Failed to fetch shop details');
        }
        setShop(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setKey(prev => prev + 1); // Force list to re-fetch data
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-sm text-red-700">{error || 'Shop not found'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shop Header */}
      <div className="bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
          <div className="mt-1 text-sm text-gray-500">
            <p>{shop.address}</p>
            <p>Phone: {shop.phone}</p>
            <p>Email: {shop.email}</p>
            <p>GST: {shop.gst_number}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`${
              activeTab === 'products'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`${
              activeTab === 'sales'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Sales
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Action Button */}
        <div className="flex justify-end">
          {activeTab === 'products' && user?.role === 'shop_owner' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Product
            </button>
          )}
          {activeTab === 'sales' && user?.role === 'salesman' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Sale
            </button>
          )}
        </div>

        {/* Forms */}
        {showCreateForm && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {activeTab === 'products' ? 'Add New Product' : 'Create New Sale'}
                </h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
              {activeTab === 'products' ? (
                <ProductForm shopId={shopId!} onSuccess={handleCreateSuccess} />
              ) : (
                <SaleForm
                  shopId={shopId!}
                  salesmanId={user!.id}
                  products={[]} // TODO: Pass actual products
                  onSuccess={handleCreateSuccess}
                />
              )}
            </div>
          </div>
        )}

        {/* Lists */}
        {activeTab === 'products' ? (
          <ProductList key={`products-${key}`} shopId={shopId!} />
        ) : (
          <SaleList key={`sales-${key}`} shopId={shopId!} />
        )}
      </div>
    </div>
  );
}; 