import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';



const ApplyFundManagerButton = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const userRole = '' 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!isAuthenticated || !user?.sub) return; // Exit if user is not authenticated or user.sub is undefined

        const token = await getAccessTokenSilently(); // Get the Auth0 access token
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
        userRole = data.role;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Handle error here, e.g., display an error message to the user
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently, user?.sub]);




  return (
    <>
      { userInfo && userRole === 'applicant' && (
        <Link to="/fund-manager-request">
          <button>Apply for Fund Manager</button>
        </Link>
      )}
    </>
  );
};

export default ApplyFundManagerButton;
