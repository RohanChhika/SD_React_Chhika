import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import AdminViewFundRequestsButton from '../components/buttons/AdminViewFundRequestsButton';

// Mock the Auth0 hook
jest.mock('@auth0/auth0-react');

describe('AdminViewFundRequestsButton', () => {
  it('renders the button for admin users', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: '123' },
      getAccessTokenSilently: jest.fn(() => Promise.resolve('fake-token'))
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: 'admin' }),
      })
    );

    render(
      <BrowserRouter>
        <AdminViewFundRequestsButton />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('View Fund Manager Requests')).toBeInTheDocument());
  });

  it('does not render the button for non-admin users', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: '123' },
      getAccessTokenSilently: jest.fn(() => Promise.resolve('fake-token'))
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: 'user' }),
      })
    );

    render(
      <BrowserRouter>
        <AdminViewFundRequestsButton />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('View Fund Manager Requests')).not.toBeInTheDocument();
    });
  });

  it('does nothing when user information is incomplete', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: null,  // No user object
      getAccessTokenSilently: jest.fn()
    });
  
    render(
      <BrowserRouter>
        <AdminViewFundRequestsButton />
      </BrowserRouter>
    );
  
    // The fetch should not be called if user is null
    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.queryByText('View Fund Manager Requests')).not.toBeInTheDocument();
  });
  
  
  it('does not attempt to fetch data when user is not authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      getAccessTokenSilently: jest.fn()
    });
  
    render(
      <BrowserRouter>
        <AdminViewFundRequestsButton />
      </BrowserRouter>
    );
  
    // Ensure fetch was not called
    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.queryByText('View Fund Manager Requests')).not.toBeInTheDocument();
  });
});
