import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyData';
import { DummySale, DummySaleItem, DummyUser, DummyProduct } from '../../types/dummy';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { formatCurrency } from '../../utils/format';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const SaleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sale, setSale] = useState<DummySale | null>(null);
  const [items, setItems] = useState<DummySaleItem[]>([]);
  const [products, setProducts] = useState<Record<string, DummyProduct>>({});
  const [salesman, setSalesman] = useState<DummyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const loadSaleData = async () => {
      try {
        if (!id) return;

        // Load sale details
        const saleResponse = await dummyDataService.getSales(user?.id || '');
        if (saleResponse.success && saleResponse.data) {
          const foundSale = saleResponse.data.find(s => s.id === id);
          if (foundSale) {
            setSale(foundSale);
            
            // Load salesman details
            const salesmanResponse = await dummyDataService.getUser(foundSale.salesman_id);
            if (salesmanResponse.success && salesmanResponse.data) {
              setSalesman(salesmanResponse.data);
            }
          } else {
            setError('Sale not found');
          }
        }

        // Load sale items
        const itemsResponse = await dummyDataService.getSaleItems(id);
        if (itemsResponse.success && itemsResponse.data) {
          setItems(itemsResponse.data);
          
          // Load product details for each item
          const productIds = itemsResponse.data.map(item => item.product_id);
          const productsResponse = await dummyDataService.getProducts(user?.id || '');
          if (productsResponse.success && productsResponse.data) {
            const productsMap = productsResponse.data.reduce((acc, product) => {
              acc[product.id] = product;
              return acc;
            }, {} as Record<string, DummyProduct>);
            setProducts(productsMap);
          }
        }
      } catch (err) {
        setError('Failed to load sale details');
      } finally {
        setLoading(false);
      }
    };

    loadSaleData();
  }, [id, user?.id]);

  const handleApprove = async () => {
    if (!sale) return;
    try {
      const response = await dummyDataService.updateSaleStatus(sale.id, 'approved');
      if (response.success && response.data) {
        setSale(response.data);
        setSuccess('Sale approved successfully');
        setShowApproveModal(false);
        setTimeout(() => navigate('/sales'), 2000);
      } else {
        setError(response.error || 'Failed to approve sale');
      }
    } catch (err) {
      setError('Failed to approve sale');
    }
  };

  const handleReject = async () => {
    if (!sale) return;
    try {
      const response = await dummyDataService.updateSaleStatus(sale.id, 'rejected', rejectionReason);
      if (response.success && response.data) {
        setSale(response.data);
        setSuccess('Sale rejected successfully');
        setShowRejectModal(false);
        setRejectionReason('');
        setTimeout(() => navigate('/sales'), 2000);
      } else {
        setError(response.error || 'Failed to reject sale');
      }
    } catch (err) {
      setError('Failed to reject sale');
    }
  };

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

  if (loading) return <LoadingState message="Loading sale details..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!sale) return <EmptyState title="Sale Not Found" description="The requested sale could not be found." />;

  const totalCommission = sale.total_amount * 0.05; // 5% commission rate

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sale Details</h1>
        <Button onClick={() => navigate('/sales')}>Back to Sales</Button>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Sale Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">ID:</span> {sale.id}</p>
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                {sale.status}
              </span>
            </p>
            <p><span className="font-medium">Total Amount:</span> {formatCurrency(sale.total_amount)}</p>
            <p><span className="font-medium">Created At:</span> {new Date(sale.created_at).toLocaleString()}</p>
            <p><span className="font-medium">Updated At:</span> {new Date(sale.updated_at).toLocaleString()}</p>
            {sale.rejection_reason && (
              <p><span className="font-medium">Rejection Reason:</span> {sale.rejection_reason}</p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Salesman Information</h2>
          <div className="space-y-2">
            {salesman ? (
              <>
                <p><span className="font-medium">Name:</span> {salesman.name}</p>
                <p><span className="font-medium">Email:</span> {salesman.email}</p>
                <p><span className="font-medium">Phone:</span> {salesman.phone}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    salesman.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {salesman.status}
                  </span>
                </p>
              </>
            ) : (
              <LoadingState message="Loading salesman information..." />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Commission Details</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Total Sale Amount:</span> {formatCurrency(sale.total_amount)}</p>
          <p><span className="font-medium">Commission Rate:</span> 5%</p>
          <p className="font-medium text-lg">
            <span className="text-green-600">Commission Amount:</span> {formatCurrency(totalCommission)}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        {items.length === 0 ? (
          <EmptyState title="No Products" description="No products were found in this sale." />
        ) : (
          <Table
            columns={[
              { header: 'Product', accessor: 'product' },
              { header: 'Quantity', accessor: 'quantity' },
              { header: 'Price', accessor: 'price' },
              { header: 'Total', accessor: 'total' }
            ]}
            data={items.map(item => ({
              product: products[item.product_id]?.name || 'Loading...',
              quantity: item.quantity,
              price: formatCurrency(item.price),
              total: formatCurrency(item.quantity * item.price)
            }))}
          />
        )}
      </div>

      {user?.role === 'shop_owner' && sale.status === 'pending' && (
        <div className="flex gap-4">
          <Button variant="primary" onClick={() => setShowApproveModal(true)}>
            Approve Sale
          </Button>
          <Button variant="danger" onClick={() => setShowRejectModal(true)}>
            Reject Sale
          </Button>
        </div>
      )}

      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Sale"
      >
        <div className="space-y-4">
          <p>Are you sure you want to approve this sale?</p>
          <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApprove}>
              Approve
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Sale"
      >
        <div className="space-y-4">
          <p>Please provide a reason for rejecting this sale:</p>
          <Input
            type="text"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason"
            required
          />
          <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 