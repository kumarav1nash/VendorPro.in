import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyData';
import { DummySale, DummyUser } from '../../types/dummy';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/ui/Modal';

export const SaleListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState<DummySale[]>([]);
  const [salesmen, setSalesmen] = useState<DummyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [salesmanFilter, setSalesmanFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSales, setSelectedSales] = useState<string[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) return;
        
        // Load sales based on user role
        if (user.role === 'shop_owner') {
          // For shop owners, load sales from their shops
          const shopsResponse = await dummyDataService.getShops();
          if (shopsResponse.success && shopsResponse.data) {
            const userShops = shopsResponse.data.filter(shop => shop.owner_id === user.id);
            const allShopSales: DummySale[] = [];
            
            for (const shop of userShops) {
              const salesResponse = await dummyDataService.getSales(shop.id);
              if (salesResponse.success && salesResponse.data) {
                allShopSales.push(...salesResponse.data);
              }
            }
            
            setSales(allShopSales);
            
            // Load salesmen assigned to these shops
            const assignedSalesmen = new Set<string>();
            userShops.forEach(shop => {
              shop.shop_salesmen?.forEach(salesmanId => assignedSalesmen.add(salesmanId));
            });
            
            const salesmenPromises = Array.from(assignedSalesmen).map(id => 
              dummyDataService.getUser(id)
            );
            
            const salesmenResponses = await Promise.all(salesmenPromises);
            const activeSalesmen = salesmenResponses
              .filter(response => response.success && response.data?.status === 'active')
              .map(response => response.data!)
              .filter((salesman): salesman is DummyUser => Boolean(salesman));
            
            setSalesmen(activeSalesmen);
          }
        } else if (user.role === 'salesman') {
          // For salesmen, load sales from shops they're assigned to
          const shopsResponse = await dummyDataService.getShops();
          if (shopsResponse.success && shopsResponse.data) {
            const assignedShops = shopsResponse.data.filter(shop => 
              shop.shop_salesmen?.includes(user.id)
            );
            
            const allShopSales: DummySale[] = [];
            for (const shop of assignedShops) {
              const salesResponse = await dummyDataService.getSales(shop.id);
              if (salesResponse.success && salesResponse.data) {
                // Only include sales made by this salesman
                const salesmanSales = salesResponse.data.filter(sale => 
                  sale.salesman_id === user.id
                );
                allShopSales.push(...salesmanSales);
              }
            }
            
            setSales(allShopSales);
            setSalesmen([user]); // Salesmen only see themselves in the filter
          }
        }
      } catch (err) {
        setError('An error occurred while loading data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const getSalesmanName = (salesmanId: string) => {
    const salesman = salesmen.find(s => s.id === salesmanId);
    if (!salesman) {
      // If we can't find the salesman, try to get it from the service
      dummyDataService.getUser(salesmanId).then(response => {
        if (response.success && response.data) {
          setSalesmen(prev => {
            const exists = prev.some(s => s.id === response.data.id);
            if (!exists) {
              return [...prev, response.data];
            }
            return prev;
          });
        }
      });
      return 'Loading...';
    }
    return salesman.name;
  };

  const filteredSales = sales.filter(sale => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;

    // Salesman filter
    const matchesSalesman = salesmanFilter === 'all' || 
      sale.salesman_id === salesmanFilter;

    // Date filter
    const saleDate = new Date(sale.created_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isToday = (date: Date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    };

    const isThisWeek = (date: Date) => {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      weekStart.setHours(0, 0, 0, 0);
      return date >= weekStart;
    };

    const isThisMonth = (date: Date) => {
      const today = new Date();
      return date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear();
    };

    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && isToday(saleDate)) ||
      (dateFilter === 'week' && isThisWeek(saleDate)) ||
      (dateFilter === 'month' && isThisMonth(saleDate));

    return matchesSearch && matchesStatus && matchesSalesman && matchesDate;
  });

  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewSale = (saleId: string) => {
    navigate(`/sales/${saleId}`);
  };

  const handleApproveSale = async (saleId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setSales(prev => prev.map(sale => {
        if (sale.id === saleId) {
          return { ...sale, status: 'approved' };
        }
        return sale;
      }));
      
      setSuccess('Sale approved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to approve sale');
      console.error('Error approving sale:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSale = async (saleId: string) => {
    setShowRejectModal(true);
    setSelectedSales([saleId]);
  };

  const handleSelectSale = (saleId: string) => {
    setSelectedSales(prev => {
      if (prev.includes(saleId)) {
        return prev.filter(id => id !== saleId);
      } else {
        return [...prev, saleId];
      }
    });
  };

  const handleSelectAllSales = () => {
    if (selectedSales.length === paginatedSales.length) {
      setSelectedSales([]);
    } else {
      setSelectedSales(paginatedSales.map(sale => sale.id));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedSales.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setSales(prev => prev.map(sale => {
        if (selectedSales.includes(sale.id)) {
          return { ...sale, status: 'approved' };
        }
        return sale;
      }));
      
      setSuccess(`${selectedSales.length} sales approved successfully`);
      setSelectedSales([]);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to approve sales');
      console.error('Error approving sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedSales.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setSales(prev => prev.map(sale => {
        if (selectedSales.includes(sale.id)) {
          return { ...sale, status: 'rejected' };
        }
        return sale;
      }));
      
      setSuccess(`${selectedSales.length} sales rejected successfully`);
      setSelectedSales([]);
      setShowRejectModal(false);
      setRejectReason('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to reject sales');
      console.error('Error rejecting sales:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading sales...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
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

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        {user?.role === 'salesman' && (
          <Button onClick={() => navigate('/sales/new')}>
            New Sale
          </Button>
        )}
      </div>

      {user?.role === 'shop_owner' && selectedSales.length > 0 && (
        <div className="mb-4 flex gap-2">
          <Button onClick={handleBulkApprove}>
            Approve Selected ({selectedSales.length})
          </Button>
          <Button variant="secondary" onClick={() => setShowRejectModal(true)}>
            Reject Selected ({selectedSales.length})
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search sales..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
              ]}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Salesman"
              value={salesmanFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSalesmanFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Salesmen' },
                ...salesmen.map(s => ({ value: s.id, label: s.name }))
              ]}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Date"
              value={dateFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' }
              ]}
            />
          </div>
        </div>
      </div>

      <Table
        columns={[
          {
            header: (
              <input
                type="checkbox"
                checked={selectedSales.length === paginatedSales.length}
                onChange={handleSelectAllSales}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            ),
            accessor: 'id',
            render: (id) => (
              <input
                type="checkbox"
                checked={selectedSales.includes(id)}
                onChange={() => handleSelectSale(id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            ),
          },
          { header: 'ID', accessor: 'id' },
          { header: 'Salesman', accessor: 'salesman_id', render: (id) => getSalesmanName(id) },
          { header: 'Amount', accessor: 'total_amount', render: (amount) => `₹${amount}` },
          { 
            header: 'Status', 
            accessor: 'status',
            render: (status) => (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)}`}>
                {status}
              </span>
            )
          },
          { header: 'Date', accessor: 'created_at', render: (date) => new Date(date).toLocaleDateString() },
          {
            header: 'Actions',
            accessor: 'id',
            render: (id) => (
              <div className="space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => handleViewSale(id)}
                >
                  View
                </Button>
                {user?.role === 'shop_owner' && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => handleApproveSale(id)}
                      disabled={sales.find(s => s.id === id)?.status !== 'pending'}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleRejectSale(id)}
                      disabled={sales.find(s => s.id === id)?.status !== 'pending'}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            ),
          },
        ]}
        data={paginatedSales}
      />

      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason('');
        }}
        title="Reject Sales"
      >
        <div className="space-y-4">
          <p>Are you sure you want to reject {selectedSales.length} selected sales?</p>
          <div>
            <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700">
              Reason for rejection
            </label>
            <textarea
              id="rejectReason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkReject}
              disabled={!rejectReason.trim()}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 