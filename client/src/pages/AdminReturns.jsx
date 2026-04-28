import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [updateData, setUpdateData] = useState({ status: '', finalAction: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await api.get('/returns');
      setReturns(response.data.returns);
    } catch (error) {
      console.error('Failed to fetch returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/returns/update/${selectedReturn.id}`, updateData);
      setSuccess('Return updated successfully!');
      setSelectedReturn(null);
      setUpdateData({ status: '', finalAction: '' });
      fetchReturns();
    } catch (error) {
      console.error('Failed to update return:', error);
    }
  };

  const openUpdateModal = (ret) => {
    setSelectedReturn(ret);
    setUpdateData({ status: ret.status, finalAction: ret.finalAction || '' });
  };

  const getStatusBadge = (status) => {
    const styles = {
      Requested: 'bg-yellow-100 text-yellow-700',
      Approved: 'bg-blue-100 text-blue-700',
      Received: 'bg-purple-100 text-purple-700',
      Completed: 'bg-green-100 text-green-700'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`;
  };

  const getConditionBadge = (condition) => {
    const styles = {
      Good: 'bg-green-100 text-green-700',
      Fair: 'bg-yellow-100 text-yellow-700',
      Damaged: 'bg-red-100 text-red-700'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[condition] || 'bg-gray-100 text-gray-700'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/admin" className="text-gray-600 hover:text-gray-900">← Admin</Link>
          <h1 className="font-semibold text-gray-900">Manage Returns</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {returns.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Returns Yet</h2>
            <p className="text-gray-600">There are no return requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map(ret => (
              <div key={ret.id} className="card">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{ret.user?.name}</span>
                      <span className={getStatusBadge(ret.status)}>{ret.status}</span>
                      <span className={getConditionBadge(ret.condition)}>{ret.condition}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{ret.reason}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>👟 {ret.shoe?.shoeId}</span>
                      <span>📅 {new Date(ret.createdAt).toLocaleDateString()}</span>
                      {ret.finalAction && (
                        <span className="text-primary-600">Action: {ret.finalAction}</span>
                      )}
                    </div>
                  </div>

                  {ret.status !== 'Completed' && (
                    <button
                      onClick={() => openUpdateModal(ret)}
                      className="btn-primary text-sm"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedReturn && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Return</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                    className="input-field"
                  >
                    <option value="Requested">Requested</option>
                    <option value="Approved">Approved</option>
                    <option value="Received">Received</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Final Action</label>
                  <select
                    value={updateData.finalAction}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, finalAction: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select action</option>
                    <option value="Repair">Repair</option>
                    <option value="Reuse">Reuse</option>
                    <option value="Recycle">Recycle</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedReturn(null)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button onClick={handleUpdate} className="btn-primary flex-1">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
