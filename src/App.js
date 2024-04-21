import React, { useState, useCallback } from "react";
import logo from './components/Images/logo1.png';
import './App.css';
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/profile";

const App = () => {
  const [isUserAdded, setIsUserAdded] = useState(false);
  const onUserAdded = useCallback(() => {
    setIsUserAdded(true);
  }, []);

  return (
    <main className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="center-text">
          <h1>Welcome to FundIT</h1>
        </div>
        <div className="login-container">
          <LoginButton onUserAdded={onUserAdded} />
          <LogoutButton />
        </div>
      </header>
      {isUserAdded && <Profile />}
      <footer className="App-footer">
        © 2024 FundIT. All rights reserved.
      </footer>
    </main>
  );
};

export default App;
