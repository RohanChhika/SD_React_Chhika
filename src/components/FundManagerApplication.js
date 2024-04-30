import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const FundManagerApplication = () => {
  const [motivation, setMotivation] = useState('');
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  const handleChange = (e) => {
    setMotivation(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const accessToken = await getAccessTokenSilently();
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
        navigate('/'); // Redirect to the index route
      } else {
        throw new Error(responseData.message || 'Failed to create request');
      }
    } catch (error) {
      console.error('Failed to submit motivation:', error.message);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="main-content">
      <h1 style={{textAlign: 'center'}}>Apply to be a Fund Manager</h1>
      <h2 style={{textAlign: 'center'}}>Please provide your motivation</h2>
      <form className='fund-manager-form' onSubmit={handleSubmit}>
        <label>
          Motivation:
          <textarea value={motivation} onChange={handleChange} />
        </label>
        <button className='button' type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FundManagerApplication;