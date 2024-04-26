import React, { useState } from 'react';

const FundManagerApplication = () => {
  const [motivation, setMotivation] = useState('');

  const handleChange = (e) => {
    setMotivation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here, such as sending the motivation to a server
    console.log('Motivation submitted:', motivation);
  };

  return (
    <div>
      <h1>Apply to be a Fund Manager</h1>
      <h2>Please provide your motivation</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Motivation:
          <textarea value={motivation} onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FundManagerApplication;
