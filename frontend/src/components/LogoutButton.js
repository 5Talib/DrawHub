import React from "react";

const LogoutButton = () => {
  const handleLogout = () => {
    document.cookie = "token=";
    window.location.href = "/";
    return false;
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
