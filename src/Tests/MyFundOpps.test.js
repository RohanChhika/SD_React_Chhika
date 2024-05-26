import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyFundOpps from '../components/MyFundOpps';
import { BrowserRouter as Router } from 'react-router-dom';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('initially shows no funds and no error', () => {
  render(<MyFundOpps />);
  expect(screen.queryByText('Select a Fund')).toBeInTheDocument();
  expect(screen.queryAllByRole('option').length).toBe(1); // Only the default option
  expect(screen.queryByText('Failed to fetch funds data')).not.toBeInTheDocument();
});

test('handles dropdown selection and displays selected fund details', async () => {
  const mockResponse = {
    funds: [
      { id: 1, name: 'Fund 1' },
      { id: 2, name: 'Fund 2' }
    ]
  };

  global.fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(mockResponse),
  });

  await act(async () => {
    render(
      <Router>
        <MyFundOpps />
      </Router>
    );
  });

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

  // Simulate dropdown selection and check assertions
});

test('displays an error message if fetch fails', async () => {
  global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

  await act(async () => {
    render(
      <Router>
        <MyFundOpps />
      </Router>
    );
  });

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  expect(screen.getByText('Failed to fetch funds data')).toBeInTheDocument();
});

test('displays funds correctly when fetched', async () => {
  const mockResponse = { funds: [{ id: '1', name: 'Fund A' }, { id: '2', name: 'Fund B' }] };
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockResponse)
  });

  render(<Router><MyFundOpps /></Router>);

  await waitFor(() => {
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3); // including the default "Select a Fund" option
    expect(options[1]).toHaveTextContent('Fund A');
    expect(options[2]).toHaveTextContent('Fund B');
  });
});

