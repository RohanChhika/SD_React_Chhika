import React, { useState } from 'react';

const AdminFundReq = () => {
  // Sample motivations data
  const [motivations, setMotivations] = useState([
    { id: 1, text: "Motivation 1", status: "pending" },
    { id: 2, text: "Motivation 2", status: "pending" },
    { id: 3, text: "Motivation 3", status: "pending" },
  ]);

  // Function to handle allow/deny action
  const handleAction = (motivationId, action) => {
    // Update the status of the motivation
    setMotivations(prevMotivations =>
      prevMotivations.map(motivation =>
        motivation.id === motivationId ? { ...motivation, status: action } : motivation
      )
    );
  };

  return (
    <>
      <h1>Admin Page</h1>
      <h2>Motivations List</h2>
      {motivations.map(motivation => (
        <React.Fragment key={motivation.id}>
          <p>{motivation.text}</p>
          <select defaultValue="pending" onChange={(e) => handleAction(motivation.id, e.target.value)}>
            <option value="pending">Pending</option>
            <option value="allow">Allow</option>
            <option value="deny">Deny</option>
          </select>
          <button onClick={() => handleAction(motivation.id, 'allow')}>Allow</button>
          <button onClick={() => handleAction(motivation.id, 'deny')}>Deny</button>
        </React.Fragment>
      ))}
    </>
  );
};

export default AdminFundReq;
