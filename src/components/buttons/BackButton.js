// components/buttons/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate('/')} className="button">
      Back to Home
    </button>
  );
};

export default BackButton;
