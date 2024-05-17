import React from 'react'; 
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';

// Create a root element to render the React application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the application in BrowserRouter for routing */}
    <BrowserRouter>
    {/* Wrap the application in Auth0Provider for authentication */}
      <Auth0Provider
        domain="dev-32ptb8idfvaxx33n.eu.auth0.com"
        clientId="ZHgmcL9KH5oGlIAKUpR7NRthesGEKOrV"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "http://fundit.azurewebsites.net/"
        }}
      >
        {/* Render the main App component */}
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
