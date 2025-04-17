import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyDataService';
import { DummyProduct } from '../../types/dummyData';
import { formatCurrency } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export const ProductListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<DummyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<DummyProduct | null>(null);
  
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
        setLoading(true);
        setError(null);

        if (user.role === 'shop_owner') {
          // For shop owners, load products from all their shops
          const shopsResponse = await dummyDataService.getShops();
          if (shopsResponse.success && shopsResponse.data) {
            const userShops = shopsResponse.data.filter(shop => shop.owner_id === user.id);
            const allProducts: DummyProduct[] = [];
            
            for (const shop of userShops) {
              const productsResponse = await dummyDataService.getProducts(shop.id);
              if (productsResponse.success && productsResponse.data) {
                allProducts.push(...productsResponse.data);
              }
            }
            
            setProducts(allProducts);
          }
        } else if (user.role === 'salesman') {
          // For salesmen, load products from shops they're assigned to
          const shopsResponse = await dummyDataService.getShops();
          if (shopsResponse.success && shopsResponse.data) {
            const assignedShops = shopsResponse.data.filter(shop => 
              shop.shop_salesmen?.includes(user.id)
            );
            
            const allProducts: DummyProduct[] = [];
            for (const shop of assignedShops) {
              const productsResponse = await dummyDataService.getProducts(shop.id);
              if (productsResponse.success && productsResponse.data) {
                allProducts.push(...productsResponse.data);
              }
            }
            
            setProducts(allProducts);
          }
        }
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
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

  const handleDeleteClick = (product: DummyProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const response = await dummyDataService.deleteProduct(productToDelete.id);
      if (response.success) {
        setProducts(products.filter(p => p.id !== productToDelete.id));
        setSuccess('Product deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.error || 'Failed to delete product');
      }
    } catch (err) {
      setError('An error occurred while deleting the product');
    } finally {
      setProductToDelete(null);
      setDeleteDialogOpen(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product inventory
          </p>
        </div>
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
            render: (id, row) => (
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
                  onClick={() => handleDeleteClick(row)}
                >
                  Delete
                </Button>
              </div>
            )
          }
        ]}
        data={paginatedProducts}
      />

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone and will also remove any associated sales data.`}
        confirmText="Delete"
        variant="danger"
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