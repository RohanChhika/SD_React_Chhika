import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import logo from '../components/Images/logo1.png';
import BackButton from './buttons/BackButton';

const FundApplication = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { userId, fundName } = useParams();
  const [motivation, setMotivation] = useState('');
  const [file, setFile] = useState(null);
  const managerUserID = userId;

  const handleChange = (e) => {
    setMotivation(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
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
      const accessToken = await getAccessTokenSilently();
      const pdfResponse = await fetch('https://fundit.azurewebsites.net/uploadPDF', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: pdfFormData
      });

      if (!pdfResponse.ok) {
        throw new Error('Failed to upload PDF');
      }

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
    <main className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <section className="center-text"> 
          <h1>Application for Fund</h1>
        </section>
        <aside className="login-container"> 
          <BackButton/>
        </aside>
      </header>
      <article style={{ paddingTop: '100px' }}> 
        <h1 style={{ textAlign: 'center' }}>Apply for a fund</h1>
        <h2 style={{ textAlign: 'center' }}>Fund Name: {decodeURIComponent(fundName)}</h2>
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
      </article>

      <footer className="App-footer">
        © 2024 FundIT. All rights reserved.
      </footer>
    </main>
  );
};

export default FundApplication;
