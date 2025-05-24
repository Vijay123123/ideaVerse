import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [featuredIdeas, setFeaturedIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedIdeas, setLikedIdeas] = useState({});

  useEffect(() => {
    const fetchFeaturedIdeas = async () => {
      try {
        // Reduced to 2 featured ideas
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/ideas?limit=2`);
        setFeaturedIdeas(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ideas');
        setLoading(false);
      }
    };

    fetchFeaturedIdeas();
  }, []);

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
      setFeaturedIdeas(prevIdeas =>
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
      if (!user || !featuredIdeas.length) return;

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
        for (const idea of featuredIdeas) {
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
  }, [user, featuredIdeas]);

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
        <section className="hero">
          <h1 className="page-title">Welcome to IdeaVerse</h1>
          <p className="hero-description">
            A platform to share, discover, and collaborate on innovative ideas.
            Join our community of thinkers, creators, and innovators today!
          </p>
          <div className="hero-buttons">
            <Link to="/sign-up" className="btn-hero-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="btn-icon">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Get Started
            </Link>
            <Link to="/dashboard" className="btn-hero-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="btn-icon">
                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                <path d="M13.5 1a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11A1.5 1.5 0 0 1 2.5 1h11zm-11-1a2.5 2.5 0 0 0-2.5 2.5v11a2.5 2.5 0 0 0 2.5 2.5h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0h-11z"/>
                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM8 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM11 4.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM8 4.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
              </svg>
              Explore Ideas
            </Link>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">How It Works</h2>
          <div className="grid">
            <div className="card-feature">
              <div className="card-feature-icon" style={{ background: 'rgba(243, 156, 18, 0.1)' }}></div>
              <h3 className="card-feature-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--accent-color-2)" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Share Your Ideas
              </h3>
              <div className="card-feature-body">
                <p>Have a brilliant idea? Share it with our community and get feedback from innovators worldwide. Add details, images, and categorize your ideas.</p>
              </div>
            </div>

            <div className="card-feature">
              <div className="card-feature-icon" style={{ background: 'rgba(155, 89, 182, 0.1)' }}></div>
              <h3 className="card-feature-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--accent-color-1)" viewBox="0 0 16 16">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM6.79 5.093A.5.5 0 0 1 7 5.5v1.5H5.5a.5.5 0 0 1 0-1H7V5.5a.5.5 0 0 1-.21-.407z"/>
                  <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                </svg>
                Discover Innovations
              </h3>
              <div className="card-feature-body">
                <p>Browse through ideas from creative minds around the world. Filter by categories, search for specific topics, and find inspiration for your next project.</p>
              </div>
            </div>

            <div className="card-feature">
              <div className="card-feature-icon" style={{ background: 'rgba(26, 188, 156, 0.1)' }}></div>
              <h3 className="card-feature-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--accent-color-3)" viewBox="0 0 16 16">
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                </svg>
                Collaborate
              </h3>
              <div className="card-feature-body">
                <p>Connect with like-minded individuals and turn ideas into reality. Like and comment on ideas, reach out to creators, and build something amazing together.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Featured Ideas</h2>
            <Link
              to="/dashboard"
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.9rem',
                padding: '8px 15px'
              }}
            >
              View All Ideas
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </Link>
          </div>

          {loading ? (
            <p>Loading ideas...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="grid">
              {featuredIdeas.length > 0 ? (
                featuredIdeas.map(idea => (
                  <div
                    className="card-idea"
                    key={idea._id}
                    style={{
                      borderLeft: `4px solid ${getCategoryColor(idea.category)}`
                    }}>
                    {idea.imageUrl && (
                      <div className="card-idea-image">
                        <img
                          src={idea.imageUrl}
                          alt={idea.title}
                        />
                      </div>
                    )}
                    <h3 className="card-idea-title">{idea.title}</h3>
                    <div className="card-idea-body">
                      <p>{idea.description.substring(0, 150)}...</p>
                    </div>
                    <div className="card-idea-footer">
                      <div className="card-idea-meta">
                        <span
                          className="card-idea-category"
                          style={{
                            color: getCategoryColor(idea.category),
                            backgroundColor: `${getCategoryColor(idea.category)}20`
                          }}
                        >
                          {idea.category}
                        </span>
                        <span className="card-idea-author">By: {idea.userName}</span>
                        <button
                          className={`card-idea-likes ${likedIdeas[idea._id] ? 'liked' : ''}`}
                          onClick={() => handleLikeIdea(idea._id)}
                          aria-label={likedIdeas[idea._id] ? "Unlike this idea" : "Like this idea"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            {likedIdeas[idea._id] ? (
                              <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            ) : (
                              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                            )}
                          </svg>
                          <span>{idea.likes || 0}</span>
                        </button>
                      </div>

                      <button
                        className={`card-view-more btn-${idea.category === 'Technology' ? 'primary' :
                                  idea.category === 'Business' ? 'accent-2' :
                                  idea.category === 'Education' ? 'accent-1' :
                                  idea.category === 'Health' ? 'success' :
                                  idea.category === 'Entertainment' ? 'danger' :
                                  'accent-3'}`}
                        onClick={() => handleViewIdea(idea._id)}
                      >
                        View More
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No ideas found. Be the first to share your idea!</p>
              )}
            </div>
          )}

          <div className="card-cta">
            <h3 className="card-cta-title">
              Discover more innovative ideas in our community!
            </h3>
            <p className="card-cta-description">
              These are just a few featured ideas. Visit our dashboard to explore all ideas,
              filter by categories, and find inspiration.
            </p>
            <Link
              to="/dashboard"
              className="card-cta-button"
            >
              Explore All Ideas
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </Link>
          </div>
        </section>


      </div>
    </div>
  );
};

export default Home;
