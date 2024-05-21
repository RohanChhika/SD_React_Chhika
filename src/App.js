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
import Profile from "./components/profile"
import ViewAllFunds from "./components/buttons/ViewAllFundsButton";
import ViewMyFundButton from "./components/buttons/ViewMyFundButton";
import ViewFundStatus from "./components/ViewFundStatus";
import ViewMyFundManagerReqStatusButton from "./components/buttons/ViewFundManagerReqStatusButton";
import ViewMyFundManagerReqStatus from "./components/ViewMyFundManagerReqStatus";
import ViewMyFundOppButton from "./components/buttons/ViewMyFundOppButton";
import MyFundOpps from "./components/MyFundOpps";
import AboutUsTile from "./components/AboutUsTile";

const App = () => {
  // State to track if the user has been added
  const [isUserAdded, setIsUserAdded] = useState(false);

  // Callback function to set the user added state
  const onUserAdded = useCallback(() => {
    setIsUserAdded(true);
  }, []);

  return (
    
    //Default route 
    <Routes>
      <Route index element={
        <main className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <div className="center-text">
              <h1>Welcome to FundIT</h1>
            </div>
            {/* Login button with callback to set user added state */}
            <div className="login-container">
              {/* Conditional rendering of buttons based on user added state */}
              <LoginButton onUserAdded={onUserAdded} />
              {isUserAdded && <ApplyFundManagerButton />}
              {isUserAdded && <AdminViewFundRequests />}
              {isUserAdded && <AdminBlockUsersButton/>}
              {isUserAdded && <AddFundButton/>}
              {isUserAdded && <ViewMyFundRequestsButton/>}
              {isUserAdded && <ViewAllFunds/>}
              {isUserAdded && <ViewMyFundButton/>}
              {isUserAdded && <ViewMyFundManagerReqStatusButton/>}
              {isUserAdded && <ViewMyFundOppButton/>}
              
              <LogoutButton />
            </div>
          </header>

          {/* Conditional rendering of Aboout Us component based on user added state */}
          {!isUserAdded && <AboutUsTile/>}
          {/* Conditional rendering of FundsPage component based on user added state */}
          
          {isUserAdded && <Profile />}
          <footer className="App-footer">
            © 2024 FundIT. All rights reserved.
          </footer>
        </main>
      } />
      {/* Route for fund manager application */}
      <Route path="/fund-manager-request" element={<FundManagerApplication />} />
      {/* Route for admin to view fund manager requests */}
      <Route path="/admin-fund-manager-requests" element={<AdminFundReq />} />
      {/* Route for admin to handle users */}
      <Route path="/admin-handle-users" element={<AdminBlockUsers />}/>
      {/* Route to add a fund */}
      <Route path="/add-fund" element={<AddFundPage />}/>
      {/* Route to view user's fund requests */}
      <Route path="/view-my-fund-requests" element={<ViewFundRequests />}/>
      {/* Route to apply for a fund */}
      <Route path="/apply/:userId/:fundName" element={<ApplyForFund />} />
      {/* Route to view user profile */}
      <Route path="/apply-for-fund" element={<FundsPage />}/>
      {/* Route to view user application status */}
      <Route path ="/fund-status" element = {<ViewFundStatus/>}/>
      {/* Route to view user fund manager application status */}
      <Route path = "/fund-req-status" element = {<ViewMyFundManagerReqStatus/>} />
      {/* Route to view fund manager opportunities */}
      <Route path = "/my-fund-opps" element = {<MyFundOpps/>} />

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

export default App; //Export the App component
