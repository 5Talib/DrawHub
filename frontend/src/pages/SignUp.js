import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { makeUnauthenicationPOSTRequest } from "../utils/serverHelpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import { frontEndURL } from "../utils/config";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!name) {
      toast.error("Please specify your name");
      return;
    }
    if (!email) {
      toast.error("Please specify your email address");
      return;
    }
    if (!password) {
      toast.error("Please specify your password");
      return;
    }
    const response = await makeUnauthenicationPOSTRequest("/auth/register", {
      name,
      email,
      password,
    });
    // console.log(response);
    if (response && !response.err) {
      const token = response.data.token;
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setCookie("token", token, { path: "/", expires: date });
      navigate("/myDocuments");
      // window.location.href = FrontEndURL + "/myDocuments";
    } else {
    //   alert("failure");
      toast.error("Something Went Wrong!")
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
    {isLoading && <Loader />}
      <div className="w-2/3 md:w-1/3 px-8 py-12 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-8">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-md p-3 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md p-3 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md p-3 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full px-6 py-3 mt-4 bg-purple-500 text-white rounded-md focus:outline-none hover:bg-purple-600"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
