import React from "react";
import axios from "axios";
import { useCookies, withCookies, Cookies } from "react-cookie";
import { frontEndURL, backendURL } from "../utils/config";

const LogoutButton = () => {
  const [cookie, setCookie] = useCookies(["token"]);
  const handleLogout = async () => {
    // document.cookie = "token=";
    // window.location.href = "/";
    // return false;
    try {
      // Make a POST request to the logout endpoint
      // const response = await axios.post(
      //   `${backendURL}/auth/logout`,
      //   {},
      //   {
      //     headers: {
      //       "Content-Type": "application/json", // Specify the content type
      //     },
      //     // Optional: Include credentials to send cookies
      //     withCredentials: true, // or false if you don't need to send cookies
      //   }
      // );

      // // Check if the request was successful (status code 200)
      // if (response.status === 200) {
      //   window.location.href = FrontEndURL;
      //   console.log("Logged out successfully");
      // } else {
      //   // If not successful, display an error message
      //   console.error("Failed to log out:", response.statusText);
      // }
      document.cookie = "token=";
      window.location.href = '/';
    } catch (error) {
      // If an error occurs during the request, log it
      console.error("Error logging out:", error);
    }
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
