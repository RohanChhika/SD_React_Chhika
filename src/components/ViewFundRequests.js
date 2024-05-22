import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import logo from '../components/Images/logo1.png';
import { useNavigate } from "react-router-dom";
import BackButton from './buttons/BackButton';

const ViewFundRequests = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const { getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.sub) return;
    const managerUserID = user?.sub;

    const fetchApplications = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`https://fundit.azurewebsites.net/viewFundApplications/${managerUserID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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

  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
  };

  const handleAcceptApplication = async () => {
    if (!selectedApplication) return;
    if (selectedApplication.applicationStatus === 'pending') {
      const dataBody = {
        fundName: selectedApplication.fundName,
        decision: 'accepted'
      };
      try {
        const token = await getAccessTokenSilently();
        const url = `https://fundit.azurewebsites.net/process-fundApplication/${selectedApplication.userID}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dataBody)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updateFundAmountResponse = await fetch(`https://fundit.azurewebsites.net/updateFundAmount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fundName: selectedApplication.fundName,
          })
        });

        if (!updateFundAmountResponse.ok) {
          throw new Error(`HTTP error! status: ${updateFundAmountResponse.status}`);
        }

        console.log("Accepted:", selectedApplication);
        alert('Application accepted successfully!');
        navigate(0);
      } catch (error) {
        console.error('Failed to accept request:', error.message);
      }
    } else {
      alert("This application has already been accepted or rejected");
    }
  };

  const handleDeclineApplication = async () => {
    if (!selectedApplication) return;
    if (selectedApplication.applicationStatus === 'pending') {
      const dataBody = {
        fundName: selectedApplication.fundName,
        decision: 'rejected'
      };
      try {
        const token = await getAccessTokenSilently();
        const url = `https://fundit.azurewebsites.net/process-fundApplication/${selectedApplication.userID}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dataBody)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Rejected:", selectedApplication);
        alert('Application rejected successfully!');
        navigate(0);
      } catch (error) {
        console.error('Failed to accept request:', error.message);
      }
    } else {
      alert("This application has already been accepted or rejected");
    }
  };

  const getPdfUrl = (pdfData) => {
    if (!pdfData) return null;
    try {
      console.log('PDF Data:', pdfData);
      const byteArray = new Uint8Array(pdfData.data.data);
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
          <h1>Funding Applications</h1>
        </div>
        <div className="login-container">
          <BackButton />
        </div>
      </header>
      <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <h1 className='admin-page' style={{ textAlign: 'center' }}>Applications Page</h1>
        <h2 className='admin-page' style={{ textAlign: 'center' }}>Applications List</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <select className="motivation-select" style={{ width: '300px', textAlign: 'center' }} onChange={(e) => handleSelectApplication(JSON.parse(e.target.value))}>
            <option value="">Select an application</option>
            {applications.map(application => (
              <option key={`${application.userID}-${application.fundName}`} value={JSON.stringify(application)}>
                {application.userID}
              </option>
            ))}
          </select>
        </div>

        {selectedApplication && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className='motivation-detail' style={{ maxWidth: '600px', border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '20px', width: '90%' }}>
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
            <div className="button-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button className='button' style={{ marginRight: '10px' }} onClick={handleAcceptApplication} disabled={!selectedApplication || selectedApplication.applicationStatus !== 'pending'}>Accept</button>
              <button className='button' onClick={handleDeclineApplication} disabled={!selectedApplication || selectedApplication.applicationStatus !== 'pending'}>Decline</button>
            </div>
          </div>
        )}
      </main>

      <footer className="App-footer">
        © 2024 FundIT. All rights reserved.
      </footer>
    </div>
  );
};

export default ViewFundRequests;
