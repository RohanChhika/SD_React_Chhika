import React, { useState,useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import logo from '../components/Images/logo1.png';
import { useNavigate } from "react-router-dom";
const FundsPage = () => {
  const [selectedFund, setSelectedFund] = useState(null);
  const [funds, setFunds] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const token = await getAccessTokenSilently(); // Assuming you have a way to retrieve the token
        const response = await fetch('https://fundit.azurewebsites.net/viewFundsOpps', {
          method: 'GET', // Explicitly setting the method for clarity
          headers: {
            'Authorization': `Bearer ${token}` // Sending the token for authorization
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        setFunds(data); // Assuming setMotivations is a state setter function in your React component
        console.log('Requests fetched successfully.');
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error.message);
      }
    };
    fetchFunds();
  }, [getAccessTokenSilently]); 
  // Function to handle selecting a motivation
  const handleSelectFund = (fund) => {
    setSelectedFund(fund);
  };

  // Function to handle accepting a motivation
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="center-text">
          <h1>Funds </h1>
        </div>
      </header>
      <main>
        <h1 className='admin-page' style={{ textAlign: 'center' }}>Fund Page</h1>
        <h2 className='admin-page' style={{ textAlign: 'center' }}>Funds List</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <select className="motivation-select" style={{ width: '300px', textAlign: 'center' }} onChange={(e) => handleSelectFund(JSON.parse(e.target.value))}>
            <option value="">Select a Fund that you would like to apply for</option>
            {funds.map(fund => (
              <option key={fund.userID} value={JSON.stringify(fund)}>
                {fund.fund}
              </option>
            ))}
        </select>
        </div>

        {selectedFund && (
          <div className='motivation-detail' style={{ width: '600px', border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '20px', margin: '0 auto' }}>
            <h3>User ID: {selectedFund.userID}</h3>
            <p>{selectedFund.fund}</p>
          </div>
        )}
        <div className="button-container" style={{ textAlign: 'center' }}>
          <button className='button' style={{ marginRight: '10px' }} onClick={handleAcceptFund} disabled={!selectedFund}>Apply</button>
        </div>
      </main>

      <footer className="App-footer">
      © 2024 FundIT. All rights reserved.
    </footer>
    </div>
  );
};

export default FundsPage;