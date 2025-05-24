import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

const SignUp = () => {
  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Sign Up</h1>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <ClerkSignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
