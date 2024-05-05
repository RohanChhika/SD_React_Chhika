import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import logo from '../components/Images/logo1.png';
import { useNavigate } from "react-router-dom";

const AdminBlockUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [Users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState({ username: '', role: '' }); // State to store selected user info
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getAccessTokenSilently(); // Assuming you have a way to retrieve the token
        const response = await fetch('https://fundit.azurewebsites.net/viewUsers', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        setUsers(data); 
        console.log('Users fetched successfully.');
      } catch (error) {
        console.error('Failed to fetch users:', error.message);
      }
    };
    fetchUsers();
  }, [getAccessTokenSilently]); 

  // Function to handle selecting a user info
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Set user info when a user is selected
    setUserInfo({ username: user.contact, role: user.role });
  };

  // Function to handle blocking a user
  const handleBlockUser = async () => {
    if (selectedUser) {
      try {
        const token = await getAccessTokenSilently(); // Retrieve the token
        const url = `https://fundit.azurewebsites.net/process-blockedUser/${selectedUser.userID}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        console.log("Blocked:", selectedUser);
        alert('User Blocked!'); // Optionally, display a success message to the user
        navigate(0); 
      } catch (error) {
        console.error('Failed to block user:', error.message);
      }
    } else {
      console.log("Please select a user first.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="center-text">
          <h1> All Users</h1>
        </div>
      </header>
      <main>
        <h1 className='admin-page' style={{ textAlign: 'center' }}>Admin View Users Page</h1>
        <h2 className='admin-page' style={{ textAlign: 'center' }}>Users</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <select className="motivation-select" style={{ width: '300px', textAlign: 'center' }} onChange={(e) => handleSelectUser(JSON.parse(e.target.value))}>
            <option value="">Select a User</option>
            {Users.map(user => (
              <option key={user.userID} value={JSON.stringify(user)}>
                {user.contact}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div className='motivation-detail' style={{ width: '600px', border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '20px', margin: '0 auto' }}>
            <h3>User ID: {selectedUser.userID}</h3>
            <p>Username: {userInfo.username}</p> {/* Display username */}
            <p>Role: {userInfo.role}</p> {/* Display user role */}
          </div>
        )}
        <div className="button-container" style={{ textAlign: 'center' }}>
          <button className='button' style={{ marginRight: '10px' }} onClick={handleBlockUser} disabled={!selectedUser}>Block User</button>
        </div>
      </main>

      <footer className="App-footer">
        © 2024 FundIT. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminBlockUsers;
