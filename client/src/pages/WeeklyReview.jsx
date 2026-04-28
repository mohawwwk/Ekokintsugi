import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function WeeklyReview() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weekNumber: 1,
    daysWorn: 5,
    hoursPerDay: 8,
    comfort: 7,
    fit: 7,
    sole: 7,
    material: 7,
    stitching: 7,
    feedback: ''
  });
  const [existingReviews, setExistingReviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/user/me');
      setExistingReviews(response.data.reviews || []);
      
      const nextWeek = (response.data.reviews?.length || 0) + 1;
      if (nextWeek > 8) {
        setError('You have completed all 8 weekly reviews!');
      } else {
        setFormData(prev => ({ ...prev, weekNumber: nextWeek }));
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/reviews', formData);
      setSuccess('Review submitted successfully! You earned 10 points.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const getWeekStatus = (week) => {
    const review = existingReviews.find(r => r.weekNumber === week);
    return review ? 'completed' : 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
          <h1 className="font-semibold text-gray-900">Weekly Review</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Progress</h2>
          <div className="flex gap-2">
            {[1,2,3,4,5,6,7,8].map(week => (
              <div
                key={week}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                  getWeekStatus(week) === 'completed'
                    ? 'bg-primary-600 text-white'
                    : formData.weekNumber === week
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {week}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {existingReviews.length} of 8 weeks completed
          </p>
        </div>

        {error && formData.weekNumber > 8 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {error && formData.weekNumber <= 8 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Week {formData.weekNumber} Review
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days Worn This Week (1-7)
              </label>
              <input
                type="number"
                name="daysWorn"
                value={formData.daysWorn}
                onChange={handleChange}
                min="1"
                max="7"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours Per Day (1-24)
              </label>
              <input
                type="number"
                name="hoursPerDay"
                value={formData.hoursPerDay}
                onChange={handleChange}
                min="1"
                max="24"
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Rate Your Experience (1-10)</h3>
            <div className="space-y-4">
              {[
                { name: 'comfort', label: 'Comfort' },
                { name: 'fit', label: 'Fit' },
                { name: 'sole', label: 'Sole' },
                { name: 'material', label: 'Material' },
                { name: 'stitching', label: 'Stitching' }
              ].map(item => (
                <div key={item.name} className="flex items-center gap-4">
                  <span className="w-24 text-sm text-gray-600">{item.label}</span>
                  <input
                    type="range"
                    name={item.name}
                    value={formData[item.name]}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-8 text-center font-medium">{formData[item.name]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Feedback (Optional)
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              className="input-field h-24 resize-none"
              placeholder="Share your thoughts about the shoe..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || formData.weekNumber > 8}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </main>
    </div>
  );
}
