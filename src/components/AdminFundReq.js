import React, { useState } from 'react';

const AdminFundReq = () => {
  const [motivations, setMotivations] = useState([
    { id: 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam feugiat arcu non venenatis viverra.", userId: "user1" },
    { id: 2, text: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed ut quam sed ex sagittis fermentum.", userId: "user2" },
    { id: 3, text: "Fusce vestibulum, nisi quis vulputate ultrices, quam sapien tristique velit, auctor condimentum lacus turpis vel eros.", userId: "user3" }
  ]);
  const [selectedMotivation, setSelectedMotivation] = useState(null);

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
    <div style={{ textAlign: 'center' }}>
      <h1>Admin Page</h1>
      <h2>Motivations List</h2>
      <div style={{ marginBottom: '20px' }}>
        <select style={{ marginBottom: '10px' }} onChange={(e) => handleSelectMotivation(JSON.parse(e.target.value))}>
          <option value="">Select a motivation</option>
          {motivations.map(motivation => (
            <option key={motivation.id} value={JSON.stringify(motivation)}>
              {motivation.text}
            </option>
          ))}
        </select>
        <div style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '10px' }}>
          <h3>User ID: {selectedMotivation ? selectedMotivation.userId : ''}</h3>
          <textarea rows="6" style={{ width: '100%', marginBottom: '10px' }} value={selectedMotivation ? selectedMotivation.text : 'Select a motivation to view full details'} readOnly />
        </div>
        <div>
          <button style={{ marginRight: '10px' }} onClick={handleAcceptMotivation} disabled={!selectedMotivation}>Accept</button>
          <button onClick={handleDeclineMotivation} disabled={!selectedMotivation}>Decline</button>
        </div>
      </div>
    </div>
  );
};

export default AdminFundReq;
