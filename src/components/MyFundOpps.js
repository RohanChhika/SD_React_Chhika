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
//     <div>
//       <h1>My Funds</h1>
//       {error && <div>{error}</div>}
//       <select>
//         <option value="">Select a Fund</option>
//         {funds.map(fund => (
//           <option key={fund.id} value={fund.id}>
//             {fund.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default MyFundOpps;


import React, { useEffect, useState } from 'react';

const MyFundOpps = () => {
  const [funds, setFunds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await fetch('https://fundit.azurewebsites.net/viewMyFunds/auth0|123456789', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFunds(data.funds);
      } catch (error) {
        setError('Failed to fetch funds data');
      }
    };

    fetchFunds();
  }, []);

  return (
    <main> {/* Main wrapper replacing div */}
      <h1>My Funds</h1>
      {error && <section>{error}</section>} {/* Use section for error display */}
      <form> {/* Use form to semantically wrap select input if it's part of a form submission context */}
        <label htmlFor="fundSelect">Select a Fund</label> {/* Accessibility improvement with label */}
        <select id="fundSelect">
          <option value="">Select a Fund</option>
          {funds.map(fund => (
            <option key={fund.id} value={fund.id}>
              {fund.name}
            </option>
          ))}
        </select>
      </form>
    </main>
  );
};

export default MyFundOpps;
