import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyData';
import { DummyProduct } from '../../types/dummy';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';

export const ProductListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<DummyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        if (!user) return;
        
        const response = await dummyDataService.getProducts(user.id);
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError(response.error || 'Failed to load products');
        }
      } catch (err) {
        setError('An error occurred while loading products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [user]);

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={handleAddProduct}>Add Product</Button>
      </div>

      <Table
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Description', accessor: 'description' },
          { header: 'Base Price', accessor: 'base_price' },
          { header: 'Selling Price', accessor: 'selling_price' },
          { header: 'Quantity', accessor: 'quantity' },
          { header: 'Status', accessor: 'status' },
        ]}
        data={products}
      />
    </div>
  );
}; 