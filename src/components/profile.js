import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!isAuthenticated) return; // Exit if user is not authenticated

        const token = await getAccessTokenSilently(); // Get the Auth0 access token
        const response = await fetch('https://fundit.azurewebsites.net/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userID: user?.sub // Access user.sub safely
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Handle error here, e.g., display an error message to the user
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently, user]); // Include user object as a dependency

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!isAuthenticated) {
    return <>Please log in</>;
  }

  return (
    <>
      <p>{user.nickname}</p>
      <p>{user.email}</p>
      <p>User ID: {user.sub}</p>
      {userInfo && (
        <>
          <p>Role: {userInfo.role}</p>
        </>
      )}
    </>
  );
};

export default Profile;
