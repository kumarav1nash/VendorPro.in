import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyDataService';
import type { DummyProduct } from '../../types/dummyData';
import { Button } from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { CardHeader, CardBody } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/format';

export const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<DummyProduct | null>(null);
  const [products, setProducts] = useState<DummyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !user) return;
      
      try {
        setLoading(true);
        setError(null);

        if (user.role === 'shop_owner') {
          // For shop owners, search in all their shops
          const shopsResponse = await dummyDataService.getShops();
          if (shopsResponse.success && shopsResponse.data) {
            const userShops = shopsResponse.data.filter(shop => shop.owner_id === user.id);
            let foundProduct: DummyProduct | undefined;
            
            for (const shop of userShops) {
              const productsResponse = await dummyDataService.getProducts(shop.id);
              if (productsResponse.success && productsResponse.data) {
                const product = productsResponse.data.find(p => p.id === productId);
                if (product) {
                  foundProduct = product;
                  break;
                }
              }
            }
            
            if (foundProduct) {
              setProduct(foundProduct);
            } else {
              setError('Product not found');
            }
          }
        } else if (user.role === 'salesman') {
          // For salesmen, search in shops they're assigned to
          const shopsResponse = await dummyDataService.getShops();
          if (shopsResponse.success && shopsResponse.data) {
            const assignedShops = shopsResponse.data.filter(shop => 
              shop.shop_salesmen?.includes(user.id)
            );
            let foundProduct: DummyProduct | undefined;
            
            for (const shop of assignedShops) {
              const productsResponse = await dummyDataService.getProducts(shop.id);
              if (productsResponse.success && productsResponse.data) {
                const product = productsResponse.data.find(p => p.id === productId);
                if (product) {
                  foundProduct = product;
                  break;
                }
              }
            }
            
            if (foundProduct) {
              setProduct(foundProduct);
            } else {
              setError('Product not found');
            }
          }
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, user]);

  const handleEdit = () => {
    navigate(`/products/${productId}/edit`);
  };

  const handleDelete = async () => {
    if (!productId || !user) return;
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // For now, just remove from local state since we don't have deleteProduct in dummyDataService
        setProducts(products.filter((p: DummyProduct) => p.id !== productId));
        navigate('/products');
      } catch (err) {
        setError('An error occurred while deleting the product');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Product Details
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit}>Edit Product</Button>
            <Button variant="outline" onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </div>
        </div>

        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.image && (
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Description</h2>
                  <p className="mt-1 text-gray-600">{product.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Base Price</h2>
                    <p className="mt-1 text-gray-600">{formatCurrency(product.base_price)}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Selling Price</h2>
                    <p className="mt-1 text-gray-600">{formatCurrency(product.selling_price)}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Quantity</h2>
                    <p className="mt-1 text-gray-600">{product.quantity}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Status</h2>
                    <p className="mt-1 text-gray-600 capitalize">{product.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}; 