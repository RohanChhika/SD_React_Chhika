import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewFundRequests from '../components/ViewFundRequests';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ViewFundRequests Component', () => {
  const mockNavigate = jest.fn();
  const mockGetAccessTokenSilently = jest.fn();
  const mockUser = { sub: '12345' };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      getAccessTokenSilently: mockGetAccessTokenSilently
    });
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    }));
    window.alert = jest.fn();
  });

  it('renders correctly and fetches applications', async () => {
    render(
      <Router>
        <ViewFundRequests />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Funding Applications')).toBeInTheDocument();
      expect(screen.getByText('Applications List')).toBeInTheDocument();
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});
