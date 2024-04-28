import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from '../components/LoginButton';
import '@testing-library/jest-dom';

// Mock the Auth0 hook and its return values
jest.mock("@auth0/auth0-react");

describe('LoginButton Component', () => {
  // Setup common variables for test cases
  const user = {
    email: 'test@example.com',
    sub: 'auth0|123456'
  };

  const mockedLoginWithRedirect = jest.fn();
  const mockedGetAccessTokenSilently = jest.fn();
  const mockedOnUserAdded = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loginWithRedirect: mockedLoginWithRedirect,
      getAccessTokenSilently: mockedGetAccessTokenSilently
    });
  });

  test('renders login button when not authenticated', () => {
    const { getByRole } = render(<LoginButton onUserAdded={mockedOnUserAdded} />);
    const loginButton = getByRole('button', { name: /log in/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('does not render login button when authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      loginWithRedirect: mockedLoginWithRedirect,
      getAccessTokenSilently: mockedGetAccessTokenSilently
    });
    const { queryByRole } = render(<LoginButton onUserAdded={mockedOnUserAdded} />);
    const loginButton = queryByRole('button', { name: /log in/i });
    expect(loginButton).not.toBeInTheDocument();
  });

  test('calls loginWithRedirect when login button is clicked', () => {
    const { getByRole } = render(<LoginButton onUserAdded={mockedOnUserAdded} />);
    const loginButton = getByRole('button', { name: /log in/i });
    fireEvent.click(loginButton);
    expect(mockedLoginWithRedirect).toHaveBeenCalledTimes(1);
  });

  test('calls API to add user when authenticated', async () => {
    // Mock successful authentication and token retrieval
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      loginWithRedirect: mockedLoginWithRedirect,
      getAccessTokenSilently: mockedGetAccessTokenSilently
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'User added successfully' })
      })
    );

    render(<LoginButton onUserAdded={mockedOnUserAdded} />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(mockedOnUserAdded).toHaveBeenCalled();
  });

  // Cleanup mock
  afterEach(() => {
    jest.restoreAllMocks();
  });
});
