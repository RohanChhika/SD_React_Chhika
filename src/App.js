import React, { useState, useCallback } from "react";
import logo from './components/Images/logo1.png';
import './App.css';
import LoginButton from "./components/buttons/LoginButton";
import LogoutButton from "./components/buttons/LogoutButton";
import { Routes, Route } from "react-router-dom";
import ApplyFundManagerButton from "./components/buttons/ApplyFundManagerButton";
import FundManagerApplication from "./components/FundManagerApplication";
import AdminViewFundRequests from "./components/buttons/AdminViewFundRequestsButton";
import AdminFundReq from "./components/AdminFundReq";
import AdminBlockUsers from "./components/AdminBlockUsers";
import AdminBlockUsersButton from "./components/buttons/AdminBlockUsersButton";
import AddFundPage from "./components/AddFundPage";
import AddFundButton from "./components/buttons/AddFundButton"
import ViewFundRequests from "./components/ViewFundRequests";
import ViewMyFundRequestsButton from "./components/buttons/ViewMyFundRequestsButtton"
import FundsPage from "./components/FundsPage";
import ApplyForFund from "./components/ApplyForFund"

const App = () => {
  const [isUserAdded, setIsUserAdded] = useState(false);
  const onUserAdded = useCallback(() => {
    setIsUserAdded(true);
  }, []);

  return (
    <Routes>
      <Route index element={
        <main className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <div className="center-text">
              <h1>Welcome to FundIT</h1>
            </div>
            <div className="login-container">
              <LoginButton onUserAdded={onUserAdded} />
              {isUserAdded && <ApplyFundManagerButton />}
              {isUserAdded && <AdminViewFundRequests />}
              {isUserAdded && <AdminBlockUsersButton/>}
              {isUserAdded && <AddFundButton/>}
              {isUserAdded && <ViewMyFundRequestsButton/>}
              <LogoutButton />
            </div>
          </header>
          {isUserAdded && <FundsPage />}
          <footer className="App-footer">
            © 2024 FundIT. All rights reserved.
          </footer>
        </main>
      } />
      <Route path="/fund-manager-request" element={<FundManagerApplication />} />
      <Route path="/admin-fund-manager-requests" element={<AdminFundReq />} />
      < Route path ="/admin-handle-users" element = {<AdminBlockUsers />}/>
      <Route path = "/add-fund" element = {<AddFundPage/>}/>
      <Route path = "/view-my-fund-requests" element ={<ViewFundRequests/>}/>
      <Route path="/apply/:userId/:fundName" element={<ApplyForFund />} />

      {/* Wildcard route to handle all other routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// A component to render when the route is not found
const NotFound = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default App;
