import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from '../components/profile';

jest.mock('@auth0/auth0-react');

describe('Profile', () => {
  const user = {
    sub: 'user123',
    nickname: 'johndoe',
    email: 'john.doe@example.com'
  };

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      getAccessTokenSilently: jest.fn().mockResolvedValue('fake_token')
    });
    global.fetch = jest.fn();
  });

  it('should not fetch user data if not authenticated', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      getAccessTokenSilently: jest.fn()
    });

    render(<Profile />);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should display user nickname and email if authenticated', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ role: 'user' })
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('johndoe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

  it('should display user role if data fetch is successful', async () => {
    const userInfo = { role: 'admin' };
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(userInfo)
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Role: admin')).toBeInTheDocument();
    });
  });

  it('should handle fetch errors gracefully', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    render(<Profile />);

    await waitFor(() => {
      expect(screen.queryByText('Role:')).toBeNull();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
