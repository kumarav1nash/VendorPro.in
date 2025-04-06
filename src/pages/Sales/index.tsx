import React, { useState } from 'react';

interface Sale {
  id: string;
  date: string;
  customer: string;
  amount: number;
  items: number;
  status: 'completed' | 'pending' | 'cancelled';
}

const Sales: React.FC = () => {
  const [sales] = useState<Sale[]>([
    {
      id: '1',
      date: '2024-03-21',
      customer: 'John Doe',
      amount: 45.97,
      items: 3,
      status: 'completed',
    },
    {
      id: '2',
      date: '2024-03-21',
      customer: 'Jane Smith',
      amount: 32.50,
      items: 2,
      status: 'completed',
    },
    {
      id: '3',
      date: '2024-03-20',
      customer: 'Bob Johnson',
      amount: 78.25,
      items: 5,
      status: 'pending',
    },
    {
      id: '4',
      date: '2024-03-20',
      customer: 'Alice Brown',
      amount: 25.99,
      items: 1,
      status: 'cancelled',
    },
  ]);

  const stats = {
    totalSales: 182.71,
    averageOrderValue: 45.68,
    totalOrders: 4,
    completionRate: 75,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sales Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${stats.totalSales.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Average Order Value
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${stats.averageOrderValue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.completionRate}%
          </p>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Sales</h2>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <li key={sale.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {sale.customer}
                      </p>
                      <p className="text-sm text-gray-500">
                        {sale.date} • {sale.items} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium text-gray-900">
                      ${sale.amount.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sale.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : sale.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sales; 