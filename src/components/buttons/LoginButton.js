import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = ({onUserAdded}) => {
  // Destructure necessary functions and variables from useAuth0 hook
  const { loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // Function to add the user to the database
    const addUserToDatabase = async () => {
      if (!user) return; // Only proceed if the user is defined
      try {
        // Get the access token silently
        const token = await getAccessTokenSilently();
        // Send a POST request to add the user to the database
        const response = await fetch('https://fundit.azurewebsites.net/signup', {
          method: 'POST',   // Specify POST method
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userID: user.sub, // Auth0 user identifier
            role: 'applicant',  // Default role assigned to the user
            contact: user.email // User email from Auth0
          })
        });
        
        // Check if the response is not ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('User added to the database successfully.');
      } catch (error) {
        console.error('Failed to add user to the database:', error);
      }
      // Call the onUserAdded callback function
      onUserAdded();
    };

    if (isAuthenticated) {
      // Call addUserToDatabase function if the user is authenticated
      addUserToDatabase();
    }
  }, [isAuthenticated, user, getAccessTokenSilently, onUserAdded]);

  // Render the Log In button only if the user is not authenticated
  return !isAuthenticated && (
    <button className="button" onClick={() => loginWithRedirect()}>
      Log In
    </button>
  );
};

export default LoginButton;