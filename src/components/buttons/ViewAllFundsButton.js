import React, { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

const ViewAllFundsButton = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [setUserInfo] = useState(null);
  const userRoleRef = useRef('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user?.sub) return;

      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('https://fundit.azurewebsites.net/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userID: user.sub })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserInfo(data);
        userRoleRef.current = data.role;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently, user?.sub]);

  return (
    <>
      {isAuthenticated && userRoleRef.current === 'applicant' && (
        <Link to="/apply-for-fund">
          <button className='button'>View All Funds</button>
        </Link>
      )}
    </>
  );
};

export default ViewAllFundsButton;
