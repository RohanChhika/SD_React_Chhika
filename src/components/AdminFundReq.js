import React, { useState, useEffect } from 'react';
import { getMotivationsFromDatabase, updateMotivationInDatabase } from './api'; // Import functions for fetching and updating motivations

const AdminFundReq = () => {
  const [motivations, setMotivations] = useState([]);
  const [selectedMotivation, setSelectedMotivation] = useState(null);

  useEffect(() => {
    // Fetch motivations from the database when the component mounts
    getMotivationsFromDatabase()
      .then(data => setMotivations(data))
      .catch(error => console.error('Error fetching motivations:', error));
  }, []);

  const handleAction = (motivationId, action) => {
    // Update the status of the motivation
    setSelectedMotivation(motivations.find(motivation => motivation.id === motivationId));
    updateMotivationInDatabase(motivationId, action)
      .then(() => console.log('Motivation status updated successfully'))
      .catch(error => console.error('Error updating motivation:', error));
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Admin Page</h1>
      <h2 style={{ textAlign: 'center' }}>Motivations List</h2>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Scroll through the list:</h3>
      <select style={{ display: 'block', margin: '0 auto 20px' }} multiple>
        {motivations.map(motivation => (
          <option key={motivation.id}>
            {motivation.text} - User ID: {motivation.userId} - Motivation ID: {motivation.id}
          </option>
        ))}
      </select>
      <h2 style={{ textAlign: 'center' }}>Selected Motivation</h2>
      {selectedMotivation && (
        <>
          <p>User ID: {selectedMotivation.userId}</p>
          <p>Motivation ID: {selectedMotivation.id}</p>
          <p>Motivation Text: {selectedMotivation.text}</p>
          {/* Add input fields for editing motivation details */}
        </>
      )}
    </>
  );
};

export default AdminFundReq;
