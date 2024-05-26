import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewFundRequests from '../components/ViewFundRequests';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ViewFundRequests Component', () => {
  const mockNavigate = jest.fn();
  const mockGetAccessTokenSilently = jest.fn();
  const mockUser = { sub: '12345' };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      getAccessTokenSilently: mockGetAccessTokenSilently
    });
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    }));
    window.alert = jest.fn();
  });

  it('renders correctly and fetches applications', async () => {
    render(
      <Router>
        <ViewFundRequests />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Funding Applications')).toBeInTheDocument();
      expect(screen.getByText('Applications List')).toBeInTheDocument();
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

//   it('handles application selection', async () => {
//     const applications = [
//       { userID: 'applicant1', fundName: 'Fund1', motivation: 'Motivation1', applicationStatus: 'pending', pdf: null },
//       { userID: 'applicant2', fundName: 'Fund2', motivation: 'Motivation2', applicationStatus: 'accepted', pdf: null }
//     ];

//     fetch.mockImplementationOnce(() => Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve(applications)
//     }));

//     render(
//       <Router>
//         <ViewFundRequests />
//       </Router>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('Select an application')).toBeInTheDocument();
//     });

//     fireEvent.change(screen.getByRole('combobox'), { target: { value: JSON.stringify(applications[0]) } });

//     await waitFor(() => {
//       expect(screen.getByText('Applicant ID: applicant1')).toBeInTheDocument();
//       expect(screen.getByText('Fund Name: Fund1')).toBeInTheDocument();
//       expect(screen.getByText('Motivation: Motivation1')).toBeInTheDocument();
//     });
//   });

//   it('handles accept application', async () => {
//     const application = { userID: 'applicant1', fundName: 'Fund1', motivation: 'Motivation1', applicationStatus: 'pending', pdf: null };

//     fetch.mockImplementationOnce(() => Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve([application])
//     }));
//     fetch.mockImplementationOnce(() => Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve({})
//     }));

//     render(
//       <Router>
//         <ViewFundRequests />
//       </Router>
//     );

//     await waitFor(() => {
//       fireEvent.change(screen.getByRole('combobox'), { target: { value: JSON.stringify(application) } });
//     });

//     fireEvent.click(screen.getByText('Accept'));

//     await waitFor(() => {
//       expect(window.alert).toHaveBeenCalledWith('Application accepted successfully!');
//       expect(mockNavigate).toHaveBeenCalledWith(0);
//     });
//   });

//   it('handles decline application', async () => {
//     const application = { userID: 'applicant1', fundName: 'Fund1', motivation: 'Motivation1', applicationStatus: 'pending', pdf: null };

//     fetch.mockImplementationOnce(() => Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve([application])
//     }));
//     fetch.mockImplementationOnce(() => Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve({})
//     }));

//     render(
//       <Router>
//         <ViewFundRequests />
//       </Router>
//     );

//     await waitFor(() => {
//       fireEvent.change(screen.getByRole('combobox'), { target: { value: JSON.stringify(application) } });
//     });

//     fireEvent.click(screen.getByText('Decline'));

//     await waitFor(() => {
//       expect(window.alert).toHaveBeenCalledWith('Application rejected successfully!');
//       expect(mockNavigate).toHaveBeenCalledWith(0);
//     });
//   });

//   it('handles already accepted application', async () => {
//     const application = { userID: 'applicant1', fundName: 'Fund1', motivation: 'Motivation1', applicationStatus: 'accepted', pdf: null };

//     fetch.mockImplementationOnce(() => Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve([application])
//     }));

//     render(
//       <Router>
//         <ViewFundRequests />
//       </Router>
//     );

//     await waitFor(() => {
//       fireEvent.change(screen.getByRole('combobox'), { target: { value: JSON.stringify(application) } });
//     });

//     fireEvent.click(screen.getByText('Accept'));

//     await waitFor(() => {
//       expect(window.alert).toHaveBeenCalledWith('This application has already been accepted. Please choose a pending application.');
//     });
//   });

//   it('handles already rejected application', async () => {
//     const application = { userID: 'applicant1', fundName: 'Fund1', motivation: 'Motivation1', applicationStatus: 'rejected', pdf: null };

//     fetch.mockImplementationOnce(() => Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve([application])
//     }));

//     render(
//       <Router>
//         <ViewFundRequests />
//       </Router>
//     );

//     await waitFor(() => {
//       fireEvent.change(screen.getByRole('combobox'), { target: { value: JSON.stringify(application) } });
//     });

//     fireEvent.click(screen.getByText('Decline'));

//     await waitFor(() => {
//       expect(window.alert).toHaveBeenCalledWith('This application has already been rejected. Please choose a pending application.');
//     });
//   });
});
