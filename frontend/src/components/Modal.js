import React from "react";

export default function Modal({ show, onClose, onConfirm, name, editAccess }) {
  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className=" bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg p-6 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-lg font-semibold mb-4">
          {!editAccess
            ? `Give Edit Access to ${name}?`
            : `Remove Edit Access from ${name}`}
        </div>
        <div className="flex justify-end">
          <button
            className="mr-2 bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="bg-violet-500 hover:bg-violet-600 text-white py-1 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
