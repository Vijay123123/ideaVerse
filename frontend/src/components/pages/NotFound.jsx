import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 className="page-title">404 - Page Not Found</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
