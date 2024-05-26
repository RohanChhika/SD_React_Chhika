import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminBlockUsers from '../components/AdminBlockUsers';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));

describe('AdminBlockUsers Component', () => {
  const mockAccessToken = 'fake-access-token';
  const mockUsers = [
    { userID: 'user1', contact: 'user1@example.com', role: 'user' },
    { userID: 'user2', contact: 'user2@example.com', role: 'admin' }
  ];

  beforeEach(() => {
    useAuth0.mockReturnValue({
      getAccessTokenSilently: jest.fn(() => Promise.resolve(mockAccessToken))
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers)
      })
    );

    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders correctly with initial elements', async () => {
    await act(async () => {
      render(<AdminBlockUsers />);
    });

    expect(screen.getByText('Select a User')).toBeInTheDocument();
  });

  test('fetches users successfully and handles selection', async () => {
    await act(async () => {
      render(<AdminBlockUsers />);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(select, { target: { value: JSON.stringify(mockUsers[0]) } });
    });

    await waitFor(() => {
      expect(screen.getByText('User ID: user1')).toBeInTheDocument();
    });
  });

  test('handles API fetch error', async () => {
    console.error = jest.fn();
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));

    await act(async () => {
      render(<AdminBlockUsers />);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to fetch users:', 'API Error');
    });
  });

  test('handles user blocking successfully', async () => {
    await act(async () => {
      render(<AdminBlockUsers />);
    });

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: JSON.stringify(mockUsers[0]) } });
    });

    await waitFor(() => {
      expect(screen.getByText('User ID: user1')).toBeInTheDocument();
    });

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'User blocked successfully' })
      })
    );

    window.alert = jest.fn();
    const blockButton = screen.getByText('Block User');

    await act(async () => {
      fireEvent.click(blockButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(window.alert).toHaveBeenCalledWith('User Blocked!');
    });
  });

  test('handles user blocking error', async () => {
    await act(async () => {
      render(<AdminBlockUsers />);
    });

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: JSON.stringify(mockUsers[0]) } });
    });

    await waitFor(() => {
      expect(screen.getByText('User ID: user1')).toBeInTheDocument();
    });

    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));
    console.error = jest.fn();

    const blockButton = screen.getByText('Block User');

    await act(async () => {
      fireEvent.click(blockButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledWith('Failed to block user:', 'API Error');
    });
  });

  // test('renders AdminBlockUsers and interacts with form', () => {
  //   render(<AdminBlockUsers />);
  //   expect(screen.getByText('Block Users')).toBeInTheDocument();
  
  //   fireEvent.change(screen.getByLabelText('User ID'), { target: { value: '123' } });
  
  //   fireEvent.click(screen.getByText('Block User'));
  //   expect(screen.getByText('User blocked successfully!')).toBeInTheDocument();
  // });

});
