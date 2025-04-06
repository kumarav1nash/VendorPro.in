import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to VendorPro</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          A comprehensive vendor management system for shop owners and salesmen.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-primary-50 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-primary-900">Shop Management</h2>
            <p className="mt-2 text-sm text-primary-700">
              Register and manage your shops with ease.
            </p>
          </div>
          <div className="bg-primary-50 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-primary-900">Inventory Tracking</h2>
            <p className="mt-2 text-sm text-primary-700">
              Keep track of your inventory in real-time.
            </p>
          </div>
          <div className="bg-primary-50 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-primary-900">Sales Management</h2>
            <p className="mt-2 text-sm text-primary-700">
              Track sales and manage your business efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 