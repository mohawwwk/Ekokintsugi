import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function ReturnRequest() {
  const navigate = useNavigate();
  const [shoe, setShoe] = useState(null);
  const [formData, setFormData] = useState({
    reason: '',
    condition: 'Good'
  });
  const [existingReturns, setExistingReturns] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/user/me');
      setShoe(response.data.shoe);
      setExistingReturns(response.data.user?.returns || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!shoe) {
      setError('No shoe assigned to your account');
      setLoading(false);
      return;
    }

    try {
      await api.post('/returns/request', {
        shoeId: shoe.id,
        reason: formData.reason,
        condition: formData.condition
      });
      setSuccess('Return request submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit return request');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
          <h1 className="font-semibold text-gray-900">Return Request</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {existingReturns.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Return Requests</h2>
            <div className="space-y-3">
              {existingReturns.map(ret => (
                <div key={ret.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ret.reason}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(ret.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={getStatusBadge(ret.status)}>{ret.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Request a Return</h2>

          {shoe && (
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👟</span>
                <div>
                  <p className="font-medium text-gray-900">{shoe.productLine}</p>
                  <p className="text-sm text-gray-600">ID: {shoe.shoeId} | Size: {shoe.size}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Return
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="input-field h-24 resize-none"
              placeholder="Please describe why you are returning the shoe..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shoe Condition
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Good', 'Fair', 'Damaged'].map(condition => (
                <label
                  key={condition}
                  className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.condition === condition
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="condition"
                    value={condition}
                    checked={formData.condition === condition}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-medium">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !shoe}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Return Request'}
          </button>
        </form>
      </main>
    </div>
  );
}
