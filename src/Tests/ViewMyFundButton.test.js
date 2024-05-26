// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import ViewMyFundButton from '../components/buttons/ViewMyFundButton';

// // Mock the Auth0 hook
// jest.mock('@auth0/auth0-react');

// describe('ViewMyFundButton Component', () => {
//   beforeEach(() => {
//     // Setup fetch mock
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({ role: 'applicant' }), // Simulate an applicant user
//       })
//     );
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders button for applicants', async () => {
//     useAuth0.mockReturnValue({
//       user: { sub: '123' },
//       isAuthenticated: true,
//       getAccessTokenSilently: jest.fn(() => Promise.resolve('fake_token')),
//     });

//     render(
//       <Router>
//         <ViewMyFundButton />
//       </Router>
//     );

//     await screen.findByText('View My Funds Status'); // Wait for the button to appear
//     expect(screen.getByText('View My Funds Status')).toBeInTheDocument();
//     expect(screen.getByRole('link')).toHaveAttribute('href', '/fund-status');
//   });

//   test('does not render button for non-applicant users', async () => {
//     useAuth0.mockReturnValue({
//       user: { sub: '123' },
//       isAuthenticated: true,
//       getAccessTokenSilently: jest.fn(() => Promise.resolve('fake_token')),
//     });
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({ role: 'user' }), // Simulate a non-applicant user
//       })
//     );

//     render(
//       <Router>
//         <ViewMyFundButton />
//       </Router>
//     );

//     const button = screen.queryByText('View My Funds Status');
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
//         <ViewMyFundButton />
//       </Router>
//     );

//     const button = screen.queryByText('View My Funds Status');
//     expect(button).not.toBeInTheDocument();
//   });
// });


import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewMyFundButton from '../components/buttons/ViewMyFundButton';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('@auth0/auth0-react');

describe('ViewMyFundButton', () => {
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
        <ViewMyFundButton />
      </Router>
    );
    expect(screen.queryByRole('button', { name: /view my funds status/i })).not.toBeInTheDocument();
  });

  test('renders button for authenticated applicants', async () => {
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
        <ViewMyFundButton />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: /view my funds status/i })).toBeInTheDocument();
  });

  test('does not render button for non-applicant roles', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'auth0|123456' },
      getAccessTokenSilently: jest.fn().mockResolvedValue('fakeToken'),
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ role: 'admin' }),
      })
    );

    render(
      <Router>
        <ViewMyFundButton />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: /view my funds status/i })).not.toBeInTheDocument();
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
        <ViewMyFundButton />
      </Router>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch user data:', expect.any(Error));
    expect(screen.queryByRole('button', { name: /view my funds status/i })).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
