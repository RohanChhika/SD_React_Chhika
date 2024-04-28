import React, { useState } from 'react';

const AdminFundReq = () => {
  const [motivations] = useState([
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
