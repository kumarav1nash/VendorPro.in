import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyDataService';
import { DummyUser } from '../../types/dummy';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export const SalesmanListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [salesmen, setSalesmen] = useState<DummyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset current page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const fetchSalesmen = async () => {
      if (!user) return;
      
      try {
        const response = await dummyDataService.getSalesmen(user.id); //here we should get list of salesmans assigned to the current user's shop
        if (response.success && response.data) {
          setSalesmen(response.data);
        } else {
          setError(response.error || 'Failed to fetch salesmen');
        }
      } catch (err) {
        setError('An error occurred while fetching salesmen');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesmen();
  }, [user]);

  const handleAddSalesman = () => {
    navigate('/salesmen/add');
  };

  const handleEditSalesman = (salesmanId: string) => {
    navigate(`/salesmen/${salesmanId}/edit`);
  };

  const handleDeactivateSalesman = async (salesmanId: string) => {
    // TODO: Implement deactivation
    console.log('Deactivate salesman:', salesmanId);
  };

  // Filter and paginate salesmen
  const filteredSalesmen = salesmen.filter(salesman => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      salesman.name.toLowerCase().includes(searchLower) ||
      salesman.email.toLowerCase().includes(searchLower) ||
      (salesman.phone && salesman.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && salesman.status === 'active') ||
      (statusFilter === 'inactive' && salesman.status === 'inactive');
    
    return matchesSearch && matchesStatus;
  });

  const paginatedSalesmen = filteredSalesmen.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div>Loading salesmen...</div>;
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
          <h1 className="text-2xl font-semibold text-gray-900">Salesmen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your sales team
          </p>
        </div>
        <Button onClick={handleAddSalesman}>Add Salesman</Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>
      </div>

      <Table
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Email', accessor: 'email' },
          { header: 'Phone', accessor: 'phone' },
          { 
            header: 'Status', 
            accessor: 'status',
            render: (status: string) => (
              <span className={`px-2 py-1 rounded-full text-xs ${
                status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
                  onClick={() => handleEditSalesman(id)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeactivateSalesman(id)}
                >
                  Deactivate
                </Button>
              </div>
            )
          }
        ]}
        data={paginatedSalesmen}
      />

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            Page {currentPage} of {Math.ceil(filteredSalesmen.length / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredSalesmen.length / itemsPerPage), p + 1))}
            disabled={currentPage === Math.ceil(filteredSalesmen.length / itemsPerPage)}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}; 