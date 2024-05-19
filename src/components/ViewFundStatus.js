import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import logo from '../components/Images/logo1.png';

const ViewFundStatus = () => {
  // State to track the selected application
  const [selectedApplication, setSelectedApplication] = useState(null);
  // State to store all applications
  const [applications, setApplications] = useState([]);
  // Destructure Auth0 hook to get user and token functions
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    if (!user?.sub) return;
    // Check if user is available
    const userID = user?.sub;

    // Function to fetch applications from the API
    const fetchApplications = async () => {
      try {
        // Get access token silently
        const token = await getAccessTokenSilently();
        // Fetch applications for the logged-in user
        const response = await fetch(`https://fundit.azurewebsites.net/viewFundStatus/${userID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Check if the response is not ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and set the applications data
        const data = await response.json();
        setApplications(data);
        console.log('Requests fetched successfully.');
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error.message);
      }
    };

    fetchApplications();
  }, [getAccessTokenSilently, user?.sub]);

  // Handle application selection from the dropdown
  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
  };

  // Function to create a URL for the PDF
  const getPdfUrl = (pdfData) => {
    if (!pdfData) return null;
    try {
      console.log('PDF Data:', pdfData); // Debugging log
      const byteArray = new Uint8Array(pdfData.data.data); // Adjusted for potential structure
      const blob = new Blob([byteArray], { type: pdfData.contentType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating PDF URL:', error);
      return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="center-text">
          <h1>My Funds Statuses</h1>
        </div>
      </header>
      <main>
        <h1 className='admin-page' style={{ textAlign: 'center' }}>My Funds Statuses</h1>
        <h2 className='admin-page' style={{ textAlign: 'center' }}>Funds List</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <select className="motivation-select" style={{ width: '300px', textAlign: 'center' }} onChange={(e) => handleSelectApplication(JSON.parse(e.target.value))}>
            <option value="">Select an Fund</option>
            {applications.map(application => (
              <option key={`${application.userID}-${application.fundName}`} value={JSON.stringify(application)}>
                {application.userID}
              </option>
            ))}
          </select>
        </div>

        {selectedApplication && (
          <div className='motivation-detail' style={{ width: '600px', border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '20px', margin: '0 auto' }}>
            <h3>Applicant ID: {selectedApplication.userID}</h3>
            <p>Fund Name: {selectedApplication.fundName}</p>
            <p>Motivation: {selectedApplication.motivation}</p>
            <p>Application Status: {selectedApplication.applicationStatus}</p>
            {selectedApplication.pdf && (
              <div>
                <h3>Attached PDF:</h3>
                <iframe src={getPdfUrl(selectedApplication.pdf)} width="100%" height="600px" title="Application PDF" />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="App-footer">
        © 2024 FundIT. All rights reserved.
      </footer>
    </div>
  );
};

export default ViewFundStatus;