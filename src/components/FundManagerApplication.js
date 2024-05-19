import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import logo from '../components/Images/logo1.png';

const FundManagerApplication = () => {
  // State to track the motivation input
  const [motivation, setMotivation] = useState('');
  // Destructure Auth0 hook to get authentication status, user, and token functions
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  // Using useNavigate instead of useHistory
  const navigate = useNavigate(); 

  // Handle change in the motivation textarea
  const handleChange = (e) => {
    setMotivation(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    // Prevent default form submission
    e.preventDefault();
    //If user is not logged in
    if (!isAuthenticated) {
      alert('You must be logged in to submit your application.');
      return;
    }
  
    const userID = user.sub;
    const data = {
      userID,
      motivation
    };
  
    try {
      // Get the access token silently
      const accessToken = await getAccessTokenSilently();
      // Post the application data to the server
      const response = await fetch('https://fundit.azurewebsites.net/managerRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });
  
      const responseData = await response.json();
      if (response.status === 409) {
        alert('A request with this user ID already exists.');
      } else if (response.ok) {
        console.log('Request created successfully:', responseData);
        alert("Request made successfully");
        // Redirect to the index route
        navigate('/'); 
      } else {
        throw new Error(responseData.message || 'Failed to create request');
      }
    } catch (error) {
      console.error('Failed to submit motivation:', error.message);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="center-text">
          <h1>Fund Manager Application</h1>
        </div>
      </header>
      <main style={{ paddingTop: '100px' }}>
      <h1 style={{textAlign: 'center'}}>Apply to be a Fund Manager</h1>
      <h2 style={{textAlign: 'center'}}>Please provide your motivation</h2>
      <form className='fund-manager-form' onSubmit={handleSubmit}>
        <label style={{textAlign: 'center'}}>
          Motivation:
          <textarea value={motivation} onChange={handleChange} />
        </label>
        <button className='button' type="submit" style={{margin: '20px auto'}}>Submit</button>
      </form>
      </main>

      <footer className="App-footer">
      © 2024 FundIT. All rights reserved.
    </footer>
    </div>
  );
};

export default FundManagerApplication;