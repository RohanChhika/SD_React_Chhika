import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router } from 'react-router-dom';
import FundApplication from '../components/ApplyForFund';
import { useNavigate, useParams } from "react-router-dom";

// Mock the useAuth0 hook
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn()
}));

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn()
}));

describe('FundApplication Component', () => {
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
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({
      userId: 'manager123',
      fundName: 'testFund'
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Application created successfully' })
      })
    );
  });

  it('renders the form elements correctly', () => {
    render(
      <Router>
        <FundApplication />
      </Router>
    );

    expect(screen.getByText('Application for Fund')).toBeInTheDocument();
    expect(screen.getByText('Fund Name: testFund')).toBeInTheDocument();
    expect(screen.getByText('Please provide your motivation')).toBeInTheDocument();
    expect(screen.getByLabelText('Motivation:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    render(
      <Router>
        <FundApplication />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Motivation:'), { target: { value: 'I need this fund to support my project' } });
    expect(screen.getByLabelText('Motivation:').value).toBe('I need this fund to support my project');
  });

  it('shows alert if user is not authenticated', async () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: false,
      user: null,
      getAccessTokenSilently: jest.fn()
    });

    render(
      <Router>
        <FundApplication />
      </Router>
    );

    window.alert = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('You must be logged in to submit your application.');
    });
  });

  it('shows alert if no file is selected', async () => {
    render(
      <Router>
        <FundApplication />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Motivation:'), { target: { value: 'I need this fund to support my project' } });

    window.alert = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please select a file to upload.');
    });
  });

  it('submits the form and shows success message', async () => {
    render(
      <Router>
        <FundApplication />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Motivation:'), { target: { value: 'I need this fund to support my project' } });

    const fileInput = screen.getByLabelText('Motivation:').closest('form').querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    window.alert = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Request made successfully');
    });
  });

//   it('handles PDF upload errors gracefully', async () => {
//     global.fetch.mockImplementationOnce(() => 
//       Promise.reject(new Error('Failed to upload PDF'))
//     );

//     render(
//       <Router>
//         <FundApplication />
//       </Router>
//     );

//     fireEvent.change(screen.getByLabelText('Motivation:'), { target: { value: 'I need this fund to support my project' } });

//     const fileInput = screen.getByLabelText('Motivation:').closest('form').querySelector('input[type="file"]');
//     const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
//     fireEvent.change(fileInput, { target: { files: [file] } });

//     window.alert = jest.fn();
//     fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

//     await waitFor(() => {
//       expect(window.alert).toHaveBeenCalledWith('Failed to upload PDF');
//     });
//   });

//   it('shows alert if a fund with the same name already exists', async () => {
//     global.fetch.mockImplementationOnce(() => 
//       Promise.resolve({
//         ok: false,
//         status: 409,
//         json: () => Promise.resolve({ message: 'You have already applied to this fund.' })
//       })
//     );

//     render(
//       <Router>
//         <FundApplication />
//       </Router>
//     );

//     fireEvent.change(screen.getByLabelText('Motivation:'), { target: { value: 'I need this fund to support my project' } });

//     const fileInput = screen.getByLabelText('Motivation:').closest('form').querySelector('input[type="file"]');
//     const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
//     fireEvent.change(fileInput, { target: { files: [file] } });

//     window.alert = jest.fn();
//     fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

//     await waitFor(() => {
//       expect(window.alert).toHaveBeenCalledWith('You have already applied to this fund.');
//     });
//   });

  it('navigates to the home page after successful submission', async () => {
    render(
      <Router>
        <FundApplication />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Motivation:'), { target: { value: 'I need this fund to support my project' } });

    const fileInput = screen.getByLabelText('Motivation:').closest('form').querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    window.alert = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Request made successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
