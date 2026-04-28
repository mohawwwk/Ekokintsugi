import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReviews: 0,
    totalReturns: 0,
    pendingReturns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/users');
      const users = response.data.users;
      
      setStats({
        totalUsers: users.length,
        totalReviews: users.reduce((sum, u) => sum + (u.reviews?.length || 0), 0),
        totalReturns: users.reduce((sum, u) => sum + (u.returns?.length || 0), 0),
        pendingReturns: users.reduce((sum, u) => sum + (u.returns?.filter(r => r.status === 'Requested').length || 0), 0)
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-lg">🌱</span>
            </div>
            <span className="font-bold text-gray-900">EkoKintsugi Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">User View</Link>
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalReviews}</p>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">↩️</div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalReturns}</p>
            <p className="text-sm text-gray-600">Total Returns</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">⏳</div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingReturns}</p>
            <p className="text-sm text-gray-600">Pending Returns</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/admin/users" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600">Create and view users</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/returns" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">↩️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Returns</h3>
                <p className="text-sm text-gray-600">Process return requests</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/points" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Points</h3>
                <p className="text-sm text-gray-600">Add or redeem points</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
