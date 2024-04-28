import React, { useState,useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
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
    <>
      <h1 style={{ textAlign: 'center' }} className='admin-page'>Admin Page</h1>
      <h2 style={{ textAlign: 'center' }}>Motivations List</h2>
      <select style={{ width: '300px', marginBottom: '20px' }} onChange={(e) => handleSelectMotivation(JSON.parse(e.target.value))} className='motivation-select'>
        <option value="">Select a motivation</option>
        {motivations.map(motivation => (
          <option key={motivation.userID} value={JSON.stringify(motivation)}>
            {motivation.motivation}
          </option>
        ))}
      </select>
      {selectedMotivation && (
<<<<<<< HEAD
        <div className='motivation-detail' style={{ width: '600px', border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '20px', margin: '0 auto' }}>
          <h3>User ID: {selectedMotivation.userId}</h3>
          <p>{selectedMotivation.text}</p>
=======
        <div style={{ width: '600px', border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '20px', margin: '0 auto' }}>
          <h3>User ID: {selectedMotivation.userID}</h3>
          <p>{selectedMotivation.motivation}</p>
>>>>>>> 044814d9dabcefac67d645d0433c386789798027
        </div>
      )}
      <div style={{ textAlign: 'center' }}>
        <button style={{ marginRight: '10px' }} onClick={handleAcceptMotivation} disabled={!selectedMotivation}>Accept</button>
        <button onClick={handleDeclineMotivation} disabled={!selectedMotivation}>Decline</button>
      </div>
    </>
  );
};

export default AdminFundReq;
