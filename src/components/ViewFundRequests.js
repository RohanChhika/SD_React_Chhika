import React, { useState,useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import logo from '../components/Images/logo1.png';
import { useNavigate } from "react-router-dom";
const ViewFundRequests = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const { getAccessTokenSilently,user } = useAuth0();
  const navigate = useNavigate();
  useEffect(() => {
    const managerUserID=user?.sub;
    const fetchApplications = async () => {
      try {
        const token = await getAccessTokenSilently(); // Assuming you have a way to retrieve the token
        const response = await fetch(`https://fundit.azurewebsites.net/viewFundApplications/${managerUserID}`, {
          method: 'GET', // Explicitly setting the method for clarity
          headers: {
            'Authorization': `Bearer ${token}` // Sending the token for authorization
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        setApplications(data); // Assuming setMotivations is a state setter function in your React component
        console.log('Requests fetched successfully.');
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error.message);
      }
    };
    fetchApplications();
  }, [getAccessTokenSilently,user?.sub]); 
  // Function to handle selecting a motivation
  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
  };

  // Function to handle accepting a motivation
  const handleAcceptApplication = async() => {
    if (selectedApplication) {
      try {
        const token = await getAccessTokenSilently(); // Retrieve the token
        const url = `https://fundit.azurewebsites.net/process-request/${selectedApplication.userID}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ decision: 'accept'}) // Sending "accept" as true
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        console.log("Accepted:", selectedApplication);
        alert('Request accepted successfully!'); // Optionally, display a success message to the user
        navigate(0); 
      } catch (error) {
        console.error('Failed to accept request:', error.message);
      }
    } else {
      console.log("Please select a application first.");
    }
  };

  const handleDeclineApplication = async () => {
    if (selectedApplication) {
      try {
        const token = await getAccessTokenSilently(); // Retrieve the token
        const url = `https://fundit.azurewebsites.net/process-request/${selectedApplication.userID}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ decision: 'reject'}) // Sending "accept" as true
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        console.log("Rejected:", selectedApplication);
        alert('Request rejected successfully!'); // Optionally, display a success message to the user
        navigate(0); 
      } catch (error) {
        console.error('Failed to accept request:', error.message);
      }
    } else {
      console.log("Please select a application first.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="center-text">
          <h1>Funding Applications</h1>
        </div>
      </header>
      <main>
        <h1 className='admin-page' style={{ textAlign: 'center' }}>Applications Page</h1>
        <h2 className='admin-page' style={{ textAlign: 'center' }}>Applications List</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <select className="motivation-select" style={{ width: '300px', textAlign: 'center' }} onChange={(e) => handleSelectApplication(JSON.parse(e.target.value))}>
            <option value="">Select a application</option>
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
            <p>Fund Name: {selectedApplication.fundName} </p>
            <p>Motivation: {selectedApplication.motivation} </p>
            <p>Application Status: {selectedApplication.applicationStatus} </p>
          </div>
        )}
        <div className="button-container" style={{ textAlign: 'center' }}>
          <button className='button' style={{ marginRight: '10px' }} onClick={handleAcceptApplication} disabled={!selectedApplication}>Accept</button>
          <button className='button' onClick={handleDeclineApplication} disabled={!selectedApplication}>Decline</button>
        </div>
      </main>

      <footer className="App-footer">
      © 2024 FundIT. All rights reserved.
    </footer>
    </div>
  );
};

export default ViewFundRequests;