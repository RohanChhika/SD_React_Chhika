import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import logo from '../components/Images/logo1.png';
import BackButton from './buttons/BackButton';

const MyFundOpps = () => {
  // State to track the selected application
  const [selectedFund, setSelectedFund] = useState(null);
  // State to store all applications
  const [funds, setFunds] = useState([]);
  // Destructure Auth0 hook to get user and token functions
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    if (!user?.sub) return;
    // Check if user is available
    const userID = user?.sub;

    // Function to fetch applications from the API
    const fetchFund = async () => {
      try {
        // Get access token silently
        const token = await getAccessTokenSilently();
        // Fetch applications for the logged-in user
        const response = await fetch(`https://fundit.azurewebsites.net/viewMyFunds/${userID}`, {
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
        setFunds(data);
        console.log('Requests fetched successfully.');
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error.message);
      }
    };

    fetchFund();
  }, [getAccessTokenSilently, user?.sub]);

  // Handle application selection from the dropdown
  const handleSelectFund = (fund) => {
    setSelectedFund(fund);
  };

  // Function to create a URL for the PDF

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="center-text">
          <h1>My Fund Opportunity</h1>
        </div>
        <div className="login-container">
        <BackButton/>
       </div>
      </header>
      <main>
        <h1 className='admin-page' style={{ textAlign: 'center' }}>My Funds</h1>
        <h2 className='admin-page' style={{ textAlign: 'center' }}>Funds List</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <select className="motivation-select" style={{ width: '300px', textAlign: 'center' }} onChange={(e) => handleSelectFund(JSON.parse(e.target.value))}>
            <option value="">Select a Fund</option>
            {funds.map(fund => (
              <option key={`${fund.fundName}`} value={JSON.stringify(fund)}>
                {fund.fundName}
              </option>
            ))}
          </select>
        </div>

        {selectedFund && (
          <div className='motivation-detail' style={{ width: '600px', border: '1px solid #ccc', padding: '10px', textAlign: 'left', marginBottom: '20px', margin: '0 auto' }}>
            <h3>Fund Name: {selectedFund.fundName}</h3>
            <p>Total Amount allocated to fund: {selectedFund.totalAmount}</p>
            <p>Remaining fund balance: {selectedFund.currentAmount}</p>
            <p>Amount allocated to applicant: {selectedFund.amountPerApplicant}</p>
          </div>
        )}
      </main>

      <footer className="App-footer">
        © 2024 FundIT. All rights reserved.
      </footer>
    </div>
  );
};

export default MyFundOpps;



// import React, { useEffect, useState } from 'react';

// const MyFundOpps = () => {
//   const [funds, setFunds] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFunds = async () => {
//       try {
//         const response = await fetch('https://fundit.azurewebsites.net/viewMyFunds/auth0|123456789', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setFunds(data.funds);
//       } catch (error) {
//         setError('Failed to fetch funds data');
//       }
//     };

//     fetchFunds();
//   }, []);

//   return (
//     <main> {/* Main wrapper replacing div */}
//       <h1>My Funds</h1>
//       {error && <section>{error}</section>} {/* Use section for error display */}
//       <form> {/* Use form to semantically wrap select input if it's part of a form submission context */}
//         <label htmlFor="fundSelect">Select a Fund</label> {/* Accessibility improvement with label */}
//         <select id="fundSelect">
//           <option value="">Select a Fund</option>
//           {funds.map(fund => (
//             <option key={fund.id} value={fund.id}>
//               {fund.name}
//             </option>
//           ))}
//         </select>
//       </form>
//     </main>
//   );
// };

// export default MyFundOpps;
