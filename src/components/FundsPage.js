// FundsPage.js
import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";  // Import useAuth0 hook for authentication
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation
import logo from '../components/Images/logo1.png';
import BackButton from './buttons/BackButton';

const FundsPage = () => {
  // State to track the selected fund
  const [selectedFund, setSelectedFund] = useState(null);
  // State to store all funds
  const [funds, setFunds] = useState([]);
  // Destructure Auth0 hook to get the token function
  const { getAccessTokenSilently } = useAuth0();
  // Hook to navigate programmatically
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch funds from the API
    const fetchFunds = async () => {
      try {
        // Get the access token silently
        const token = await getAccessTokenSilently();
        // Fetch funds from the server
        const response = await fetch('https://fundit.azurewebsites.net/viewFundOpps', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Check if the response is not ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and set the funds data
        const data = await response.json();
        setFunds(data);
        console.log('Requests fetched successfully.');
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error.message);
      }
    };
    fetchFunds();
  }, [getAccessTokenSilently]);

  // Handle fund selection from the dropdown
  const handleSelectFund = (fund) => {
    setSelectedFund(fund);
  };

  // Handle apply button click
  const handleApply = () => {
    if (selectedFund) {
      // Navigate to the apply page with selected fund details
      navigate(`/apply/${selectedFund.userID}/${encodeURIComponent(selectedFund.fundName)}`);
    }
  };

  return (
    <div>
    <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <h1>All Funds</h1>
    <div className="login-container">
    <BackButton/>
    </div>
    </header>
      <main>
        <h1 className='admin-page' style={{ textAlign: 'center' }}>Fund Page</h1>
        <h2 className='admin-page' style={{ textAlign: 'center' }}>Funds List</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          {/* Dropdown to select a fund */}
          <select className="motivation-select" style={{ width: '300px', textAlign: 'center' }} onChange={(e) => handleSelectFund(JSON.parse(e.target.value))}>
            <option value="">Select a Fund that you would like to apply for</option>
            {funds.map(fund => (
              <option key={fund.fundName} value={JSON.stringify(fund)}>
                {fund.fundName}
              </option>
            ))}
          </select>
        </div>

        {/* Display selected fund details */}
        {selectedFund && (
          <div className='motivation-detail' style={{ width: '600px', border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '20px', margin: '0 auto' }}>
            <h3>CompanyName: {selectedFund.CompanyName}</h3>
            <p>FundName: {selectedFund.fundName}</p>
            <p>Fund Type: {selectedFund.fundType}</p>
            <p>Descrtiption: {selectedFund.description}</p>
          </div>
        )}
        <div className="button-container" style={{ textAlign: 'center' }}>
          {/* Apply button */}
          <button className='button' style={{ marginRight: '10px' }} onClick={handleApply} disabled={!selectedFund}>Apply</button>
        </div>
      </main>
      <footer className="App-footer">© 2024 YourCompany. All rights reserved.</footer>
    </div>
    
  );
};

export default FundsPage;
