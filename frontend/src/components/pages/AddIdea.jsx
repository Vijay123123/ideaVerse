import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const AddIdea = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Technology', 'Business', 'Education', 'Health', 'Entertainment', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let token = '';
      let userId = '';
      let userName = '';

      try {
        // Try to get the token from Clerk
        token = await user.getToken();
        userId = user.id;
        userName = user.fullName || user.username;
      } catch (authError) {
        console.warn('Auth error, using fallback:', authError);
        // Fallback for development
        userId = 'dev-user-id';
        userName = 'Developer';
      }

      console.log('Submitting idea with token:', token ? 'Token present' : 'No token');

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      await axios.post(`${import.meta.env.VITE_API_URL}/ideas`, {
        ...formData,
        userId,
        userName
      }, { headers });

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: 'Technology',
        imageUrl: ''
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="page-title">Add New Idea</h1>

        {success && (
          <div className="alert alert-success">
            Idea added successfully! Redirecting to dashboard...
          </div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter a catchy title for your idea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl" className="form-label">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                className="form-control"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Enter a URL for an image that represents your idea"
              />
              <small className="form-text" style={{ color: 'var(--gray-text)' }}>
                For best results, use an image with a 16:9 aspect ratio
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Describe your idea in detail"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Adding...' : 'Add Idea'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddIdea;
