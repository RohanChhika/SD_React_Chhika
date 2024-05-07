import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import logo from '../components/Images/logo1.png';

const CreateFund = () => {
  const [fundName, setFundName] = useState('');
  const [CompanyName, setCompanyName] = useState('');
  const [fundType, setFundType] = useState('education');
  const [description, setDescription] = useState('');
  
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const handleFundNameChange = (e) => {
    setFundName(e.target.value);
  };

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleFundTypeChange = (e) => {
    setFundType(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('You must be logged in to create a fund.');
      return;
    }
  
    const userID = user.sub;
    const data = {
      userID,
      fundName,
      CompanyName,
      fundType,
      description
    };
  
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch('https://your-backend-url/createFund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });
  
      const responseData = await response.json();
      if (response.status === 409) {
        alert('A fund with this name already exists.');
      } else if (response.ok) {
        console.log('Fund created successfully:', responseData);
        alert("Fund created successfully");
        navigate('/'); // Redirect to the index route
      } else {
        throw new Error(responseData.message || 'Failed to create fund');
      }
    } catch (error) {
      console.error('Failed to create fund:', error.message);
      alert('Error: ' + error.message);
    }
  };

  return (
    <>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Create Fund</h1>
      </header>
      <main style={{ paddingTop: '100px' }}>
        <h1 style={{textAlign: 'center'}}>Create a New Fund</h1>
        <form className='create-fund-form' onSubmit={handleSubmit}>
          <label>
            Fund Name:
            <input type="text" value={fundName} onChange={handleFundNameChange} />
          </label>
          <label>
            Manager Name:
            <input type="text" value={CompanyName} onChange={handleCompanyNameChange} />
          </label>
          <label>
            Fund Type:
            <select value={fundType} onChange={handleFundTypeChange}>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="community">Community</option>
            </select>
          </label>
          <label>
            Description:
            <textarea value={description} onChange={handleDescriptionChange} />
          </label>
          <button className='button' type="submit">Create Fund</button>
        </form>
      </main>

      <footer className="App-footer">
        © 2024 YourCompany. All rights reserved.
      </footer>
    </>
  );
};

export default CreateFund;
