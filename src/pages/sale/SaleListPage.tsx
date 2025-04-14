import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyData';
import { DummySale } from '../../types/dummy';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';

export const SaleListPage = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<DummySale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSales = async () => {
      try {
        if (!user) return;
        
        const response = await dummyDataService.getSales(user.id);
        if (response.success && response.data) {
          setSales(response.data);
        } else {
          setError(response.error || 'Failed to load sales');
        }
      } catch (err) {
        setError('An error occurred while loading sales');
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, [user]);

  if (loading) return <div>Loading sales...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Button>New Sale</Button>
      </div>

      <Table
        columns={[
          { header: 'ID', accessor: 'id' },
          { header: 'Total Amount', accessor: 'total_amount' },
          { header: 'Status', accessor: 'status' },
          { header: 'Created At', accessor: 'created_at' },
        ]}
        data={sales}
      />
    </div>
  );
}; 