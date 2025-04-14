import { useState, useEffect } from 'react';
import { DummyProduct, DummySale, DummySaleItem } from '../../types/dummy';
import { dummyDataService } from '../../services/dummyData';
import { Button } from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';

interface SalesEntryFormProps {
  shopId: string;
  salesmanId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

interface SelectedProduct extends DummyProduct {
  quantity: number;
  total: number;
}

export const SalesEntryForm = ({ shopId, salesmanId, onSuccess, onCancel }: SalesEntryFormProps) => {
  const [products, setProducts] = useState<DummyProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await dummyDataService.getProducts(shopId);
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('An error occurred while loading products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [shopId]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (product: DummyProduct) => {
    if (selectedProducts.some(p => p.id === product.id)) {
      setError('Product already added to sale');
      return;
    }

    setSelectedProducts([
      ...selectedProducts,
      {
        ...product,
        quantity: 1,
        total: product.selling_price
      }
    ]);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(selectedProducts.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          quantity,
          total: product.selling_price * quantity
        };
      }
      return product;
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleSubmit = async () => {
    try {
      if (selectedProducts.length === 0) {
        setError('Please add at least one product to the sale');
        return;
      }

      const totalAmount = selectedProducts.reduce((sum, product) => sum + product.total, 0);

      const sale: Omit<DummySale, 'id' | 'created_at' | 'updated_at'> = {
        shop_id: shopId,
        salesman_id: salesmanId,
        total_amount: totalAmount,
        status: 'pending'
      };

      const saleItems = selectedProducts.map(product => ({
        product_id: product.id,
        quantity: product.quantity,
        price: product.selling_price
      }));

      const response = await dummyDataService.createSale(sale, saleItems);
      if (response.success) {
        setSuccess('Sale created successfully');
        onSuccess();
      } else {
        setError(response.error || 'Failed to create sale');
      }
    } catch (err) {
      setError('An error occurred while creating the sale');
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Add Products</h2>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-96 overflow-y-auto">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded mb-2"
                >
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">₹{product.selling_price}</p>
                  </div>
                  <Button
                    onClick={() => handleAddProduct(product)}
                    disabled={selectedProducts.some(p => p.id === product.id)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Selected Products</h2>
          <Table
            columns={[
              { header: 'Product', accessor: 'name' },
              { header: 'Price', accessor: 'selling_price' },
              { header: 'Quantity', accessor: 'quantity' },
              { header: 'Total', accessor: 'total' },
              { header: 'Actions', accessor: 'actions' }
            ]}
            data={selectedProducts.map(product => ({
              ...product,
              selling_price: `₹${product.selling_price}`,
              quantity: (
                <Input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                  className="w-20"
                />
              ),
              total: `₹${product.total}`,
              actions: (
                <Button
                  variant="danger"
                  onClick={() => handleRemoveProduct(product.id)}
                >
                  Remove
                </Button>
              )
            }))}
          />
          <div className="mt-4 flex justify-between items-center">
            <div className="text-lg font-medium">
              Total: ₹{selectedProducts.reduce((sum, product) => sum + product.total, 0)}
            </div>
            <div className="space-x-4">
              {onCancel && (
                <Button variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSubmit}>
                Create Sale
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 