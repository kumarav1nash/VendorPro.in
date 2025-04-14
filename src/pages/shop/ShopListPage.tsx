import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShopList } from '../../components/shop/ShopList';
import { ShopForm } from '../../components/shop/ShopForm';

export const ShopListPage = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [key, setKey] = useState(0); // Used to force re-render of ShopList

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setKey(prev => prev + 1); // Force ShopList to re-fetch data
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Shops</h1>
        {user?.role === 'shop_owner' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Shop
          </button>
        )}
      </div>

      {showCreateForm ? (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Shop</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            <ShopForm onSuccess={handleCreateSuccess} />
          </div>
        </div>
      ) : (
        <ShopList key={key} />
      )}
    </div>
  );
}; 