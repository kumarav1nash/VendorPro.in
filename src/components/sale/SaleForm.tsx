import { useState } from 'react';
import { DummySale, DummySaleItem, DummyProduct } from '../../types/dummy';
import { dummyDataService } from '../../services/dummyDataService';

interface SaleFormProps {
  shopId: string;
  salesmanId: string;
  products: DummyProduct[];
  onSuccess: () => void;
}

interface SaleItemForm {
  product_id: string;
  quantity: number;
  price: number;
}

export const SaleForm = ({ shopId, salesmanId, products, onSuccess }: SaleFormProps) => {
  const [items, setItems] = useState<SaleItemForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: 0, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof SaleItemForm, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    // Update price based on product selection
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].price = product.selling_price;
      }
    }

    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create sale
      const saleResponse = await dummyDataService.createSale({
        shop_id: shopId,
        salesman_id: salesmanId,
        total_amount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      });

      if (!saleResponse.success) {
        throw new Error('Failed to create sale');
      }

      // Create sale items
      const saleId = saleResponse.data!.id; // Non-null assertion after success check
      const itemPromises = items.map(item =>
        dummyDataService.createSaleItem({
          sale_id: saleId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      );

      const itemResults = await Promise.all(itemPromises);
      const failedItems = itemResults.filter(result => !result.success);
      
      if (failedItems.length > 0) {
        throw new Error('Failed to create some sale items');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Item {index + 1}</h4>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div>
              <label htmlFor={`product-${index}`} className="block text-sm font-medium text-gray-700">
                Product
              </label>
              <select
                id={`product-${index}`}
                value={item.product_id}
                onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₹{product.selling_price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id={`quantity-${index}`}
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor={`price-${index}`} className="block text-sm font-medium text-gray-700">
                Price per unit
              </label>
              <input
                type="number"
                id={`price-${index}`}
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="text-right">
              <span className="font-medium">
                Total: ₹{(item.quantity * item.price).toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Item
        </button>
      </div>

      <div className="text-right">
        <span className="font-medium text-lg">
          Grand Total: ₹{items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Creating Sale...' : 'Create Sale'}
      </button>
    </form>
  );
}; 