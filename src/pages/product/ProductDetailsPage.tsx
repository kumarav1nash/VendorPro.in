import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyData';
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
        const response = await dummyDataService.getProducts(user.id);
        if (response.data) {
          const foundProduct = response.data.find((p: DummyProduct) => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
            setProducts(response.data);
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        setError('Failed to load product details');
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
              Product ID: {product.id}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleEdit} variant="primary">
              Edit Product
            </Button>
            <Button onClick={handleDelete} variant="danger">
              Delete Product
            </Button>
            <Button 
              onClick={() => navigate('/products')} 
              variant="secondary"
            >
              Back to Products
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Image */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Product Image</h2>
            </CardHeader>
            <CardBody>
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
            </CardHeader>
            <CardBody>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Base Price</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatCurrency(product.base_price)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Selling Price</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatCurrency(product.selling_price)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.quantity}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(product.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}; 