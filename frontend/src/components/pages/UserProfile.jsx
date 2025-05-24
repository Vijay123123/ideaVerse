import { useUser } from '@clerk/clerk-react';

const UserProfile = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh'
          }}>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-danger">
            User not found. Please sign in again.
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">User Profile</h1>

        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={`${user.firstName || user.username}'s avatar`}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2 className="profile-name">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || user.username || 'User'
                  }
                </h2>
                <p className="profile-username">@{user.username || 'username'}</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-section">
                <h3 className="section-title">Account Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      {user.primaryEmailAddress?.emailAddress || 'Not provided'}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">
                      {user.primaryPhoneNumber?.phoneNumber || 'Not provided'}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Member Since:</span>
                    <span className="detail-value">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">
                      {formatDate(user.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="section-title">Account Status</h3>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="status-label">Email Verified:</span>
                    <span className={`status-badge ${user.primaryEmailAddress?.verification?.status === 'verified' ? 'verified' : 'unverified'}`}>
                      {user.primaryEmailAddress?.verification?.status === 'verified' ? 'Verified' : 'Unverified'}
                    </span>
                  </div>

                  <div className="status-item">
                    <span className="status-label">Phone Verified:</span>
                    <span className={`status-badge ${user.primaryPhoneNumber?.verification?.status === 'verified' ? 'verified' : 'unverified'}`}>
                      {user.primaryPhoneNumber?.verification?.status === 'verified' ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button
                  className="btn-primary"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
