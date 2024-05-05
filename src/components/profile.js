import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const userRoleRef = useRef('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!isAuthenticated || !user?.sub) return;

        const token = await getAccessTokenSilently();
        const response = await fetch('https://fundit.azurewebsites.net/userData', {
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

        const userData = await response.json();
        setUserInfo(userData);
        userRoleRef.current = userData.role;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently, user?.sub]);

  return (
    <>
      {/* Conditionally render based on user's role */}
      {userInfo && userRoleRef.current !== 'blocked' ? (
        <>
          {user?.nickname && <p>User Nickname: {user.nickname}</p>}
          {user?.email && <p>User Email: {user.email}</p>}
          {user?.sub && <p>User ID: {user.sub}</p>}
          <p>Role: {userInfo.role}</p>
        </>
      ) : (
        <p>Your account has been blocked. Please contact the administrator for assistance.</p>
      )}
    </>
  );
};

export default Profile;
