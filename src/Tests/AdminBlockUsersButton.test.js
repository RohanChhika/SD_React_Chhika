// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import AdminBlockUsersButton from '../components/buttons/AdminBlockUsersButton';

// // Mock the Auth0 hook
// jest.mock('@auth0/auth0-react');

// describe('AdminBlockUsersButton Component', () => {
//   beforeEach(() => {
//     // Setup fetch mock
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({ role: 'admin' }),
//       })
//     );
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders button for authenticated admins', async () => {
//     useAuth0.mockReturnValue({
//       user: { sub: '123' },
//       isAuthenticated: true,
//       getAccessTokenSilently: jest.fn(() => Promise.resolve('fake_token')),
//     });

//     render(
//       <Router>
//         <AdminBlockUsersButton />
//       </Router>
//     );

//     await screen.findByText('View Users'); // This waits for the button to appear
//     expect(screen.getByText('View Users')).toBeInTheDocument();
//     expect(screen.getByRole('link')).toHaveAttribute('href', '/admin-handle-users');
//   });

//   test('does not render button for non-admin users', async () => {
//     useAuth0.mockReturnValue({
//       user: { sub: '123' },
//       isAuthenticated: true,
//       getAccessTokenSilently: jest.fn(() => Promise.resolve('fake_token')),
//     });
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({ role: 'user' }),
//       })
//     );

//     render(
//       <Router>
//         <AdminBlockUsersButton />
//       </Router>
//     );

//     const button = screen.queryByText('View Users');
//     expect(button).not.toBeInTheDocument();
//   });

//   test('does not render button when fetch fails', async () => {
//     useAuth0.mockReturnValue({
//       user: { sub: '123' },
//       isAuthenticated: true,
//       getAccessTokenSilently: jest.fn(() => Promise.resolve('fake_token')),
//     });
//     global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

//     render(
//       <Router>
//         <AdminBlockUsersButton />
//       </Router>
//     );

//     const button = screen.queryByText('View Users');
//     expect(button).not.toBeInTheDocument();
//   });
// });


import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminBlockUsersButton from '../components/buttons/AdminBlockUsersButton';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('@auth0/auth0-react');

describe('AdminBlockUsersButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('does not render button when user is not authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      getAccessTokenSilently: jest.fn(),
    });

    render(
      <Router>
        <AdminBlockUsersButton />
      </Router>
    );
    expect(screen.queryByRole('button', { name: /view users/i })).not.toBeInTheDocument();
  });

  test('renders button for authenticated admins', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123456' },
      getAccessTokenSilently: jest.fn().mockResolvedValue('fakeToken'),
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ role: 'admin' }),
    });

    render(
      <Router>
        <AdminBlockUsersButton />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: /view users/i })).toBeInTheDocument();
  });

  test('does not render button for non-admin roles', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123456' },
      getAccessTokenSilently: jest.fn().mockResolvedValue('fakeToken'),
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ role: 'user' }),
    });

    render(
      <Router>
        <AdminBlockUsersButton />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: /view users/i })).not.toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123456' },
      getAccessTokenSilently: jest.fn().mockResolvedValue('fakeToken'),
    });

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Router>
        <AdminBlockUsersButton />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch user data:', expect.any(Error));
    expect(screen.queryByRole('button', { name: /view users/i })).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
