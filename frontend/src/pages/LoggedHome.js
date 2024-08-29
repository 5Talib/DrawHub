import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const LoggedHome = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-500 min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-xl px-6 py-12 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to DrawHub
        </h1>
        <p className="text-lg text-center mb-12">
          DrawHub is a collaborative drawing and live telecast platform where
          you can create, share, and collaborate on documents in real-time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/myDocuments"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-center font-semibold text-lg focus:outline-none"
          >
            Start Drawing
          </Link>
          <Link
            to="/"
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-center font-semibold text-lg focus:outline-none"
          >
            <LogoutButton />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoggedHome;
