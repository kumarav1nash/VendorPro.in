import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SalesEntryForm } from '../../components/sale/SalesEntryForm';
import { dummyDataService } from '../../services/dummyData';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';

export const SalesEntryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadShopId = async () => {
      try {
        if (!user) return;

        // For shop owners, use their own shop ID
        if (user.role === 'shop_owner') {
          setShopId(user.id);
          setLoading(false);
          return;
        }

        // For salesmen, find their assigned shop
        const shopsResponse = await dummyDataService.getShops();
        if (shopsResponse.success && shopsResponse.data) {
          const assignedShop = shopsResponse.data.find(shop => 
            shop.shop_salesmen.includes(user.id)
          );
          
          if (assignedShop) {
            setShopId(assignedShop.id);
          } else {
            setError('No shop assigned to this salesman');
          }
        } else {
          setError('Failed to load shop information');
        }
      } catch (err) {
        setError('An error occurred while loading shop information');
      } finally {
        setLoading(false);
      }
    };

    loadShopId();
  }, [user]);

  const handleSuccess = () => {
    navigate('/sales');
  };

  const handleCancel = () => {
    navigate('/sales');
  };

  if (loading) return <LoadingState message="Loading shop information..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!shopId) return <ErrorMessage message="No shop found" onRetry={() => window.location.reload()} />;

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold mb-6">New Sale</h1>
            <SalesEntryForm
              shopId={shopId}
              salesmanId={user?.id || ''}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 