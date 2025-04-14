import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyData';
import { DummyCommissionRule, CommissionType } from '../../types/dummy';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import Input from '../../components/ui/Input';

export const CommissionStructurePage = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<DummyCommissionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<DummyCommissionRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage' as CommissionType,
    value: 0,
    product_id: '',
    min_amount: '',
    max_amount: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For shop owners, get rules for their shops
      // For admins, get all rules
      const shopId = user?.role === 'shop_owner' ? user.id : undefined;
      const loadedRules = await dummyDataService.getCommissionRules(shopId);
      setRules(loadedRules);
    } catch (err) {
      setError('Failed to load commission rules');
      console.error('Error loading commission rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const ruleData = {
        ...formData,
        shop_id: user?.id || '',
        value: Number(formData.value),
        min_amount: formData.min_amount ? Number(formData.min_amount) : undefined,
        max_amount: formData.max_amount ? Number(formData.max_amount) : undefined,
        product_id: formData.product_id || undefined
      };

      if (editingRule) {
        await dummyDataService.updateCommissionRule(editingRule.id, ruleData);
        setSuccess('Commission rule updated successfully');
      } else {
        await dummyDataService.createCommissionRule(ruleData);
        setSuccess('Commission rule created successfully');
      }

      setShowModal(false);
      setEditingRule(null);
      setFormData({
        name: '',
        description: '',
        type: 'percentage',
        value: 0,
        product_id: '',
        min_amount: '',
        max_amount: '',
        status: 'active'
      });
      loadRules();
    } catch (err) {
      setError('Failed to save commission rule');
      console.error('Error saving commission rule:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule: DummyCommissionRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      type: rule.type,
      value: rule.value,
      product_id: rule.product_id || '',
      min_amount: rule.min_amount?.toString() || '',
      max_amount: rule.max_amount?.toString() || '',
      status: rule.status
    });
    setShowModal(true);
  };

  const handleDelete = async (ruleId: string) => {
    if (!window.confirm('Are you sure you want to delete this commission rule?')) return;

    try {
      setLoading(true);
      setError(null);
      await dummyDataService.deleteCommissionRule(ruleId);
      setSuccess('Commission rule deleted successfully');
      loadRules();
    } catch (err) {
      setError('Failed to delete commission rule');
      console.error('Error deleting commission rule:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading commission rules...</div>;
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
        <h1 className="text-2xl font-bold">Commission Rules</h1>
        <Button onClick={() => setShowModal(true)}>
          New Commission Rule
        </Button>
      </div>

      <Table
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Type', accessor: 'type' },
          { 
            header: 'Value', 
            accessor: 'value',
            render: (value, row) => `${row.type === 'percentage' ? value + '%' : '₹' + value}`
          },
          { 
            header: 'Scope', 
            accessor: 'product_id',
            render: (productId) => productId ? 'Product-specific' : 'Global'
          },
          { 
            header: 'Status', 
            accessor: 'status',
            render: (status) => (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {status}
              </span>
            )
          },
          {
            header: 'Actions',
            accessor: 'id',
            render: (id, row) => (
              <div className="space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(row)}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDelete(id)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={rules}
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRule(null);
          setFormData({
            name: '',
            description: '',
            type: 'percentage',
            value: 0,
            product_id: '',
            min_amount: '',
            max_amount: '',
            status: 'active'
          });
        }}
        title={editingRule ? 'Edit Commission Rule' : 'New Commission Rule'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Rule Name
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Commission Type
            </label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as CommissionType })}
              options={[
                { value: 'percentage', label: 'Percentage' },
                { value: 'fixed', label: 'Fixed Amount' }
              ]}
              required
            />
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">
              {formData.type === 'percentage' ? 'Percentage Value' : 'Fixed Amount'}
            </label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              min="0"
              step={formData.type === 'percentage' ? "0.01" : "1"}
              required
            />
          </div>

          <div>
            <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">
              Product (Optional)
            </label>
            <Select
              id="product_id"
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              options={[
                { value: '', label: 'Global (All Products)' },
                // TODO: Add product options from the shop
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="min_amount" className="block text-sm font-medium text-gray-700">
                Minimum Amount (Optional)
              </label>
              <Input
                id="min_amount"
                type="number"
                value={formData.min_amount}
                onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                min="0"
              />
            </div>

            <div>
              <label htmlFor="max_amount" className="block text-sm font-medium text-gray-700">
                Maximum Amount (Optional)
              </label>
              <Input
                id="max_amount"
                type="number"
                value={formData.max_amount}
                onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })}
                min="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingRule(null);
                setFormData({
                  name: '',
                  description: '',
                  type: 'percentage',
                  value: 0,
                  product_id: '',
                  min_amount: '',
                  max_amount: '',
                  status: 'active'
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingRule ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}; 