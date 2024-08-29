import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

export default function EmailModal({
  showEmailModal,
  setShowEmailModal,
  handleShare,
  isLoading,
}) {
  const [email, setEmail] = useState("");
  const handleClick = () => {
    if (!email) {
        toast.error("Please enter the email address to whom you want to share");
        return;
    }
    // toast.success("Meeting details shared successfully!")
    handleShare(email);
    // setShowEmailModal(!showEmailModal);
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => {
        setShowEmailModal(!showEmailModal);
      }}
    >
    {isLoading && <Loader />}
      <div
        className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg p-6 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-lg font-semibold mb-4">Share via Email</div>
        <input
          type="email"
          placeholder="Enter email"
          className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:border-green-500 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            onClick={handleClick}
            className="px-4 py-2 mr-2 bg-purple-500 hover:bg-purple-600 text-white rounded focus:outline-none"
          >
            Share
          </button>
          <button
            onClick={() => setShowEmailModal(false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
