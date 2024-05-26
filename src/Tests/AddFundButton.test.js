// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import AddFundButton from '../components/buttons/AddFundButton';

// // Mock the Auth0 hook
// jest.mock('@auth0/auth0-react');

// describe('AddFundButton Component', () => {
//   beforeEach(() => {
//     // Setup fetch mock
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({ role: 'manager' }),
//       })
//     );
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders button for authenticated users with manager role', async () => {
//     useAuth0.mockReturnValue({
//       user: { sub: '123' },
//       isAuthenticated: true,
//       getAccessTokenSilently: jest.fn(() => Promise.resolve('fake_token')),
//     });

//     render(
//       <Router>
//         <AddFundButton />
//       </Router>
//     );

//     await screen.findByText('Create a Fund'); // This waits for the button to appear
//     expect(screen.getByText('Create a Fund')).toBeInTheDocument();
//     expect(screen.getByRole('link')).toHaveAttribute('href', '/add-fund');
//   });

//   test('does not render button for users with roles other than manager', async () => {
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
//         <AddFundButton />
//       </Router>
//     );

//     const button = screen.queryByText('Create a Fund');
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
//         <AddFundButton />
//       </Router>
//     );

//     const button = screen.queryByText('Create a Fund');
//     expect(button).not.toBeInTheDocument();
//   });
// });


import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFundButton from '../components/buttons/AddFundButton';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('@auth0/auth0-react');

describe('AddFundButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render button when user is not authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      getAccessTokenSilently: jest.fn(),
    });

    render(
      <Router>
        <AddFundButton />
      </Router>
    );
    expect(screen.queryByRole('button', { name: /create a fund/i })).not.toBeInTheDocument();
  });

  test('renders button for authenticated managers', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123456' },
      getAccessTokenSilently: jest.fn().mockResolvedValue('fakeToken'),
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: 'manager' }),
      })
    );

    render(
      <Router>
        <AddFundButton />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: /create a fund/i })).toBeInTheDocument();
  });

  test('does not render button for non-manager roles', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123456' },
      getAccessTokenSilently: jest.fn().mockResolvedValue('fakeToken'),
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: 'applicant' }),
      })
    );

    render(
      <Router>
        <AddFundButton />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: /create a fund/i })).not.toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123456' },
      getAccessTokenSilently: jest.fn().mockResolvedValue('fakeToken'),
    });

    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 500 }));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Router>
        <AddFundButton />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch user data:', expect.any(Error));
    expect(screen.queryByRole('button', { name: /create a fund/i })).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
