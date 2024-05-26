import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FundsPage from '../components/FundsPage';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));

describe('FundsPage Component', () => {
  const mockAccessToken = 'fake-access-token';
  const mockFunds = [
    { fundName: 'Fund A', CompanyName: 'Company A', fundType: 'Type A', description: 'Desc A', userID: 'user1' }
  ];

  beforeEach(() => {
    useAuth0.mockReturnValue({
      getAccessTokenSilently: jest.fn(() => Promise.resolve(mockAccessToken))
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFunds)
      })
    );

    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders correctly with initial elements', async () => {
    render(<FundsPage />);
    await waitFor(() => {
      expect(screen.getByText('Select a Fund that you would like to apply for')).toBeInTheDocument();
    });
  });

  test('fetches funds successfully and handles selection', async () => {
    render(<FundsPage />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: JSON.stringify(mockFunds[0]) } });
    await waitFor(() => {
      expect(screen.getByText('CompanyName: Company A')).toBeInTheDocument();
    });
  });

  

  test('handles API fetch error', async () => {
    console.error = jest.fn();
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));

    render(<FundsPage />);
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});