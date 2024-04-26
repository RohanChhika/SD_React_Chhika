import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ApplyFundManagerButton = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const userRoleRef = useRef('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!isAuthenticated || !user?.sub) return;

        const token = await getAccessTokenSilently();
        const response = await fetch('https://fundit.azurewebsites.net/login', {
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
        userRoleRef.current = data.role; // Update userRoleRef instead of userRole
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently, user?.sub]);

  return (
    <>
      <p>{user?.nickname}</p>
      <p>{user?.email}</p>
      {user?.sub && <p>User ID: {user.sub}</p>}
      {userInfo && <p>Role: {userInfo.role}</p>}
    </>
  );
};

export default ApplyFundManagerButton;
