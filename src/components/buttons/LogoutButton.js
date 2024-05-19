import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  // Destructure logout function and isAuthenticated boolean from useAuth0 hook
    const { logout , isAuthenticated} = useAuth0();
  
    return (
      // Render the Logout button only if the user is authenticated
        isAuthenticated &&(
      <button className="button" onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>

        )
    )
  }

  export default LogoutButton