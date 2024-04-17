import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);

  // Move the conditional check inside the useEffect
  useEffect(() => {
    // Only execute the code inside the useEffect if isAuthenticated is true
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const token = await getAccessTokenSilently(); // Get the Auth0 access token
          const response = await fetch('http://localhost:3000/login', {
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
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated, getAccessTokenSilently, user?.email]);  // Dependencies remain the same

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