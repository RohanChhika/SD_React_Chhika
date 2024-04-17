import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!isAuthenticated || !user?.sub) return; // Exit if user is not authenticated or user.sub is undefined

        const token = await getAccessTokenSilently(); // Get the Auth0 access token
        const response = await fetch('https://your-api-endpoint/login', { // Replace 'https://your-api-endpoint/login' with your actual API endpoint URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userID: user.sub
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
  }, [isAuthenticated, getAccessTokenSilently, user?.sub]); // Include user.sub as a dependency

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
