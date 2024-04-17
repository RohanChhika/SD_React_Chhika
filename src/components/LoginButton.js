import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const addUserToDatabase = async () => {
      if (!user) return; // Only proceed if the user is defined

      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('http://fundit.azurewebsites.net/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userID: user.sub, // Auth0 user identifier
            role: 'applicant',
            contact: user.email // User email from Auth0
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('User added to the database successfully.');
      } catch (error) {
        console.error('Failed to add user to the database:', error);
      }
    };

    if (isAuthenticated) {
      addUserToDatabase();
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return !isAuthenticated && (
    <button onClick={() => loginWithRedirect()}>
      Log In
    </button>
  );
};

export default LoginButton;
