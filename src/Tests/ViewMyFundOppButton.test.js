import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ViewMyFundOppButton from '../components/buttons/ViewMyFundOppButton'; // Adjust the path to your component
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('@auth0/auth0-react');

describe('ViewMyFundOppButton Component', () => {
  const mockUser = {
    sub: 'auth0|123456789'
  };
  
  const mockGetAccessTokenSilently = jest.fn();

  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      getAccessTokenSilently: mockGetAccessTokenSilently
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: 'manager' })
      })
    );
  });

  test('renders View My Funds button for manager', async () => {
    render(
      <Router>
        <ViewMyFundOppButton />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('View My Funds')).toBeInTheDocument();
    });
  });

  test('does not render View My Funds button for non-manager', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: 'user' })
      })
    );

    render(
      <Router>
        <ViewMyFundOppButton />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText('View My Funds')).not.toBeInTheDocument();
    });
  });

  test('handles API fetch error', async () => {
    console.error = jest.fn();
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));

    render(
      <Router>
        <ViewMyFundOppButton />
      </Router>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to fetch user data:', expect.any(Error));
    });
  });

  test('does not render button if not authenticated', async () => {
    useAuth0.mockReturnValue({
      user: null,
      isAuthenticated: false,
      getAccessTokenSilently: jest.fn()
    });

    render(
      <Router>
        <ViewMyFundOppButton />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText('View My Funds')).not.toBeInTheDocument();
    });
  });
});
