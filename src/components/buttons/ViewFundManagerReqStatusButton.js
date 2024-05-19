import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ViewMyFundManagerReqStatusButton = () => {
  // Destructure necessary functions and variables from useAuth0 hook
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  // State to store user information
  const [userInfo, setUserInfo] = useState(null);
  // Ref to store user role
  const userRoleRef = useRef('');

  useEffect(() => {
    // Function to fetch user data from the server
    const fetchUserData = async () => {
      try {
        // Check if the user is authenticated and user.sub exists
        if (!isAuthenticated || !user?.sub) return;

        // Get the access token silently
        const token = await getAccessTokenSilently();
        // Fetch user data from the server
        const response = await fetch('https://fundit.azurewebsites.net/login', {
          method: 'POST', // Specify POST method
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            // Include user ID in the request body
            userID: user.sub
          })
        });

        // Check if the response is not ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and set the user data
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
    {/* Render the View My Fund Manager Request Status button only if userInfo is available and user role is 'applicant' */}
      {userInfo && userRoleRef.current === 'applicant' && (
        <Link to="/fund-req-status">    {/* Link to the fund-req-status route */}
          <button className='button'>View My Fund Manager Request Status</button>   {/* Button to view fund manager request status */}
        </Link>
      )}
    </>
  );
};

export default ViewMyFundManagerReqStatusButton;
