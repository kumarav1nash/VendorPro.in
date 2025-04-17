import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyDataService';
import { Table } from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';

export const SalesmanCommissionOverviewPage = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user || user.role !== 'salesman') {
        throw new Error('Access denied. This page is only for salesmen.');
      }

      // Get shop ID for the salesman
      const shopsResponse = await dummyDataService.getShops();
      if (!shopsResponse.success || !shopsResponse.data) {
        throw new Error('Failed to load shops');
      }

      const assignedShop = shopsResponse.data.find(shop => 
        shop.shop_salesmen?.includes(user.id)
      );

      if (!assignedShop) {
        throw new Error('No shop assigned to this salesman');
      }

      // Load sales for this salesman
      const salesResponse = await dummyDataService.getSales(assignedShop.id);
      if (!salesResponse.success || !salesResponse.data) {
        throw new Error('Failed to load sales');
      }

      // Filter sales for this salesman and calculate commissions
      const salesmanSales = salesResponse.data.filter(sale => sale.salesman_id === user.id);
      const salesWithCommissions = await Promise.all(
        salesmanSales.map(async (sale) => {
          const commissionResponse = await dummyDataService.calculateCommission(sale.id);
          return {
            ...sale,
            commission: commissionResponse.success ? commissionResponse.data : null
          };
        })
      );

      setSales(salesWithCommissions);
    } catch (err) {
      setError('Error loading commission data: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error loading commission data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredSales = sales.filter(sale => {
    const matchesDate = !filters.startDate || new Date(sale.date) >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || new Date(sale.date) <= new Date(filters.endDate);
    return matchesDate && matchesEndDate;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const totalCommission = filteredSales.reduce((sum, sale) => 
    sum + (sale.commission?.amount || 0), 0
  );
  const averageCommission = filteredSales.length > 0 
    ? totalCommission / filteredSales.length 
    : 0;
  const pendingCommission = filteredSales.reduce((sum, sale) => 
    sum + (sale.commission?.status === 'pending' ? sale.commission?.amount || 0 : 0), 0
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Commission Overview</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track your sales performance and commission earnings
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{filteredSales.length}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Commission</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                ₹{totalCommission.toFixed(2)}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Average Commission</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                ₹{averageCommission.toFixed(2)}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Pending Commission</dt>
              <dd className="mt-1 text-3xl font-semibold text-yellow-600">
                ₹{pendingCommission.toFixed(2)}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <Input
              id="startDate"
              type="text"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="mt-1"
              inputMode="none"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <Input
              id="endDate"
              type="text"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="mt-1"
              inputMode="none"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
            />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      {filteredSales.length === 0 ? (
        <EmptyState
          title="No Sales Found"
          description="No sales match the selected date range"
          action={{
            label: "Clear Filters",
            onClick: () => setFilters({
              startDate: '',
              endDate: '',
            })
          }}
        />
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Table
            columns={[
              { 
                header: 'Date', 
                accessor: 'date',
                render: (date) => new Date(date).toLocaleDateString()
              },
              { 
                header: 'Sale Amount', 
                accessor: 'total_amount',
                render: (amount) => `₹${amount.toFixed(2)}`
              },
              { 
                header: 'Commission', 
                accessor: 'commission',
                render: (commission) => (
                  <span className="font-medium text-green-600">
                    ₹{commission?.amount?.toFixed(2) || '0.00'}
                  </span>
                )
              },
              { 
                header: 'Commission Rate', 
                accessor: 'commission',
                render: (commission) => (
                  <span className="text-sm text-gray-500">
                    {commission?.rate ? `${commission.rate}%` : 'N/A'}
                  </span>
                )
              },
              { 
                header: 'Status', 
                accessor: 'commission',
                render: (commission) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    commission?.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : commission?.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {commission?.status || 'Not calculated'}
                  </span>
                )
              }
            ]}
            data={filteredSales}
          />
        </div>
      )}
    </div>
  );
}; 