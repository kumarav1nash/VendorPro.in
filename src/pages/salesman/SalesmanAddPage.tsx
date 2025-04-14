import { useAuth } from '../../hooks/useAuth';
import { SalesmanForm } from '../../components/salesman/SalesmanForm';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const SalesmanAddPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/salesmen');
  };

  const handleCancel = () => {
    navigate('/salesmen');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Salesman</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to add a new salesman to your shop.
            </p>
          </div>
          <Button
            onClick={handleCancel}
            variant="secondary"
          >
            Back to Salesmen
          </Button>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <SalesmanForm 
              shopId={user.id} 
              onSuccess={handleSuccess} 
              onCancel={handleCancel} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesmanAddPage; 