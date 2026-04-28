import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'supporter',
    city: '',
    address: '',
    shoeSize: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/admin/create-user', formData);
      setSuccess('User created successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'supporter',
        city: '',
        address: '',
        shoeSize: ''
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700',
      intern: 'bg-blue-100 text-blue-700',
      team: 'bg-green-100 text-green-700',
      supporter: 'bg-gray-100 text-gray-700'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-700'}`;
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
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">← Admin</Link>
            <h1 className="font-semibold text-gray-900">Manage Users</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={users.length >= 10}
            className="btn-primary disabled:opacity-50"
          >
            Create User ({users.length}/10)
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
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

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Shoe</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Reviews</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Points</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={getRoleBadge(user.role)}>{user.role}</span>
                    </td>
                    <td className="py-3 px-4">
                      {user.shoe ? (
                        <div>
                          <p className="text-sm text-gray-900">{user.shoe.shoeId}</p>
                          <p className="text-xs text-gray-500">{user.shoe.size}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">No shoe</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{user.reviewsCompleted || 0}/{user.maxReviews}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{user.pointsRemaining}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/qr/${user.id}`}
                        className="text-primary-600 hover:underline text-sm"
                      >
                        View QR
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Create New User</h2>
                <p className="text-sm text-gray-600">Maximum 10 users allowed</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+62..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="supporter">Supporter</option>
                      <option value="team">Team</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shoe Size</label>
                    <select
                      name="shoeSize"
                      value={formData.shoeSize}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select</option>
                      {[38,39,40,41,42,43,44,45,46,47].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Street address"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
