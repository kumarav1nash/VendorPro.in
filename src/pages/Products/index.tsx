import React, { useState } from 'react';
import { Product } from '../../types';

const Products: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Coffee',
      category: 'Beverages',
      price: 4.99,
      stock: 100,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Organic Tea',
      category: 'Beverages',
      price: 3.99,
      stock: 150,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      name: 'Fresh Croissant',
      category: 'Bakery',
      price: 2.99,
      stock: 50,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '4',
      name: 'Chocolate Muffin',
      category: 'Bakery',
      price: 3.49,
      stock: 75,
      image: 'https://via.placeholder.com/150',
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
            Add New Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.stock > 50
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 20
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  Stock: {product.stock}
                </span>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button className="text-primary-600 hover:text-primary-900">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 