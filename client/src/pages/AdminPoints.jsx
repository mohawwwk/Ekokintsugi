import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminPoints() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsAction, setPointsAction] = useState('add');
  const [points, setPoints] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser || !points) return;
    
    setError('');
    setSuccess('');

    try {
      if (pointsAction === 'add') {
        await api.post('/points/add', {
          userId: selectedUser.id,
          points: parseInt(points)
        });
        setSuccess(`Added ${points} points to ${selectedUser.name}`);
      } else {
        await api.put('/points/redeem', {
          userId: selectedUser.id,
          points: parseInt(points)
        });
        setSuccess(`Redeemed ${points} points from ${selectedUser.name}`);
      }
      setPoints('');
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update points');
    }
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
          <h1 className="font-semibold text-gray-900">Manage Points</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Users & Points</h2>
            
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

            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="card">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">{user.pointsRemaining}</p>
                      <p className="text-xs text-gray-500">remaining</p>
                      <div className="flex gap-1 mt-1 justify-end">
                        <button
                          onClick={() => { setSelectedUser(user); setPointsAction('add'); }}
                          className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded hover:bg-primary-200"
                        >
                          + Add
                        </button>
                        <button
                          onClick={() => { setSelectedUser(user); setPointsAction('redeem'); }}
                          className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
                        >
                          - Redeem
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                    <span>Total: {user.pointsTotal}</span>
                    <span>Used: {user.pointsUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="card">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPointsAction('add')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      pointsAction === 'add'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-xl mb-1">➕</span>
                    <span className="font-medium">Add Points</span>
                  </button>
                  <button
                    onClick={() => setPointsAction('redeem')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      pointsAction === 'redeem'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-xl mb-1">➖</span>
                    <span className="font-medium">Redeem Points</span>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                <select
                  value={selectedUser?.id || ''}
                  onChange={(e) => setSelectedUser(users.find(u => u.id === e.target.value))}
                  className="input-field"
                >
                  <option value="">Choose a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.pointsRemaining} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="input-field"
                  placeholder="Enter points"
                  min="1"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedUser || !points}
                className="btn-primary w-full disabled:opacity-50"
              >
                {pointsAction === 'add' ? 'Add Points' : 'Redeem Points'}
              </button>
            </div>

            <div className="card mt-4">
              <h3 className="font-medium text-gray-900 mb-2">Quick Add Points</h3>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      if (selectedUser) {
                        setPoints(p);
                      }
                    }}
                    disabled={!selectedUser}
                    className="btn-secondary text-sm disabled:opacity-50"
                  >
                    +{p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
