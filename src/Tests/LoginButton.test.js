import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginButton from '../components//buttons/LoginButton';
import { useAuth0 } from "@auth0/auth0-react";

jest.mock('@auth0/auth0-react');

describe('LoginButton', () => {
  const onUserAddedMock = jest.fn();
  const loginWithRedirectMock = jest.fn();
  const getAccessTokenSilentlyMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loginWithRedirect: loginWithRedirectMock,
      getAccessTokenSilently: getAccessTokenSilentlyMock,
    });
  });

  test('renders login button when user is not authenticated', () => {
    render(<LoginButton onUserAdded={onUserAddedMock} />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('does not render login button when user is authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123456', email: 'user@example.com' },
      loginWithRedirect: loginWithRedirectMock,
      getAccessTokenSilently: getAccessTokenSilentlyMock,
    });
    render(<LoginButton onUserAdded={onUserAddedMock} />);
    expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
  });

  test('calls loginWithRedirect when login button is clicked', () => {
    render(<LoginButton onUserAdded={onUserAddedMock} />);
    const button = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(button);
    expect(loginWithRedirectMock).toHaveBeenCalled();
  });

  test('calls API to add user when authenticated', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123456', email: 'user@example.com' },
      loginWithRedirect: loginWithRedirectMock,
      getAccessTokenSilently: getAccessTokenSilentlyMock.mockResolvedValue('fakeToken'),
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(),
    });

    render(<LoginButton onUserAdded={onUserAddedMock} />);
    await waitFor(() => expect(getAccessTokenSilentlyMock).toHaveBeenCalled());
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      'https://fundit.azurewebsites.net/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fakeToken',
        },
        body: JSON.stringify({
          userID: 'auth0|123456',
          role: 'applicant',
          contact: 'user@example.com',
        }),
      }
    ));
    await waitFor(() => expect(onUserAddedMock).toHaveBeenCalled());
  });

  test('handles API failure gracefully', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123456', email: 'user@example.com' },
      loginWithRedirect: loginWithRedirectMock,
      getAccessTokenSilently: getAccessTokenSilentlyMock.mockResolvedValue('fakeToken'),
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<LoginButton onUserAdded={onUserAddedMock} />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(consoleSpy).toHaveBeenCalledWith('Failed to add user to the database:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
