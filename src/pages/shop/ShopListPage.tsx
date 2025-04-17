import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyDataService';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';

export const ShopListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadShops = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Current user:', user); // Debug log

        const response = await dummyDataService.getShops();
        if (!response.success) {
          throw new Error(response.error || 'Failed to load shops');
        }

        // Filter shops based on user role
        let filteredShops = response.data || [];
        if (user?.role === 'shop_owner') {
          // Only show shops where the current user is the owner
          filteredShops = filteredShops.filter(shop => {
            console.log('Shop owner_id:', shop.owner_id, 'User id:', user.id); // Debug log
            return shop.owner_id === user.id;
          });
          console.log('Filtered shops for owner:', filteredShops); // Debug log
        } else if (user?.role === 'salesman') {
          // Show shops where the current user is assigned as a salesman
          filteredShops = filteredShops.filter(shop => shop.shop_salesmen?.includes(user.id));
        }
        // Admin users will see all shops

        setShops(filteredShops);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load shops');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadShops();
    }
  }, [user]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (shops.length === 0) {
    return (
      <EmptyState
        title="No Shops Found"
        description={
          user?.role === 'salesman'
            ? "You haven't been assigned to any shops yet."
            : user?.role === 'shop_owner'
            ? "You haven't created any shops yet."
            : "No shops available."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
        {user?.role === 'shop_owner' && (
          <Button onClick={() => navigate('/shops/add')}>Add Shop</Button>
        )}
      </div>

      <Table
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Address', accessor: 'address' },
          { header: 'Phone', accessor: 'phone' },
          { header: 'Email', accessor: 'email' },
          { header: 'GST Number', accessor: 'gst_number' },
          {
            header: 'Actions',
            accessor: 'id',
            render: (id) => (
              <div className="space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/shops/${id}`)}
                >
                  View
                </Button>
                {user?.role === 'shop_owner' && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/shops/${id}/edit`)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            ),
          },
        ]}
        data={shops}
      />
    </div>
  );
}; 