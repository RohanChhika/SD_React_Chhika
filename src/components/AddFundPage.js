import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import logo from '../components/Images/logo1.png';
import BackButton from './buttons/BackButton';

const CreateFund = () => {
  // State for fund name input
  const [fundName, setFundName] = useState('');
  // State for company name input
  const [CompanyName, setCompanyName] = useState('');
  // State for fund type selection, default is 'education'
  const [fundType, setFundType] = useState('education');
  // State for description input
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [amountPerApplicant, setAmountPerApplicant] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  // Destructure Auth0 hook to get authentication status, user, and token functions
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Handle change in the fund name input
  const handleFundNameChange = (e) => {
    setFundName(e.target.value);
  };
  const handleTotalAmountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTotalAmount(value);
    setCurrentAmount(value);
  };
  const handleAmountPerApplicantChange = (e) => {
    setAmountPerApplicant(e.target.value);
  };

  // Handle change in the company name input
  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  // Handle change in the fund type select
  const handleFundTypeChange = (e) => {
    setFundType(e.target.value);
  };

  // Handle change in the description textarea
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    // Prevent default form submission
    e.preventDefault();
    if (!isAuthenticated) {
      alert('You must be logged in to create a fund.');
      return;
    }
  
    // Get user ID from the authenticated user
    const userID = user.sub;
    const data = {
      userID,     // Include fund name in the data
      fundName,   // Include fund name in the data
      CompanyName,// Include company name in the data
      fundType,   // Include fund type in the data
      description, // Include description in the data
      totalAmount,
      amountPerApplicant,
      currentAmount
    };
  
    try {
      // Get the access token silently
      const accessToken = await getAccessTokenSilently();
      // Post the fund data to the server
      const response = await fetch(`https://fundit.azurewebsites.net/AddFund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`  // Include the access token in the headers
        },
        body: JSON.stringify(data)  // Convert data to JSON string for the request body
      });
  
      const responseData = await response.json();
      if (response.status === 409) {
        alert('A fund with this name already exists.'); // Alert if a fund with the same name already exists
      } else if (response.ok) {
        console.log('Fund created successfully:', responseData);  // Log success message and response data
        alert("Fund created successfully"); // Alert success message
        navigate('/'); // Redirect to the index route
      } else {
        throw new Error(responseData.message || 'Failed to create fund'); // Throw error if fund creation fails
      }
    } catch (error) {
      console.error('Ensure all fields are filled in: ', error.message);
      alert('Error: ' + error.message);// Alert error message
    }
  };

  return (
    <>
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <h1>Create Fund</h1>
    <div className="login-container">
      <BackButton/>
    </div>
  </header>
  <div className="App"> {/* This ensures flex centering takes full effect */}
    <div className="create-fund-form">
      <h1 style={{ textAlign: 'center' }}>Create a New Fund</h1>
      <form onSubmit={handleSubmit}>
        <label>Fund Name:<input type="text" value={fundName} onChange={handleFundNameChange} /></label>
        <label>Company Name:<input type="text" value={CompanyName} onChange={handleCompanyNameChange} /></label>
        <label>Fund Type:
          <select value={fundType} onChange={handleFundTypeChange}>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="community">Community</option>
          </select>
        </label>
        <label>Description:<textarea value={description} onChange={handleDescriptionChange} /></label>
        <label>Total Amount Allocated to fund:<input type="number" value={totalAmount} onChange={handleTotalAmountChange} /></label>
        <label>Amount Per Applicant:<input type="number" value={amountPerApplicant} onChange={handleAmountPerApplicantChange} /></label>
        <button className='button' type="submit">Create Fund</button>
      </form>
    </div>
  </div>
  <footer className="App-footer">© 2024 YourCompany. All rights reserved.</footer>
</>
  );
};


export default CreateFund;
