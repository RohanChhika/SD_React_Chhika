import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../components/Images/logo1.png';

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const userRoleRef = useRef('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user?.sub) return; // Early exit if not authenticated or user.sub is undefined

      try {
        const token = await getAccessTokenSilently(); // Get the access token silently
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
    <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>My Profile</h1>
      </header>
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
