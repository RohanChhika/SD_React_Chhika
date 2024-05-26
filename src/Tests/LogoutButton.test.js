// LogoutButton.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from '../components/buttons/LogoutButton';
import '@testing-library/jest-dom';

jest.mock("@auth0/auth0-react");

describe('LogoutButton', () => {
  test('renders logout button when user is authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn()
    });

    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });

  test('calls logout when logout button is clicked', () => {
    const logout = jest.fn();
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      logout
    });

    render(<LogoutButton />);
    fireEvent.click(screen.getByText(/log out/i));
    expect(logout).toHaveBeenCalledWith({ returnTo: window.location.origin });
  });
});
