import { useEffect, useState } from 'react';
import { DummyShop } from '../../types/dummy';
import { dummyDataService } from '../../services/dummyData';

export const ShopList = () => {
  const [shops, setShops] = useState<DummyShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await dummyDataService.getShops();
        if (response.success) {
          setShops(response.data);
        } else {
          setError('Failed to fetch shops');
        }
      } catch (err) {
        setError('An error occurred while fetching shops');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) return <div>Loading shops...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shops.map((shop) => (
        <div key={shop.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold">{shop.name}</h3>
          <p className="text-gray-600">{shop.address}</p>
          <p className="text-gray-600">{shop.phone}</p>
          <p className="text-gray-600">{shop.email}</p>
          <p className="text-gray-600">GST: {shop.gst_number}</p>
        </div>
      ))}
    </div>
  );
}; 