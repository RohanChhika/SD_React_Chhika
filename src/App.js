import React, { useState, useCallback } from "react";
import logo from './components/Images/logo1.png';
import './App.css';
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/profile";
import { Routes, Route } from "react-router-dom";
import ApplyFundManagerButton from "./components/ApplyFundManagerButton";
import FundManagerApplication from "./components/FundManagerApplication";
import AdminViewFundRequests from "./components/AdminViewFundRequestsButton";
import AdminFundReq from "./components/AdminFundReq";
const App = () => {
  const [isUserAdded, setIsUserAdded] = useState(false);
  const onUserAdded = useCallback(() => {
    setIsUserAdded(true);
  }, []);

  return (
    <Routes>
      <Route index element = {
    <main className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="center-text">
          <h1>Welcome to FundIT</h1>
        </div>
        <div className="login-container">
          <LoginButton onUserAdded={onUserAdded} />
          {isUserAdded && <ApplyFundManagerButton/>}
          {isUserAdded && <AdminViewFundRequests/>}
          <LogoutButton />
        </div>
      </header>
      {isUserAdded && <Profile />}
      <footer className="App-footer">
        © 2024 FundIT. All rights reserved.
      </footer>
    </main>
  } />
    <Route path = {'/fund-manager-request'} element = {
      <FundManagerApplication/>
    } />
      <Route path = {'/admin-fund-manager-requests'} element = {
      <AdminFundReq/>
    } />

 
    </Routes>
  );
}

export default App;
