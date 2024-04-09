import React from "react";
// import { useCookies, withCookies, Cookies } from "react-cookie";
// import { Navigate, useNavigate } from "react-router-dom";

const LogoutButton = () => {
  //   const navigate = useNavigate()
  // const [cookie, setCookie] = useCookies(["token"]);
  const handleLogout = () => {
    // Clear the authentication token cookie
    // setCookie("token");
    // console.log(cookie);
    // navigate("/login");
    document.cookie = "token=";
     window.location.href = '/';
     return false;
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
