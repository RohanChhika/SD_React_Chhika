import React, { useState,useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import logo from './components/Images/logo1.png';
import { useNavigate } from "react-router-dom";
const AdminFundReq = () => {
  const [selectedMotivation, setSelectedMotivation] = useState(null);
  const [motivations, setMotivations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchManagerRequests = async () => {
      try {
        const token = await getAccessTokenSilently(); // Assuming you have a way to retrieve the token
        const response = await fetch('https://fundit.azurewebsites.net/viewManagerRequests', {
          method: 'GET', // Explicitly setting the method for clarity
          headers: {
            'Authorization': `Bearer ${token}` // Sending the token for authorization
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        setMotivations(data); // Assuming setMotivations is a state setter function in your React component
        console.log('Requests fetched successfully.');
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error.message);
      }
    };
    fetchManagerRequests();
  }, [getAccessTokenSilently]); 
  // Function to handle selecting a motivation
  const handleSelectMotivation = (motivation) => {
    setSelectedMotivation(motivation);
  };

  // Function to handle accepting a motivation
  const handleAcceptMotivation = async() => {
    if (selectedMotivation) {
      try {
        const token = await getAccessTokenSilently(); // Retrieve the token
        const url = `https://fundit.azurewebsites.net/process-request/${selectedMotivation.userID}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ decision: 'accept'}) // Sending "accept" as true
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        console.log("Accepted:", selectedMotivation);
        alert('Request accepted successfully!'); // Optionally, display a success message to the user
        navigate(0); 
      } catch (error) {
        console.error('Failed to accept request:', error.message);
      }
    } else {
      console.log("Please select a motivation first.");
    }
  };

  // Function to handle declining a motivation
  const handleDeclineMotivation = async () => {
    if (selectedMotivation) {
      try {
        const token = await getAccessTokenSilently(); // Retrieve the token
        const url = `https://fundit.azurewebsites.net/process-request/${selectedMotivation.userID}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ decision: 'reject'}) // Sending "accept" as true
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        console.log("Rejected:", selectedMotivation);
        alert('Request rejected successfully!'); // Optionally, display a success message to the user
        navigate(0); 
      } catch (error) {
        console.error('Failed to accept request:', error.message);
      }
    } else {
      console.log("Please select a motivation first.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="center-text">
          <h1>Fund Requests</h1>
        </div>
      </header>
      <main>
        <h1 className='admin-page' style={{ textAlign: 'center' }}>Admin Page</h1>
        <h2 className='admin-page' style={{ textAlign: 'center' }}>Motivations List</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <select className="motivation-select" style={{ width: '300px', textAlign: 'center' }} onChange={(e) => handleSelectMotivation(JSON.parse(e.target.value))}>
            <option value="">Select a motivation</option>
            {motivations.map(motivation => (
              <option key={motivation.userID} value={JSON.stringify(motivation)}>
                {motivation.motivation}
              </option>
            ))}
        </select>
        </div>

        {selectedMotivation && (
          <div className='motivation-detail' style={{ width: '600px', border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '20px', margin: '0 auto' }}>
            <h3>User ID: {selectedMotivation.userID}</h3>
            <p>{selectedMotivation.motivation}</p>
          </div>
        )}
        <div className="button-container" style={{ textAlign: 'center' }}>
          <button className='button' style={{ marginRight: '10px' }} onClick={handleAcceptMotivation} disabled={!selectedMotivation}>Accept</button>
          <button className='button' onClick={handleDeclineMotivation} disabled={!selectedMotivation}>Decline</button>
        </div>
      </main>

      <footer className="App-footer">
      © 2024 FundIT. All rights reserved.
    </footer>
    </div>
  );
};

export default AdminFundReq;