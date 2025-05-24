import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import './index.css';

// Theme Context
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Home from './components/pages/Home';
import Dashboard from './components/pages/Dashboard';
import AddIdea from './components/pages/AddIdea';
import IdeaDetail from './components/pages/IdeaDetail';
import UserProfile from './components/pages/UserProfile';
import NotFound from './components/pages/NotFound';

// Auth Components
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_c2Vuc2libGUtdHVuYS0yNS5jbGVyay5hY2NvdW50cy5kZXYk';

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        elements: {
          rootBox: {
            boxShadow: 'none',
          },
          card: {
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            color: '#333333',
          },
          headerTitle: {
            color: 'var(--primary-color)',
          },
          headerSubtitle: {
            color: '#666666',
          },
          formButtonPrimary: {
            backgroundColor: 'var(--primary-color)',
            '&:hover': {
              backgroundColor: 'var(--secondary-color)',
            },
          },
          formFieldLabel: {
            color: '#333333',
          },
          formFieldInput: {
            backgroundColor: '#f5f5f5',
            color: '#333333',
            borderColor: '#e0e0e0',
            '&:focus': {
              borderColor: 'var(--primary-color)',
              backgroundColor: '#ffffff',
            }
          },
          footerActionLink: {
            color: 'var(--primary-color)',
          },
          footer: {
            color: '#666666',
          },
          dividerLine: {
            backgroundColor: '#e0e0e0',
          },
          dividerText: {
            color: '#666666',
          },
          socialButtonsBlockButton: {
            backgroundColor: '#f5f5f5',
            color: '#333333',
            border: '1px solid #e0e0e0',
            '&:hover': {
              backgroundColor: '#eeeeee',
            }
          },
          socialButtonsBlockButtonText: {
            color: '#333333',
          },
          identityPreviewText: {
            color: '#333333',
          },
          formFieldAction: {
            color: 'var(--primary-color)',
          },
          alert: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderColor: '#f5c6cb',
          },
        },
      }}
    >
      <ClerkLoading>
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'var(--dark-bg)'
        }}>
          <div className="loading-spinner" style={{
            width: '50px',
            height: '50px',
            border: '5px solid var(--border-color)',
            borderTop: '5px solid var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <ThemeProvider>
          <Router>
            <div className="app">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/add-idea" element={
                    <ProtectedRoute>
                      <AddIdea />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/ideas/:id" element={<IdeaDetail />} />
                  <Route path="/sign-in/*" element={<SignIn />} />
                  <Route path="/sign-up/*" element={<SignUp />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

export default App;
