import React, { useState } from 'react';

interface Shop {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

const Shops: React.FC = () => {
  const [shops] = useState<Shop[]>([
    {
      id: '1',
      name: 'Main Street Store',
      location: '123 Main St, City',
      status: 'active',
      lastUpdated: '2024-03-21',
    },
    {
      id: '2',
      name: 'Downtown Branch',
      location: '456 Downtown Ave, City',
      status: 'active',
      lastUpdated: '2024-03-20',
    },
    {
      id: '3',
      name: 'Shopping Mall Outlet',
      location: '789 Mall Road, City',
      status: 'inactive',
      lastUpdated: '2024-03-19',
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
          Add New Shop
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {shops.map((shop) => (
            <li key={shop.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {shop.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        {shop.name}
                      </h2>
                      <p className="text-sm text-gray-500">{shop.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        shop.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {shop.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Updated: {shop.lastUpdated}
                    </span>
                    <button className="text-primary-600 hover:text-primary-900">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Shops; 