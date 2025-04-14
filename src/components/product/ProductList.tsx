import { useEffect, useState } from 'react';
import { DummyProduct } from '../../types/dummy';
import { dummyDataService } from '../../services/dummyData';

interface ProductListProps {
  shopId: string;
}

export const ProductList = ({ shopId }: ProductListProps) => {
  const [products, setProducts] = useState<DummyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await dummyDataService.getProducts(shopId);
        if (response.success) {
          setProducts(response.data);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError('An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <div className="mt-2">
            <p className="text-sm text-gray-500">Base Price: ₹{product.base_price}</p>
            <p className="text-sm text-gray-500">Selling Price: ₹{product.selling_price}</p>
            <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
            <p className="text-sm text-gray-500">Status: {product.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}; 