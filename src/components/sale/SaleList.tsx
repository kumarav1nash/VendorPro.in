import { useEffect, useState } from 'react';
import { DummySale, DummySaleItem } from '../../types/dummy';
import { dummyDataService } from '../../services/dummyData';

interface SaleListProps {
  shopId: string;
}

export const SaleList = ({ shopId }: SaleListProps) => {
  const [sales, setSales] = useState<DummySale[]>([]);
  const [saleItems, setSaleItems] = useState<Record<string, DummySaleItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesResponse = await dummyDataService.getSales(shopId);
        if (!salesResponse.success) {
          throw new Error('Failed to fetch sales');
        }

        setSales(salesResponse.data);

        // Fetch sale items for each sale
        const itemsPromises = salesResponse.data.map(async (sale) => {
          const itemsResponse = await dummyDataService.getSaleItems(sale.id);
          if (itemsResponse.success) {
            return { saleId: sale.id, items: itemsResponse.data };
          }
          return { saleId: sale.id, items: [] };
        });

        const itemsResults = await Promise.all(itemsPromises);
        const itemsMap = itemsResults.reduce((acc, { saleId, items }) => {
          acc[saleId] = items;
          return acc;
        }, {} as Record<string, DummySaleItem[]>);

        setSaleItems(itemsMap);
      } catch (err) {
        setError('An error occurred while fetching sales');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [shopId]);

  if (loading) return <div>Loading sales...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <div key={sale.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sale #{sale.id}</h3>
            <span className={`px-2 py-1 rounded-full text-sm ${
              sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              sale.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {sale.status}
            </span>
          </div>
          <p className="text-gray-600">Total Amount: ₹{sale.total_amount}</p>
          
          <div className="mt-4">
            <h4 className="font-medium">Items:</h4>
            <ul className="mt-2 space-y-2">
              {saleItems[sale.id]?.map((item) => (
                <li key={item.id} className="text-sm text-gray-600">
                  Product ID: {item.product_id} - Quantity: {item.quantity} - Price: ₹{item.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}; 