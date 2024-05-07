import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../components/Images/logo1.png';

const FundApplication = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { userId, fundName } = useParams();
  const [motivation, setMotivation] = useState('');

  const handleChange = (e) => {
    setMotivation(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('You must be logged in to submit your application.');
      return;
    }
    const managerUserID=userId
    const userID = user.sub;
    const data = {
      userID,
      managerUserID,
      fundName,
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
      console.error('Failed to submit application:', error.message);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="center-text">
          <h1>Application for Fund</h1>
        </div>
      </header>
      <main style={{ paddingTop: '100px' }}>
        <h1 style={{textAlign: 'center'}}>Apply to be a Fund Manager</h1>
        <h2 style={{textAlign: 'center'}}>Fund Name: {decodeURIComponent(fundName)}</h2>
        <h2 style={{textAlign: 'center'}}> Manager User ID: {managerUserID}</h2>
        <h3 style={{textAlign: 'center'}}>Please provide your motivation</h3>
        <form className='fund-manager-form' onSubmit={handleSubmit}>
          <label>
            Motivation:
            <textarea value={motivation} onChange={handleChange} />
          </label>
          <button className='button' type="submit">Submit</button>
        </form>
      </main>

      <footer className="App-footer">
        © 2024 FundIT. All rights reserved.
      </footer>
    </div>
  );
};

export default FundApplication;
