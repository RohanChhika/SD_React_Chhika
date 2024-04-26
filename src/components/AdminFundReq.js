import React, { useState } from 'react';

const AdminFundReq = () => {
  const [motivations, setMotivations] = useState([]);
  const [selectedMotivation, setSelectedMotivation] = useState(null);

  // Sample motivations data
  const sampleMotivations = [
    { id: 1, text: "Motivation 1", userId: "user1" },
    { id: 2, text: "Motivation 2", userId: "user2" },
    { id: 3, text: "Motivation 3", userId: "user3" }
  ];

  // Function to handle selecting a motivation
  const handleSelectMotivation = (motivation) => {
    setSelectedMotivation(motivation === selectedMotivation ? null : motivation);
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
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Admin Page</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Motivations List</h2>
      <select style={{ display: 'block', margin: '0 auto 20px' }} multiple={false}>
        {sampleMotivations.map(motivation => (
          <option key={motivation.id} selected={selectedMotivation && selectedMotivation.id === motivation.id} onClick={() => handleSelectMotivation(motivation)}>
            {motivation.text} - User ID: {motivation.userId}
          </option>
        ))}
      </select>
      {selectedMotivation && (
        <>
          <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Selected Motivation</h2>
          <p style={{ textAlign: 'center' }}>User ID: {selectedMotivation.userId}</p>
          <p style={{ textAlign: 'center' }}>Motivation Text: {selectedMotivation.text}</p>
          <button style={{ display: 'block', margin: '0 auto', marginBottom: '10px', marginRight: '10px' }} onClick={handleAcceptMotivation}>Accept</button>
          <button style={{ display: 'block', margin: '0 auto', marginBottom: '10px' }} onClick={handleDeclineMotivation}>Decline</button>
        </>
      )}
    </>
  );
};

export default AdminFundReq;
