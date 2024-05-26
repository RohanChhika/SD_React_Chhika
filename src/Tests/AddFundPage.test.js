import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddFundPage from '../components/AddFundPage';

test('renders AddFundPage and interacts with form', () => {
  render(
    <BrowserRouter>
      <AddFundPage />
    </BrowserRouter>
  );
  
  expect(screen.getByText('Create a New Fund')).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('Fund Name:'), { target: { value: 'New Fund' } });
  fireEvent.change(screen.getByLabelText('Company Name:'), { target: { value: 'Company XYZ' } });
  fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'Fund Description' } });
  fireEvent.change(screen.getByLabelText('Total Amount Allocated to fund:'), { target: { value: '10000' } });
  fireEvent.change(screen.getByLabelText('Amount Per Applicant:'), { target: { value: '1000' } });

  fireEvent.click(screen.getByRole('button', { name: 'Create Fund' }));
});
