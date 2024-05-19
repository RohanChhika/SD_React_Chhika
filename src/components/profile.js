import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';


const Profile = () => {
  // Destructure Auth0 hook to get user, authentication status, and token functions
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  // State to store user information fetched from the server
  const [userInfo, setUserInfo] = useState(null);
  // Ref to store the user role
  const userRoleRef = useRef('');

  useEffect(() => {
    // Function to fetch user data from the server
    const fetchUserData = async () => {
      // Early exit if not authenticated or user.sub is undefined
      if (!isAuthenticated || !user?.sub) return;

      try {
        // Get the access token silently
        const token = await getAccessTokenSilently();
        // Fetch user data from the server
        const response = await fetch('https://fundit.azurewebsites.net/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userID: user.sub })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // Throw error if response is not OK
        }

        // Parse and set the user data
        const data = await response.json();
        setUserInfo(data);
        userRoleRef.current = data.role; // Store user role in ref
      } catch (error) {
        console.error('Failed to fetch user data:', error); // Log errors to console
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently, user?.sub]); // Dependency array for useEffect

  return (
    <div className="profile-centered">
      <div className='profile-details'>
      {userRoleRef.current === 'blocked' ? (
        <p className="blocked">Your account has been blocked. Please contact the administrator for assistance.</p> // Display this if user is blocked
      ) : (
        <>
          <p>{user?.nickname}</p>
          <p>{user?.email}</p>
          {user?.sub && <p>User ID: {user.sub}</p>}
          {userInfo && <p>Role: {userInfo.role}</p>}
        </>
      )}
    </div>
    </div>
    
  );
};

export default Profile;
