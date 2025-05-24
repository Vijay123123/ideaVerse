import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [likedIdeas, setLikedIdeas] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([
    'All', 'Technology', 'Business', 'Education', 'Health', 'Entertainment', 'Other'
  ]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        let url = `${import.meta.env.VITE_API_URL}/ideas`;

        if (filter !== 'all' && filter !== 'All') {
          url = `${import.meta.env.VITE_API_URL}/ideas/filter/category?category=${filter}`;
        }

        const response = await axios.get(url);
        setIdeas(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ideas');
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [filter]);

  // Filter and sort ideas based on search term and sort option
  useEffect(() => {
    let result = [...ideas];

    // Apply search filter if there's a search term
    if (searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(idea =>
        idea.title.toLowerCase().includes(searchTermLower) ||
        idea.description.toLowerCase().includes(searchTermLower)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'most-liked':
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'least-liked':
        result.sort((a, b) => (a.likes || 0) - (b.likes || 0));
        break;
      case 'a-z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default to newest
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredIdeas(result);
  }, [searchTerm, ideas, sortBy]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleDeleteIdea = async (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        const token = await user.getToken();

        await axios.delete(`${import.meta.env.VITE_API_URL}/ideas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setIdeas(ideas.filter(idea => idea._id !== id));
      } catch (err) {
        console.error('Error deleting idea:', err);
        setError('Failed to delete idea');
      }
    }
  };

  const handleViewIdea = (id) => {
    navigate(`/ideas/${id}`);
  };

  const handleLikeIdea = async (id) => {
    try {
      let token = '';
      try {
        // Try to get the token from Clerk
        token = await user.getToken();
      } catch (authError) {
        console.warn('Auth error, using fallback:', authError);
      }

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ideas/${id}/like`, {}, { headers });

      // Update the likes count in the UI
      setIdeas(prevIdeas =>
        prevIdeas.map(idea =>
          idea._id === id
            ? { ...idea, likes: response.data.likes }
            : idea
        )
      );

      // Update liked status in state
      setLikedIdeas(prev => ({
        ...prev,
        [id]: response.data.liked
      }));

    } catch (err) {
      console.error('Error liking idea:', err);
      setError('Failed to like idea');
    }
  };

  // Check if user has liked each idea
  useEffect(() => {
    const checkLikedStatus = async () => {
      if (!user || !ideas.length) return;

      try {
        let token = '';
        try {
          token = await user.getToken();
        } catch (authError) {
          console.warn('Auth error, using fallback:', authError);
        }

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        // Create an object to store liked status for each idea
        const likedStatus = {};

        // Check liked status for each idea
        for (const idea of ideas) {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/ideas/${idea._id}/liked`,
              { headers }
            );
            likedStatus[idea._id] = response.data.liked;
          } catch (err) {
            console.error(`Error checking like status for idea ${idea._id}:`, err);
          }
        }

        setLikedIdeas(likedStatus);
      } catch (err) {
        console.error('Error checking liked status:', err);
      }
    };

    checkLikedStatus();
  }, [user, ideas]);

  // Function to get category color
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Technology':
        return 'var(--tech-color)';
      case 'Business':
        return 'var(--business-color)';
      case 'Education':
        return 'var(--education-color)';
      case 'Health':
        return 'var(--health-color)';
      case 'Entertainment':
        return 'var(--entertainment-color)';
      case 'Other':
        return 'var(--other-color)';
      default:
        return 'var(--primary-color)';
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Ideas Dashboard</h1>

        <div className="dashboard-filters">
          <div className="filter-row">
            <div className="filter-group">
              <div className="filter-item">
                <label htmlFor="category-filter" className="form-label">Filter by Category:</label>
                <select
                  id="category-filter"
                  className="form-control"
                  value={filter}
                  onChange={handleFilterChange}
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All' ? 'all' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label htmlFor="sort-ideas" className="form-label">Sort by:</label>
                <select
                  id="sort-ideas"
                  className="form-control"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-liked">Most Liked</option>
                  <option value="least-liked">Least Liked</option>
                  <option value="a-z">A-Z</option>
                  <option value="z-a">Z-A</option>
                </select>
              </div>
            </div>

            <div className="search-group">
              <div className="search-input-wrapper">
                <label htmlFor="search-ideas" className="form-label">Search Ideas:</label>
                <div className="search-input-container">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="search-icon">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                  <input
                    type="text"
                    id="search-ideas"
                    className="form-control"
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              {searchTerm && (
                <button
                  className="btn-secondary clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', marginBottom: '15px' }}>
            {searchTerm && (
              <div className="search-results-info">
                Found {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'} matching "{searchTerm}"
              </div>
            )}

            <div className="sort-indicator">
              {sortBy === 'newest' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
                  </svg>
                  Sorted by Newest
                </>
              )}
              {sortBy === 'oldest' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                  </svg>
                  Sorted by Oldest
                </>
              )}
              {sortBy === 'most-liked' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                  </svg>
                  Sorted by Most Liked
                </>
              )}
              {sortBy === 'least-liked' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                  </svg>
                  Sorted by Least Liked
                </>
              )}
              {sortBy === 'a-z' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                    <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                  </svg>
                  Sorted A-Z
                </>
              )}
              {sortBy === 'z-a' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                    <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
                  </svg>
                  Sorted Z-A
                </>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading ideas...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="grid">
            {filteredIdeas.length > 0 ? (
              filteredIdeas.map(idea => (
                <div
                  className="card"
                  key={idea._id}
                  style={{
                    borderLeft: `4px solid ${getCategoryColor(idea.category)}`
                  }}>
                  {idea.imageUrl && (
                    <div className="card-image">
                      <img
                        src={idea.imageUrl}
                        alt={idea.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px 8px 0 0'
                        }}
                      />
                    </div>
                  )}
                  <h3 className="card-title">{idea.title}</h3>
                  <div className="card-body">
                    <p>{idea.description.length > 150
                      ? `${idea.description.substring(0, 150)}...`
                      : idea.description}
                    </p>
                    <p>
                      <strong>Category: </strong>
                      <span style={{
                        color: getCategoryColor(idea.category),
                        backgroundColor: `${getCategoryColor(idea.category)}20`,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        {idea.category}
                      </span>
                    </p>
                    <p><strong>Posted by:</strong> {idea.userName}</p>
                    <p><strong>Date:</strong> {new Date(idea.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="card-footer" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <button
                        className={`btn-${idea.category === 'Technology' ? 'primary' :
                                  idea.category === 'Business' ? 'accent-2' :
                                  idea.category === 'Education' ? 'accent-1' :
                                  idea.category === 'Health' ? 'success' :
                                  idea.category === 'Entertainment' ? 'danger' :
                                  'accent-3'}`}
                        onClick={() => handleViewIdea(idea._id)}
                        style={{
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        View More
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                      </button>

                      <div className="like-button-container" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button
                          onClick={() => handleLikeIdea(idea._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: likedIdeas[idea._id] ? 'var(--danger-color)' : 'var(--gray-text)',
                            transition: 'all 0.3s ease',
                            padding: '5px',
                            borderRadius: '50%',
                            cursor: 'pointer'
                          }}
                          aria-label={likedIdeas[idea._id] ? "Unlike this idea" : "Like this idea"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            style={{
                              transform: likedIdeas[idea._id] ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.3s ease'
                            }}
                          >
                            {likedIdeas[idea._id] ? (
                              <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            ) : (
                              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                            )}
                          </svg>
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: likedIdeas[idea._id] ? '600' : '400',
                            color: likedIdeas[idea._id] ? 'var(--danger-color)' : 'var(--gray-text)'
                          }}>
                            {idea.likes || 0}
                          </span>
                        </button>
                      </div>
                    </div>

                    {user && user.id === idea.userId && (
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteIdea(idea._id)}
                        style={{ fontSize: '0.9rem' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                {searchTerm ? (
                  <p>No ideas found matching "{searchTerm}". Try a different search term.</p>
                ) : (
                  <p>No ideas found. Try a different filter or add your own idea!</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
