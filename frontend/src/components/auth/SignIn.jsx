import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

const SignIn = () => {
  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Sign In</h1>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <ClerkSignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
