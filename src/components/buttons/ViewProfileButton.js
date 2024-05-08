import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ViewProfileButton = () => {
    const { isAuthenticated} = useAuth0();
  
    return (
        <>
          {isAuthenticated && (
            <Link to="/view-profile">
              <button className='button'>View My Profile</button>
            </Link>
          )}
        </>
      );
    };
    

  export default ViewProfileButton