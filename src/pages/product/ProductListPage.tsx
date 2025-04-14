import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyData';
import { DummyProduct } from '../../types/dummyData';
import { formatCurrency } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export const ProductListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<DummyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      
      try {
        const response = await dummyDataService.getProducts(user.id);
        if (response.data) {
          setProducts(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/products/${productId}/edit`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // For now, just remove from local state since we don't have deleteProduct in dummyDataService
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        setError('An error occurred while deleting the product');
      }
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      const matchesPrice = priceRange === 'all' || 
        (priceRange === 'low' && product.selling_price < 100) ||
        (priceRange === 'medium' && product.selling_price >= 100 && product.selling_price < 500) ||
        (priceRange === 'high' && product.selling_price >= 500);
      return matchesSearch && matchesStatus && matchesPrice;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof DummyProduct];
      const bValue = b[sortBy as keyof DummyProduct];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortOrder === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={handleAddProduct}>Add Product</Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
        <Select
          value={priceRange}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriceRange(e.target.value)}
          options={[
            { value: 'all', label: 'All Prices' },
            { value: 'low', label: 'Low (< ₹100)' },
            { value: 'medium', label: 'Medium (₹100-500)' },
            { value: 'high', label: 'High (≥ ₹500)' },
          ]}
        />
        <Select
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
          options={[
            { value: 'name', label: 'Sort by Name' },
            { value: 'selling_price', label: 'Sort by Price' },
            { value: 'quantity', label: 'Sort by Quantity' },
          ]}
        />
      </div>

      {/* Products Table */}
      <Table
        columns={[
          { header: 'Name', accessor: 'name', render: (value, row) => (
            <button
              onClick={() => navigate(`/products/${row.id}`)}
              className="text-indigo-600 hover:text-indigo-900 font-medium"
            >
              {value}
            </button>
          ) },
          { header: 'Description', accessor: 'description' },
          { 
            header: 'Base Price', 
            accessor: 'base_price',
            render: (value) => formatCurrency(value)
          },
          { 
            header: 'Selling Price', 
            accessor: 'selling_price',
            render: (value) => formatCurrency(value)
          },
          { header: 'Quantity', accessor: 'quantity' },
          { 
            header: 'Status', 
            accessor: 'status',
            render: (value) => (
              <span className={`px-2 py-1 rounded-full text-xs ${
                value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {value}
              </span>
            )
          },
          {
            header: 'Actions',
            accessor: 'id',
            render: (id) => (
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/products/${id}`)}
                >
                  View Details
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditProduct(id)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteProduct(id)}
                >
                  Delete
                </Button>
              </div>
            )
          }
        ]}
        data={paginatedProducts}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}; 