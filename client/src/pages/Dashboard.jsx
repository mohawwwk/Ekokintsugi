import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/user/me');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
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

  const progress = data ? (data.user.reviewsCompleted / data.user.maxReviews) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-lg">🌱</span>
            </div>
            <span className="font-bold text-gray-900">EkoKintsugi</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
              {user.role}
            </span>
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Welcome, {data?.user?.name}</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👟</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Shoe</p>
                <p className="font-semibold text-gray-900">
                  {data?.shoe?.productLine || 'Not Assigned'}
                </p>
              </div>
            </div>
            {data?.shoe && (
              <div className="text-sm text-gray-600 space-y-1">
                <p>ID: {data.shoe.shoeId}</p>
                <p>Size: {data.shoe.size}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  data.shoe.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  data.shoe.status === 'PreBooked' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {data.shoe.status}
                </span>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌳</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Tree</p>
                <p className="font-semibold text-gray-900">
                  {data?.tree?.plantType || 'Not Assigned'}
                </p>
              </div>
            </div>
            {data?.tree && (
              <div className="text-sm text-gray-600 space-y-1">
                <p>ID: {data.tree.treeId}</p>
                <p>Location: {data.tree.location}</p>
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {data.tree.status}
                </span>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Points</p>
                <p className="font-semibold text-2xl text-gray-900">{data?.user?.pointsRemaining}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Total: {data?.user?.pointsTotal}</p>
              <p>Used: {data?.user?.pointsUsed}</p>
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Review Progress</h2>
              <p className="text-sm text-gray-600">{data?.user?.reviewsCompleted} of {data?.user?.maxReviews} weeks completed</p>
            </div>
            <Link to="/review" className="btn-primary">
              {data?.user?.reviewsCompleted < 8 ? 'Submit Review' : 'View Reviews'}
            </Link>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Your QR Code</h3>
            <div className="text-center">
              <Link
                to={`/qr/${user.id}`}
                className="inline-block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="w-32 h-32 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-4xl">📱</span>
                </div>
                <span className="text-sm text-primary-600 font-medium">View QR Code</span>
              </Link>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/review" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📝</span>
                  <span className="text-gray-900">Weekly Review</span>
                </div>
              </Link>
              <Link to="/return" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">↩️</span>
                  <span className="text-gray-900">Request Return</span>
                </div>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚙️</span>
                    <span className="text-primary-700 font-medium">Admin Panel</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {data?.reviews?.length > 0 && (
          <div className="card mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Reviews</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Week</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Days Worn</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Hours/Day</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Comfort</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Fit</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.reviews.slice(0, 4).map((review) => (
                    <tr key={review.id} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-medium">Week {review.weekNumber}</td>
                      <td className="py-2 px-3">{review.daysWorn}</td>
                      <td className="py-2 px-3">{review.hoursPerDay}</td>
                      <td className="py-2 px-3">{review.comfort}/10</td>
                      <td className="py-2 px-3">{review.fit}/10</td>
                      <td className="py-2 px-3 text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
