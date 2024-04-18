import React,{useState} from "react";
import logo from './logo.svg';
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
    <>
      <main>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>My App</h1>
        <LoginButton onUserAdded={onUserAdded} />
        <LogoutButton />
        {isUserAdded && <Profile />}
      </main>
    </>
  );
};

export default App;