import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DrawingApp from "./pages/DrawingApp";
import Room from "./pages/Room";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import axios from "axios";
import AllDocuments from "./pages/AllDocuments";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import LoggedHome from "./pages/LoggedHome";
import { backendURL } from "./utils/config";
import {jwtDecode} from "jwt-decode";

const uuid = () => {
  var S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [cookie, setCookie] = useCookies(["token"]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  // console.log(cookie.token);

  useEffect(() => {
    const token = cookie.token;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // console.log(decoded.email);
        setUserEmail(decoded.email); // Assuming `email` is the key in the JWT payload
        // console.log("email: ",userEmail);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.post(
    //       `${backendURL}/auth/user`,
    //       {},
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         withCredentials: true, // Include credentials
    //       }
    //     );

    //     const receivedData = response.data;
    //     console.log(receivedData);
    //       if (receivedData.isAuth) {
    //         setUserName(receivedData.name);
    //         setUserEmail(receivedData.email);
    //       }
    //   } catch (error) {
    //     toast.error("Something Went Wrong!");
    //     // console.error("Error fetching data:", error);
    //   }
    // };

    // fetchData();
  }, [userEmail]);

  // useEffect(()=>{
  //   if(userEmail){
  //     console.log("Done");
  //   } else{
  //     // setUserEmail("asdf");
  //     console.log("Not Done");
  //   }
  // }, [userEmail])

  return (
    <div className="App w-screen h-screen ">
      <BrowserRouter>
        {cookie.token ? (
          <Routes>
            <Route path="/" element={<LoggedHome />} />
            <Route
              path="/myDocuments"
              element={
                <AllDocuments
                  userEmail={userEmail}
                  setUser={setUser}
                  uuid={uuid}
                  userName={userName}
                  users={users}
                  setUsers={setUsers}
                />
              }
            />
            <Route
              path="/create-join-room"
              element={
                <Room
                  uuid={uuid}
                  user={user}
                  setUser={setUser}
                  users={users}
                  setUsers={setUsers}
                  userName={userName}
                  userEmail={userEmail}
                />
              }
            />
            <Route
              path="/drawing-board/:roomId"
              element={
                <DrawingApp
                  user={user}
                  setUser={setUser}
                  users={users}
                  setUsers={setUsers}
                />
              }
            />
            <Route path="*" element={<Navigate to="/myDocuments" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/sign-up"
              element={<SignUp userName={userName} userEmail={userEmail} />}
            />
            <Route
              path="/login"
              element={<Login userName={userName} userEmail={userEmail} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
