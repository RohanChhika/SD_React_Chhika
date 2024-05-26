import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import logo from '../components/Images/logo1.png';
import BackButton from './buttons/BackButton';

const MyFundOpps = () => {
  const [selectedFund, setSelectedFund] = useState(null);
  const [funds, setFunds] = useState([]);
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    if (!user?.sub) return;
    const userID = user?.sub;

    const fetchFund = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`https://fundit.azurewebsites.net/viewMyFunds/${userID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFunds(data);
        console.log('Funds fetched successfully.');
      } catch (error) {
        console.error('Failed to fetch funds:', error.message);
      }
    };

    fetchFund();
  }, [getAccessTokenSilently, user?.sub]);

  const handleSelectFund = (fund) => {
    setSelectedFund(fund);
  };

  return (
    <main className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <section className="center-text">
          <h1>My Fund Opportunity</h1>
        </section>
        <aside className="login-container">
          <BackButton />
        </aside>
      </header>
      <section style={{ textAlign: 'center' }}>
        <h1>My Funds</h1>
        <h2>Funds List</h2>
        <section style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <select className="motivation-select" onChange={(e) => handleSelectFund(JSON.parse(e.target.value))}>
            <option value="">Select a Fund</option>
            {funds.map(fund => (
              <option key={fund.fundName} value={JSON.stringify(fund)}>
                {fund.fundName}
              </option>
            ))}
          </select>
        </section>

        {selectedFund && (
          <article className='fund-details' style={{ margin: '0 auto', maxWidth: '600px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>Fund Name: {selectedFund.fundName}</h3>
            <p>Total Amount allocated to fund: {selectedFund.totalAmount}</p>
            <p>Remaining fund balance: {selectedFund.currentAmount}</p>
            <p>Amount allocated to applicant: {selectedFund.amountPerApplicant}</p>
          </article>
        )}
      </section>

      <footer className="App-footer">
        © 2024 FundIT. All rights reserved.
      </footer>
    </main>
  );
};

export default MyFundOpps;



