import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";

const FundManagerApplication = () => {
  const [motivation, setMotivation] = useState('');
  const {isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const history = useHistory();
  const handleChange = (e) => {
    setMotivation(e.target.value);
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('You must be logged in to submit your application.');
      return;
    }
  
    const userID = user.sub; // Assuming you have access to user object
    const data = {
      userID,
      motivation
    };
  
    try {
      const accessToken = await getAccessTokenSilently(); // Fetch the access token silently
      const response = await fetch('https://fundit.azurewebsites.net/managerRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}` // Include the Authorization header with the Bearer token
        },
        body: JSON.stringify(data)
      });
  
      const responseData = await response.json();
      if (response.status === 409) {
        alert('A request with this user ID already exists.'); // Display an alert if status is 409
      } else if (response.ok) {
        console.log('Request created successfully:', responseData);
        alert("Request made successfully")
       history.push('/');
        // Additional success handling logic here
      } else {
        throw new Error(responseData.message || 'Failed to create request');
      }
    } catch (error) {
      console.error('Failed to submit motivation:', error.message);
      alert('Error: ' + error.message); // Display an alert for other errors
    }
  };

  return (
    <div>
      <h1>Apply to be a Fund Manager</h1>
      <h2>Please provide your motivation</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Motivation:
          <textarea value={motivation} onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FundManagerApplication;
