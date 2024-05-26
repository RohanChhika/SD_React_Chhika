import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const userRoleRef = useRef('');

  useEffect(() => {
    if (!isAuthenticated || !user?.sub) return;

    const fetchUserData = async () => {
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
    <main className="profile-centered"> 
      <article className='profile-details'> 
        {userRoleRef.current === 'blocked' ? (
          <p className="blocked">Your account has been blocked. Please contact the administrator for assistance.</p>
        ) : (
          <>
            <p>{user?.nickname}</p>
            <p>{user?.email}</p>
            {user?.sub && <p>User ID: {user.sub}</p>}
            {userInfo && <p>Role: {userInfo.role}</p>}
          </>
        )}
      </article>
    </main>
  );
};

export default Profile;
