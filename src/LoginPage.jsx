import React, { useState, useEffect } from 'react';
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };

  // This will be triggered after the redirect back from the provider's sign in flow.
  useEffect(() => {
    const auth = getAuth();
    getRedirectResult(auth)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // Navigate to the home page after the user has logged in.
        if (user) {
          navigate('/');
        }
        setLoading(false); // Set loading to false after user is logged in
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        setLoading(false); // Set loading to false if there was an error
      });
  }, [navigate]);

  if (loading) { // Show loading message while waiting for getRedirectResult
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Welcome to ADHDo!</h1>
      <p>ADHDo is a useful To Do List manager for ADHD people that helps break down project into accessible tasks, and gives an overview of time management.</p>
      <h3>Please sign in with your Google account to continue.</h3>
      <div>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </>
  );
}

export default LoginPage;