import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminFundReq from '../components/AdminFundReq';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));

describe('AdminFundReq Component', () => {
  const mockAccessToken = 'fake-access-token';
  const mockMotivations = [
    { userID: 'user1', motivation: 'Motivation A' },
    { userID: 'user2', motivation: 'Motivation B' }
  ];

  beforeEach(() => {
    useAuth0.mockReturnValue({
      getAccessTokenSilently: jest.fn(() => Promise.resolve(mockAccessToken))
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMotivations)
      })
    );

    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders correctly with initial elements', async () => {
    await act(async () => {
      render(<AdminFundReq />);
    });

    expect(screen.getByText('Select a motivation')).toBeInTheDocument();
  });

  test('fetches motivations successfully and handles selection', async () => {
    await act(async () => {
      render(<AdminFundReq />);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(select, { target: { value: JSON.stringify(mockMotivations[0]) } });
    });

    await waitFor(() => {
      expect(screen.getByText('User ID: user1')).toBeInTheDocument();
    });
  });

  test('handles API fetch error', async () => {
    console.error = jest.fn();
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));

    await act(async () => {
      render(<AdminFundReq />);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to fetch requests:', 'API Error');
    });
  });

  test('handles accepting a motivation successfully', async () => {
    await act(async () => {
      render(<AdminFundReq />);
    });

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: JSON.stringify(mockMotivations[0]) } });
    });

    await waitFor(() => {
      expect(screen.getByText('User ID: user1')).toBeInTheDocument();
    });

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Request accepted successfully' })
      })
    );

    window.alert = jest.fn();
    const acceptButton = screen.getByText('Accept');

    await act(async () => {
      fireEvent.click(acceptButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(window.alert).toHaveBeenCalledWith('Request accepted successfully!');
    });
  });

  test('handles declining a motivation successfully', async () => {
    await act(async () => {
      render(<AdminFundReq />);
    });

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: JSON.stringify(mockMotivations[0]) } });
    });

    await waitFor(() => {
      expect(screen.getByText('User ID: user1')).toBeInTheDocument();
    });

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Request rejected successfully' })
      })
    );

    window.alert = jest.fn();
    const declineButton = screen.getByText('Decline');

    await act(async () => {
      fireEvent.click(declineButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(window.alert).toHaveBeenCalledWith('Request rejected successfully!');
    });
  });

  test('handles accept motivation error', async () => {
    await act(async () => {
      render(<AdminFundReq />);
    });

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: JSON.stringify(mockMotivations[0]) } });
    });

    await waitFor(() => {
      expect(screen.getByText('User ID: user1')).toBeInTheDocument();
    });

    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));
    console.error = jest.fn();

    const acceptButton = screen.getByText('Accept');

    await act(async () => {
      fireEvent.click(acceptButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledWith('Failed to accept request:', 'API Error');
    });
  });

  test('handles decline motivation error', async () => {
    await act(async () => {
      render(<AdminFundReq />);
    });

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: JSON.stringify(mockMotivations[0]) } });
    });

    await waitFor(() => {
      expect(screen.getByText('User ID: user1')).toBeInTheDocument();
    });

    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));
    console.error = jest.fn();

    const declineButton = screen.getByText('Decline');

    await act(async () => {
      fireEvent.click(declineButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledWith('Failed to accept request:', 'API Error');
    });
  });
});