import React, { useState, useEffect, useRef } from "react";
import { socket } from "./socket";
import { Icon } from "@iconify/react";
import Modal from "./Modal";

export default function ConnectedUsers({
  users,
  user,
  setUser,
  handleEditAccess,
}) {
  // const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  // const toggleOptions = () => {
  //   setShowOptions(!showOptions);
  // };
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const confirmAccess = () => {
    handleEditAccess(currentUser.userId, currentUser.roomId, users);
    toggleModal();
  };

  const host = user;

  return (
    <div className="">
      <div className="absolute top-0 right-0  bg-[#357d70] bg-gradient-to-r from-blue-500 to-green-500 text-white rounded mt-0.5 mr-0.5 p-4 w-2/12 opacity-90">
        <div className="text-lg font-semibold mb-4 text-center mt-2">
          Connected Users
        </div>
        <div className="overflow-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between py-2"
              //   onClick={() => handleEditAccess(user.userId, user.roomId, users)}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-800 text-white rounded-full h-10 w-10 flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                  {user.name.charAt(1).toUpperCase()}
                </div>
                <div>
                  {user.name} {user.socketId === socket.id && `(You)`}
                </div>
              </div>
              <button
                title="Edit Access"
                className="cursor-pointer"
                onClick={() => {
                  if (host.host && !user.host) {
                    // only host should provide access and access of host should not change
                    setCurrentUser(user);
                    toggleModal();
                  }
                }}
              >
                <Icon icon="mi:options-vertical" width={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          onClose={toggleModal}
          onConfirm={confirmAccess}
          name={currentUser.name}
          editAccess={currentUser.editAccess}
        />
      )}
      {/* showOptions && (
        <div
          ref={optionsRef}
          className="absolute right-0 mt-8 bg-white border border-gray-200 rounded-lg p-4"
        >
          <div>
            <div className="py-1 cursor-pointer hover:bg-gray-100">
              Give Edit Access
            </div>
            <div className="py-1 cursor-pointer hover:bg-gray-100">
              Remove Access
            </div>
          </div>
        </div>
      ) */}
    </div>
  );
}
