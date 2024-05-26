import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router } from 'react-router-dom';
import CreateFund from '../components/AddFundPage';

// Mock the useAuth0 hook
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn()
}));

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('CreateFund Component', () => {
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
    jest.spyOn(global, 'fetch').mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Fund created successfully' })
      })
    );
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the form elements correctly', () => {
    render(
      <Router>
        <CreateFund />
      </Router>
    );

    expect(screen.getByLabelText('Fund Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Company Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Fund Type:')).toBeInTheDocument();
    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
    expect(screen.getByLabelText('Total Amount Allocated to fund:')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount Per Applicant:')).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    render(
      <Router>
        <CreateFund />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Fund Name:'), { target: { value: 'New Fund' } });
    fireEvent.change(screen.getByLabelText('Company Name:'), { target: { value: 'New Company' } });
    fireEvent.change(screen.getByLabelText('Fund Type:'), { target: { value: 'healthcare' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'This is a new fund.' } });
    fireEvent.change(screen.getByLabelText('Total Amount Allocated to fund:'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('Amount Per Applicant:'), { target: { value: '1000' } });

    expect(screen.getByLabelText('Fund Name:').value).toBe('New Fund');
    expect(screen.getByLabelText('Company Name:').value).toBe('New Company');
    expect(screen.getByLabelText('Fund Type:').value).toBe('healthcare');
    expect(screen.getByLabelText('Description:').value).toBe('This is a new fund.');
    expect(screen.getByLabelText('Total Amount Allocated to fund:').value).toBe('10000');
    expect(screen.getByLabelText('Amount Per Applicant:').value).toBe('1000');
  });

  it('shows alert if user is not authenticated', async () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: false,
      user: null,
      getAccessTokenSilently: jest.fn()
    });

    render(
      <Router>
        <CreateFund />
      </Router>
    );

    window.alert = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: /Create Fund/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('You must be logged in to create a fund.');
    });
  });

  it('submits the form and shows success message', async () => {
    render(
      <Router>
        <CreateFund />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Fund Name:'), { target: { value: 'New Fund' } });
    fireEvent.change(screen.getByLabelText('Company Name:'), { target: { value: 'New Company' } });
    fireEvent.change(screen.getByLabelText('Fund Type:'), { target: { value: 'healthcare' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'This is a new fund.' } });
    fireEvent.change(screen.getByLabelText('Total Amount Allocated to fund:'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('Amount Per Applicant:'), { target: { value: '1000' } });

    window.alert = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: /Create Fund/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Fund created successfully');
    });
  });

  it('handles fund creation errors gracefully', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Failed to create fund' })
      })
    );

    render(
      <Router>
        <CreateFund />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Fund Name:'), { target: { value: 'New Fund' } });
    fireEvent.change(screen.getByLabelText('Company Name:'), { target: { value: 'New Company' } });
    fireEvent.change(screen.getByLabelText('Fund Type:'), { target: { value: 'healthcare' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'This is a new fund.' } });
    fireEvent.change(screen.getByLabelText('Total Amount Allocated to fund:'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('Amount Per Applicant:'), { target: { value: '1000' } });

    window.alert = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: /Create Fund/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error: Failed to create fund');
    });
  });

  it('shows alert if a fund with the same name already exists', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ message: 'A fund with this name already exists.' })
      })
    );

    render(
      <Router>
        <CreateFund />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Fund Name:'), { target: { value: 'Existing Fund' } });
    fireEvent.change(screen.getByLabelText('Company Name:'), { target: { value: 'New Company' } });
    fireEvent.change(screen.getByLabelText('Fund Type:'), { target: { value: 'healthcare' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'This is a new fund.' } });
    fireEvent.change(screen.getByLabelText('Total Amount Allocated to fund:'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('Amount Per Applicant:'), { target: { value: '1000' } });

    window.alert = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: /Create Fund/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('A fund with this name already exists.');
    });
  });

  it('navigates to the home page after successful creation', async () => {
    render(
      <Router>
        <CreateFund />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Fund Name:'), { target: { value: 'New Fund' } });
    fireEvent.change(screen.getByLabelText('Company Name:'), { target: { value: 'New Company' } });
    fireEvent.change(screen.getByLabelText('Fund Type:'), { target: { value: 'healthcare' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'This is a new fund.' } });
    fireEvent.change(screen.getByLabelText('Total Amount Allocated to fund:'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('Amount Per Applicant:'), { target: { value: '1000' } });

    window.alert = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: /Create Fund/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Fund created successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});

