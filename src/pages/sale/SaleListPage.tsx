import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyData';
import { DummySale, DummyUser } from '../../types/dummy';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useNavigate } from 'react-router-dom';

export const SaleListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState<DummySale[]>([]);
  const [salesmen, setSalesmen] = useState<DummyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [salesmanFilter, setSalesmanFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
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
    // TODO: Implement sale approval
    console.log('Approve sale:', saleId);
  };

  const handleRejectSale = async (saleId: string) => {
    // TODO: Implement sale rejection
    console.log('Reject sale:', saleId);
  };

  if (loading) return <div>Loading sales...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        {user?.role === 'salesman' && (
          <Button onClick={() => navigate('/sales/new')}>
            New Sale
          </Button>
        )}
      </div>

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
          {user?.role === 'shop_owner' && (
            <div className="flex-1 min-w-[200px]">
              <Select
                label="Salesman"
                value={salesmanFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSalesmanFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Salesmen' },
                  ...salesmen.map(salesman => ({
                    value: salesman.id,
                    label: salesman.name
                  }))
                ]}
              />
            </div>
          )}
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
          { header: 'ID', accessor: 'id' },
          { header: 'Salesman', accessor: 'salesman' },
          { header: 'Total Amount', accessor: 'total_amount' },
          { header: 'Status', accessor: 'status' },
          { header: 'Date', accessor: 'date' },
          { header: 'Actions', accessor: 'actions' }
        ]}
        data={paginatedSales.map(sale => ({
          id: sale.id,
          salesman: getSalesmanName(sale.salesman_id),
          total_amount: `₹${sale.total_amount}`,
          status: (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
              {sale.status}
            </span>
          ),
          date: new Date(sale.created_at).toLocaleDateString(),
          actions: (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleViewSale(sale.id)}
              >
                View
              </Button>
              {user?.role === 'shop_owner' && sale.status === 'pending' && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApproveSale(sale.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRejectSale(sale.id)}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          )
        }))}
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            variant="secondary"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}; 