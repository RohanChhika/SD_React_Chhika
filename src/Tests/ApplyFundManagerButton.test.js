import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ApplyFundManagerButton from '../components/buttons/ApplyFundManagerButton';

jest.mock('@auth0/auth0-react');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children }) => <div>{children}</div>  // Simplify the Link component
}));

describe('ApplyFundManagerButton', () => {
  const user = {
    sub: 'user123'
  };

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      getAccessTokenSilently: jest.fn().mockResolvedValue('fake_token')
    });
    global.fetch = jest.fn();
  });

  it('should not display the button if the user is not authenticated', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      getAccessTokenSilently: jest.fn()
    });

    render(<ApplyFundManagerButton />, { wrapper: BrowserRouter });

    await waitFor(() => expect(screen.queryByText('Apply for Fund Manager')).toBeNull());
  });

  it('should display the button for authenticated users with the role "applicant"', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ role: 'applicant' })
    });

    render(<ApplyFundManagerButton />, { wrapper: BrowserRouter });

    await waitFor(() => expect(screen.getByText('Apply for Fund Manager')).toBeInTheDocument());
  });

  it('should not display the button for authenticated users without the "applicant" role', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ role: 'user' })
    });

    render(<ApplyFundManagerButton />, { wrapper: BrowserRouter });

    await waitFor(() => expect(screen.queryByText('Apply for Fund Manager')).toBeNull());
  });

  it('should handle fetch errors gracefully', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    render(<ApplyFundManagerButton />, { wrapper: BrowserRouter });

    await waitFor(() => expect(screen.queryByText('Apply for Fund Manager')).toBeNull());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
