import React, { useEffect, useState } from "react";
import { makeUnauthenicationPOSTRequest } from "../utils/serverHelpers";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { socket } from "../components/socket";
import Loader from "../components/Loader";
import LogoutButton from "../components/LogoutButton";
import { toast } from "react-toastify";

export default function AllDocuments({
  userEmail,
  setUser,
  userName,
  uuid,
  users,
  setUsers,
}) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("userConnected", (data) => {
      if (data.success) {
        // console.log("User connected");
        // setUsers(data.users);
        // console.log(data.users);
      } else {
        // console.log("Something went wrong");
        toast.error("Something Went Wrong!");
      }
      // console.log(users);
    });
    socket.on("usersList", (data) => {
    //   console.log(data);
      setUsers(data.users);
    });
  }, [users, setUsers]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await makeUnauthenicationPOSTRequest(
          "/document/myDocuments",
          {
            email: userEmail,
          }
        );
        // console.log(response.data);
        setDocuments(response.data);
      } catch (error) {
        // console.error("Error fetching documents:", error);
        toast.error("Something Went Wrong!")
      }
    };

    fetchDocuments();
  }, [userEmail]);

  useEffect(()=>{
    if(documents){
        // console.log(documents.length);
        // console.log("0");
        setIsLoading(false);
        
    }
  }, [documents])


  const handleGenerateRoom = (document) => {
    // e.preventDefault();

    const roomData = {
      name: userName,
      roomId: document.roomId,
      userId: uuid(),
      host: true,
      presenter: true,
      editAccess: true,
      email: userEmail,
      title: document.title,
    };

    setUser(roomData);
    // console.log(roomData);
    navigate(`/drawing-board/${document.roomId}`);
    socket.emit("userJoined", roomData);
  };
  return (
    <div className=" w-full h-full py-8 bg-gradient-to-r from-blue-500 to-green-500">
      {isLoading && <Loader />}
      <div className="bg-white hover:bg-gray-100 text-black py-3 px-6 rounded-full text-center font-semibold text-lg focus:outline-none absolute right-4 top-4">
        <LogoutButton />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-7 mt-8 px-10">
        {documents.map((document) => (
          <div
            key={document._id}
            className="bg-white flex flex-col justify-between shadow-md rounded-md transition duration-300 hover:shadow-lg p-5 min-h-max"
          >
            <div className="text-lg font-semibold mb-2">{document.title}</div>
            <button
              className="mt-4 max-w-max self bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleGenerateRoom(document)}
            >
              Edit
            </button>
          </div>
        ))}
        <div className="bg-white shadow-md rounded-md transition duration-300 hover:shadow-lg p-5">
          <div className="text-lg font-semibold mb-2">Create/Join Room</div>
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            <Link to="/create-join-room">
              <Icon icon="mdi:add-bold" className="text-center" width={23} />
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
