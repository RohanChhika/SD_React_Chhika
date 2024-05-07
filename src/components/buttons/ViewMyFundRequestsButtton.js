import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ViewMyFundRequestsButton = () => {
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
        console.log('User data:', data); // Log user data to inspect it
        setUserInfo(data);
        userRoleRef.current = data.role; // Update userRoleRef instead of userRole
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently, user?.sub]);

  console.log('UserRoleRef:', userRoleRef.current); // Log userRoleRef to inspect its value

  return (
    <>
      {userInfo && userRoleRef.current === 'manager' && (
        <Link to="/view-my-fund-requests">
          <button className='button'>View My Fund Requests</button>
        </Link>
      )}
    </>
  );
};

export default ViewMyFundRequestsButton;
