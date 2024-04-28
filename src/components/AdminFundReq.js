import React, { useState,useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
const AdminFundReq = () => {
  const [selectedMotivation, setSelectedMotivation] = useState(null);
  const [motivations, setMotivations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
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
  const handleAcceptMotivation = () => {
    if (selectedMotivation) {
      // Perform action to accept the selected motivation
      console.log("Accepted:", selectedMotivation);
    } else {
      console.log("Please select a motivation first.");
    }
  };

  // Function to handle declining a motivation
  const handleDeclineMotivation = () => {
    if (selectedMotivation) {
      // Perform action to decline the selected motivation
      console.log("Declined:", selectedMotivation);
    } else {
      console.log("Please select a motivation first.");
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Admin Page</h1>
      <h2 style={{ textAlign: 'center' }}>Motivations List</h2>
      <select style={{ width: '300px', marginBottom: '20px' }} onChange={(e) => handleSelectMotivation(JSON.parse(e.target.value))}>
        <option value="">Select a motivation</option>
        {motivations.map(motivation => (
          <option key={motivation.id} value={JSON.stringify(motivation)}>
            {motivation.text}
          </option>
        ))}
      </select>
      {selectedMotivation && (
        <div style={{ width: '600px', border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '20px', margin: '0 auto' }}>
          <h3>User ID: {selectedMotivation.userId}</h3>
          <p>{selectedMotivation.text}</p>
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
