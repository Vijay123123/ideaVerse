import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/ideas/${id}`);
        setIdea(response.data);
        setLoading(false);

        // Check if user has liked this idea
        if (user) {
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

            const likedResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/ideas/${id}/liked`,
              { headers }
            );
            setLiked(likedResponse.data.liked);
          } catch (likeErr) {
            console.error('Error checking like status:', likeErr);
          }
        }
      } catch (err) {
        setError('Failed to fetch idea details');
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id, user]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        let token = '';
        try {
          token = await user.getToken();
        } catch (authError) {
          console.warn('Auth error:', authError);
        }

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        await axios.delete(`${import.meta.env.VITE_API_URL}/ideas/${id}`, { headers });
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete idea');
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = async () => {
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

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ideas/${id}/like`,
        {},
        { headers }
      );

      // Update the idea with the new likes count
      setIdea(prevIdea => ({
        ...prevIdea,
        likes: response.data.likes
      }));

      // Update liked status
      setLiked(response.data.liked);
    } catch (err) {
      console.error('Error liking idea:', err);
      setError('Failed to like idea');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div className="loading-spinner" style={{
              width: '50px',
              height: '50px',
              border: '5px solid var(--border-color)',
              borderTop: '5px solid var(--primary-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Loading idea details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
          <button className="btn-primary" onClick={handleBack}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-danger">Idea not found</div>
          <button className="btn-primary" onClick={handleBack}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <button
          className="btn-secondary"
          onClick={handleBack}
          style={{ marginBottom: '20px' }}
        >
          ← Back
        </button>

        <div className="card" style={{ padding: '30px' }}>
          {idea.imageUrl && (
            <div className="card-image" style={{ marginBottom: '20px' }}>
              <img
                src={idea.imageUrl}
                alt={idea.title}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </div>
          )}

          <h1 className="card-title" style={{ fontSize: '2rem', marginBottom: '15px' }}>
            {idea.title}
          </h1>

          <div className="idea-meta" style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            color: 'var(--gray-text)',
            fontSize: '0.9rem',
            alignItems: 'center'
          }}>
            <div>
              <span style={{
                marginRight: '15px',
                display: 'inline-block',
                color: 'var(--primary-color)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: '500'
              }}>
                <strong>Category:</strong> {idea.category}
              </span>
              <span>
                <strong>Posted by:</strong> {idea.userName}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div>
                <strong>Date:</strong> {new Date(idea.createdAt).toLocaleDateString()}
              </div>

              {user && (
                <div className="like-button-container" style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={handleLike}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: liked ? 'var(--danger-color)' : 'var(--gray-text)',
                      transition: 'all 0.3s ease',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      boxShadow: liked ? '0 0 5px rgba(231, 76, 60, 0.3)' : 'none',
                      border: liked ? '1px solid rgba(231, 76, 60, 0.2)' : '1px solid transparent'
                    }}
                    aria-label={liked ? "Unlike this idea" : "Like this idea"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      style={{
                        transform: liked ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      {liked ? (
                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                      ) : (
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                      )}
                    </svg>
                    <span style={{
                      fontWeight: liked ? '600' : '400',
                      color: liked ? 'var(--danger-color)' : 'var(--gray-text)'
                    }}>
                      {idea.likes || 0}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="idea-description" style={{
            marginBottom: '30px',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap'
          }}>
            {idea.description}
          </div>

          {user && user.id === idea.userId && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px'
            }}>
              <button
                className="btn-danger"
                onClick={handleDelete}
              >
                Delete Idea
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;
