import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { dummyDataService } from '../../services/dummyData';
import { DummyCommissionRule, CommissionType, DummyShop } from '../../types/dummy';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal, ModalHeader } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';

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
    status: 'active' as 'active' | 'inactive',
    shop_id: ''
  });

  const [shops, setShops] = useState<DummyShop[]>([]);

  useEffect(() => {
    loadRules();
    loadShops();
  }, []);

  const loadRules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let rulesResponse;
      
      if (user?.role === 'shop_owner') {
        // For shop owners, get their shops first
        const shopsResponse = await dummyDataService.getShops();
        if (!shopsResponse.success || !shopsResponse.data) {
          throw new Error('Failed to load shops');
        }
        
        // Get all shops owned by this user
        const userShops = shopsResponse.data.filter(shop => shop.owner_id === user.id);
        if (userShops.length === 0) {
          throw new Error('No shops found for this user');
        }
        
        // Get rules for all shops
        const shopRulesPromises = userShops.map(shop => 
          dummyDataService.getCommissionRules(shop.id)
        );
        const shopRulesResponses = await Promise.all(shopRulesPromises);
        
        // Combine all rules
        const allRules = shopRulesResponses
          .filter(response => response.success && response.data)
          .flatMap(response => response.data || []);
        
        rulesResponse = { success: true, data: allRules };
      } else {
        // For admins, get all rules
        rulesResponse = await dummyDataService.getCommissionRules();
      }
      
      if (!rulesResponse.success || !rulesResponse.data) {
        throw new Error(rulesResponse.error || 'Failed to load commission rules');
      }
      
      setRules(rulesResponse.data);
    } catch (err) {
      setError('Failed to load commission rules');
      console.error('Error loading commission rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadShops = async () => {
    try {
      const response = await dummyDataService.getShops();
      if (response.success && response.data) {
        if (user?.role === 'shop_owner') {
          // Filter shops for shop owners
          setShops(response.data.filter(shop => shop.owner_id === user.id));
        } else {
          setShops(response.data);
        }
      }
    } catch (error) {
      console.error('Error loading shops:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const ruleData = {
        shop_id: formData.shop_id,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        value: Number(formData.value),
        min_amount: formData.min_amount ? Number(formData.min_amount) : undefined,
        max_amount: formData.max_amount ? Number(formData.max_amount) : undefined,
        status: formData.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let response;
      if (editingRule) {
        response = await dummyDataService.updateCommissionRule(editingRule.id, ruleData);
      } else {
        response = await dummyDataService.createCommissionRule(ruleData);
      }

      if (!response.success) {
        throw new Error(response.error || 'Failed to save commission rule');
      }

      setSuccess(editingRule ? 'Commission rule updated successfully' : 'Commission rule created successfully');
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
        status: 'active',
        shop_id: ''
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
      status: rule.status,
      shop_id: rule.shop_id
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

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commission Rules</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage commission rules for your sales team
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            New Commission Rule
          </Button>
        </div>

        {/* Stats Section */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Rules</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{rules.length}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Active Rules</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                {rules.filter(r => r.status === 'active').length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Product-specific Rules</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                {rules.filter(r => r.product_id).length}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
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

      {/* Rules Table */}
      {rules.length === 0 ? (
        <EmptyState
          title="No Commission Rules"
          description="Get started by creating a new commission rule"
          action={{
            label: "New Commission Rule",
            onClick: () => setShowModal(true)
          }}
        />
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Table
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Type', accessor: 'type' },
              { 
                header: 'Value', 
                accessor: 'value',
                render: (value, row) => (
                  <span className="font-medium">
                    {row.type === 'percentage' ? `${value}%` : `₹${value}`}
                  </span>
                )
              },
              { 
                header: 'Scope', 
                accessor: 'product_id',
                render: (productId) => (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {productId ? 'Product-specific' : 'Global'}
                  </span>
                )
              },
              { 
                header: 'Status', 
                accessor: 'status',
                render: (status) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(row)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            data={rules}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
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
            status: 'active',
            shop_id: ''
          });
        }}
      >
        <ModalHeader>
          <h3 className="text-lg font-medium text-gray-900">
            {editingRule ? 'Edit Commission Rule' : 'New Commission Rule'}
          </h3>
        </ModalHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="shop_id" className="block text-sm font-medium text-gray-700">
                Shop
              </label>
              <Select
                id="shop_id"
                value={formData.shop_id}
                onChange={(e) => setFormData({ ...formData, shop_id: e.target.value })}
                options={[
                  { value: '', label: 'Select shop' },
                  ...shops.map(shop => ({
                    value: shop.id,
                    label: shop.name
                  }))
                ]}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Rule Name
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full"
                placeholder="Enter rule name"
              />
            </div>
          </div>

          <div className="space-y-2">
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
              placeholder="Enter rule description"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
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
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                {formData.type === 'percentage' ? 'Percentage Value' : 'Fixed Amount'}
              </label>
              <div className="relative rounded-md shadow-sm">
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  required
                  min="0"
                  step={formData.type === 'percentage' ? "0.01" : "1"}
                  className="w-full"
                  placeholder={formData.type === 'percentage' ? "Enter percentage" : "Enter amount"}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {formData.type === 'percentage' ? '%' : '₹'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="min_amount" className="block text-sm font-medium text-gray-700">
                Minimum Amount (Optional)
              </label>
              <div className="relative rounded-md shadow-sm">
                <Input
                  id="min_amount"
                  type="number"
                  value={formData.min_amount}
                  onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                  min="0"
                  className="w-full"
                  placeholder="Enter minimum amount"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="max_amount" className="block text-sm font-medium text-gray-700">
                Maximum Amount (Optional)
              </label>
              <div className="relative rounded-md shadow-sm">
                <Input
                  id="max_amount"
                  type="number"
                  value={formData.max_amount}
                  onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })}
                  min="0"
                  className="w-full"
                  placeholder="Enter maximum amount"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
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
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
            >
              {editingRule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}; 