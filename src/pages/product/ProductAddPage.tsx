import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ProductForm } from '../../components/product/ProductForm';

export const ProductAddPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSuccess = () => {
    navigate('/products');
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to add a new product to your inventory.
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Products
          </button>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ProductForm 
              shopId={user.id} 
              onSuccess={handleSuccess} 
              onCancel={handleCancel} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 