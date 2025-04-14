import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ProductForm } from '../../components/product/ProductForm';
import { dummyDataService } from '../../services/dummyData';
import { useState, useEffect } from 'react';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';

export const ProductAddPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadShop = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        if (user.role === 'shop_owner') {
          // For shop owners, get their first shop
          const shopsResponse = await dummyDataService.getShops();
          if (shopsResponse.success && shopsResponse.data) {
            const userShop = shopsResponse.data.find(shop => shop.owner_id === user.id);
            if (userShop) {
              setShopId(userShop.id);
            } else {
              setError('No shop found for this user');
            }
          }
        } else if (user.role === 'salesman') {
          // For salesmen, get their first assigned shop
          const shopsResponse = await dummyDataService.getShops();
          if (shopsResponse.success && shopsResponse.data) {
            const assignedShop = shopsResponse.data.find(shop => 
              shop.shop_salesmen?.includes(user.id)
            );
            if (assignedShop) {
              setShopId(assignedShop.id);
            } else {
              setError('No shop assigned to this salesman');
            }
          }
        }
      } catch (err) {
        setError('Failed to load shop information');
        console.error('Error loading shop:', err);
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [user]);

  const handleSuccess = () => {
    navigate('/products');
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!shopId) {
    return <ErrorMessage message="No shop available to add products" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to add a new product to your inventory.
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Products
          </button>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ProductForm 
              shopId={shopId} 
              onSuccess={handleSuccess} 
              onCancel={handleCancel} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 