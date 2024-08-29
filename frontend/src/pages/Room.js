import React, { useEffect, useState } from "react";
import { socket } from "../components/socket";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoutButton from "../components/LogoutButton";

export default function Room({
  uuid,
  user,
  setUser,
  users,
  setUsers,
  userName,
  userEmail,
}) {
  useEffect(() => {
    if (userName && userEmail) {
      setName(userName);
      setOtherName(userName);
    }
  }, [userName, userEmail]);
  // console.log("Username: ", userName);
  const [roomId, setRoomId] = useState(uuid());
  const [joinRoomId, setJoinRoomId] = useState("");
  const [name, setName] = useState(userName);
  const [otherName, setOtherName] = useState("");
  const [title, setTitle] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("userConnected", (data) => {
      if (data.success) {
        // console.log("User connected");
        // setUsers(data.users);
        // console.log(data.users);
      } else {
        // console.log("Something went wrong");
        toast.error("Something went wrong!");
      }
      // console.log(users);
    });
    socket.on("usersList", (data) => {
      // console.log(data);
      setUsers(data.users);
    });
  }, [users, setUsers]);

  const handleGenerateRoom = (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please specify your name");
      return;
    }
    if (!title) {
      toast.error("Please specify your document title");
      return;
    }

    const roomData = {
      name: name,
      roomId,
      userId: uuid(),
      host: true,
      presenter: true,
      editAccess: true,
      email: userEmail,
      title: title,
    };

    setUser(roomData);
    // console.log(roomData);
    navigate(`/drawing-board/${roomId}`);
    socket.emit("userJoined", roomData);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();

    if (!otherName) {
      toast.error("Please specify your name");
      return;
    }
    if (!joinRoomId) {
      toast.error("Please specify room ID");
      return;
    }

    const roomData = {
      name: otherName,
      roomId: joinRoomId,
      userId: uuid(),
      host: false,
      presenter: false,
      editAccess: false,
      email: userEmail,
      title: "",
    };

    setUser(roomData);
    navigate(`/drawing-board/${joinRoomId}`);
    socket.emit("userJoined", roomData);
  };

  const handleCopy = async () => {
    try {
      if (roomId) {
        await navigator.clipboard.writeText(roomId);
        setCopyButtonText("Copied");
        setTimeout(() => {
          setCopyButtonText("Copy");
        }, 1000);
      }
    } catch (error) {
      // console.error("Failed to copy Room ID:", error);
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
      <div className="bg-white hover:bg-gray-100 text-black py-3 px-6 rounded-full text-center font-semibold text-lg focus:outline-none absolute right-4 top-4">
        <LogoutButton />
      </div>
      <div className="bg-white shadow-md rounded-lg p-8 space-y-8 w-2/3 md:w-1/3">
        <h2 className="text-2xl font-semibold text-center mb-6 ">
          Join or Create a Room
        </h2>
        <form className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="border border-gray-300 rounded-md p-3 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="title" className="text-sm font-medium">
              Document Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter your Document title"
              className="border border-gray-300 rounded-md p-3 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="roomId" className="text-sm font-medium">
              Room ID
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-3">
              <input
                id="roomId"
                type="text"
                placeholder="Generate room code"
                className="w-full focus:outline-none"
                value={roomId}
                disabled
                onChange={(e) => setRoomId(e.target.value)}
              />
              <div className="flex">
                {/* <div
                  className="text-white bg-green-500 px-2 py-0.5 rounded mx-0.5 cursor-pointer hover:bg-green-600"
                  onClick={() => {
                    const newRoomId = uuid();
                    setRoomId(newRoomId);
                  }}
                >
                  generate
                </div> */}
                <div
                  className={`text-red-500 py-0.5 px-2 rounded border border-solid border-red-500 cursor-pointer hover:bg-red-500 hover:text-white`}
                  onClick={handleCopy}
                >
                  {copyButtonText}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="px-6 py-3 mt-3 bg-purple-500 text-white rounded-md focus:outline-none hover:bg-purple-600"
              onClick={handleGenerateRoom}
            >
              Create Room
            </button>
          </div>
        </form>
        <hr className="border border-gray-300" />
        <form className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="otherName" className="text-sm font-medium">
              Your Name
            </label>
            <input
              id="otherName"
              type="text"
              placeholder="Enter your name"
              className="border border-gray-300 rounded-md p-3 focus:outline-none"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="joinRoomId" className="text-sm font-medium">
              Room ID
            </label>
            <input
              id="joinRoomId"
              type="text"
              placeholder="Enter room code"
              className="border border-gray-300 rounded-md p-3 focus:outline-none"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="px-6 py-3 mt-3 bg-teal-500 text-white rounded-md focus:outline-none hover:bg-teal-600"
              onClick={handleJoinRoom}
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
