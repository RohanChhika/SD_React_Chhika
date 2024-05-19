import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../components/Images/logo1.png';

const FundApplication = () => {
  // Destructure Auth0 hook to get authentication status, user, and token functions
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  // Hook to navigate programmatically
  const navigate = useNavigate();
  // Extract userId and fundName from the route parameters
  const { userId, fundName } = useParams();
  // State to track the motivation input
  const [motivation, setMotivation] = useState('');
  // State to track the selected file
  const [file, setFile] = useState(null);
  // Store the manager user ID
  const managerUserID = userId;

  // Handle change in the motivation textarea
  const handleChange = (e) => {
    setMotivation(e.target.value);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    // Prevent default form submission
    e.preventDefault();
    if (!isAuthenticated) {
      alert('You must be logged in to submit your application.');
      return;
    }

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const userID = user.sub;
    const applicationStatus = 'pending';
    const pdfFormData = new FormData();
    pdfFormData.append('userID', userID);
    pdfFormData.append('managerUserID', managerUserID);
    pdfFormData.append('motivation', motivation);
    pdfFormData.append('fundName', fundName);
    pdfFormData.append('applicationStatus', applicationStatus);
    pdfFormData.append('pdf', file);

    try {
      // Get the access token silently
      const accessToken = await getAccessTokenSilently();
      // Post the application data and PDF to the server
      const pdfResponse = await fetch('https://fundit.azurewebsites.net/uploadPDF', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: pdfFormData
      });

      // Check if the PDF upload response is not ok
      if (!pdfResponse.ok) {
        throw new Error('Failed to upload PDF');
      }

      // Create fund application
      // Parse the response data
     const responseData = await pdfResponse.json();
      if (pdfResponse.status === 409) {
        alert('You have already applied to this fund.');
      } else if (pdfResponse.ok) {
        console.log('Application created succesfully:', responseData);
        alert("Request made successfully");
        navigate('/'); // Redirect to the index route
      } else {
        throw new Error(responseData.message || 'Failed to create request');
      }
    } catch (error) {
      console.error('Failed to submit application:', error.message);
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
        <h1 style={{ textAlign: 'center' }}>Apply for a fund</h1>
        <h2 style={{ textAlign: 'center' }}>Fund Name: {decodeURIComponent(fundName)}</h2>
        <h2 style={{ textAlign: 'center' }}>Manager User ID: {managerUserID}</h2>
        <h3 style={{ textAlign: 'center' }}>Please provide your motivation</h3>
        <form className='fund-manager-form' onSubmit={handleSubmit}>
          <label>
            Motivation:
            <textarea value={motivation} onChange={handleChange} />
          </label>
          <input type="file" className='form-control' accept='application/pdf' required onChange={handleFileChange} />
          <br />
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