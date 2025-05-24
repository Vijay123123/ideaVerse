import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useUser, useClerk, SignedIn, SignedOut } from '@clerk/clerk-react';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = () => {
    signOut();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">IdeaVerse</Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>

          <SignedIn>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/add-idea" className="navbar-link">Add Idea</Link>
          </SignedIn>

          <SignedOut>
            <Link to="/sign-in" className="navbar-link">Sign In</Link>
            <Link to="/sign-up" className="navbar-link">Sign Up</Link>
          </SignedOut>

          {/* Theme Toggle Button */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sun-icon"
              style={{
                opacity: theme === 'dark' ? 1 : 0,
                transform: theme === 'dark' ? 'translateY(0)' : 'translateY(-20px)'
              }}
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="moon-icon"
              style={{
                opacity: theme === 'light' ? 1 : 0,
                transform: theme === 'light' ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>

          {isSignedIn && (
            <div className="user-profile-container" ref={dropdownRef} style={{ position: 'relative' }}>
              <div
                className="user-profile"
                onClick={toggleDropdown}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <span className="navbar-link">
                  Hi, {user.firstName || user.username}
                </span>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '5px solid var(--primary-color)',
                  transition: 'transform 0.3s ease',
                  transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)'
                }}></div>
              </div>

              {showDropdown && (
                <div className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '8px',
                  marginTop: '10px',
                  zIndex: '100',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  minWidth: '180px'
                }}>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-color)',
                      cursor: 'pointer',
                      fontWeight: '500',
                      padding: '10px 12px',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                    </svg>
                    View Profile
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="dropdown-item sign-out-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger-color)',
                      cursor: 'pointer',
                      fontWeight: '500',
                      padding: '10px 12px',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      borderRadius: '6px',
                      transition: 'all 0.3s ease',
                      marginTop: '4px'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                      <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
