import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

const ViewProfileButton = () => {
  // Destructure isAuthenticated from useAuth0 hook to check authentication status
    const { isAuthenticated} = useAuth0();
  
    return (
        <>
        {/* Render the View My Profile button only if the user is authenticated */}
          {isAuthenticated && (
            <Link to="/view-profile"> {/* Link to the view-profile route */}
              <button className='button'>View My Profile</button> {/* Button to view profile */}
            </Link>
          )}
        </>
      );
    };
    

  export default ViewProfileButton