import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/buttons/BackButton'; // Adjust the path to your component
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('BackButton Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders Back to Home button', () => {
    render(
      <Router>
        <BackButton />
      </Router>
    );

    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  test('navigates to home when button is clicked', () => {
    render(
      <Router>
        <BackButton />
      </Router>
    );

    const button = screen.getByText('Back to Home');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
