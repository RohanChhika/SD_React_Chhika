import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders learn react link', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElements = screen.getAllByText(/welcome to fundit/i);
  linkElements.forEach(linkElement => {
    expect(linkElement).toBeInTheDocument();
  });  
});

