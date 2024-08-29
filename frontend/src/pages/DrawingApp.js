import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs";
// import { io } from "socket.io-client";
import { socket } from "../components/socket";
import Controls from "../components/Controls";
import {useNavigate } from "react-router-dom";
import ConnectedUsers from "../components/ConnectedUsers";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import EmailModal from "../components/EmailModal";
import { makeUnauthenicationPOSTRequest } from "../utils/serverHelpers";
import Loader from "../components/Loader";

const generator = rough.generator();
// const socket = io.connect("http://localhost:3001");

export default function DrawingApp({ user, setUser, users, setUsers }) {
  // const location = useLocation();
  // const user= location.state;
  const canvasRef = useRef();
  const [elements, setElements] = useState(["dummy"]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [history, setHistory] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [showConnectedUsers, setShowConnectedUsers] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  //   console.log(canvasRef);
  useEffect(() => {
    if (user && (user.editAccess || user.host)) {
      setShowControls(true); // Show controls if user has edit access or is the host
    }
    // console.log("here", showControls);
    // socket.on("changeControls",({socketId})=>{
    //   console.log(socketId);
    // })
  }, []);
  useEffect(() => {
    socket.on("sendControls", (data) => {
      // console.log(data);
      if (showControls) {
        setShowControls(false);
      } else {
        setShowControls(true);
        // toast.success("You can edit this document");
      }
    });
  }, [showControls, user]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.9;
      context.lineCap = "round";
      const roughCanvas = rough.canvas(canvasRef.current);
      // Redraw elements after resizing
      elements.forEach((element, index) => {
        if (index === 0) {
          return;
        }
        if (element.type === "pencil") {
          roughCanvas.linearPath(element.path, {
            stroke: element.stroke,
            roughness: 0,
          });
        } else if (element.type === "line") {
          roughCanvas.draw(
            generator.line(
              element.offsetX,
              element.offsetY,
              element.width,
              element.height,
              { stroke: element.stroke, roughness: 0 }
            )
          );
        } else if (element.type === "rectangle") {
          roughCanvas.draw(
            generator.rectangle(
              element.offsetX,
              element.offsetY,
              element.width,
              element.height,
              { stroke: element.stroke, roughness: 0 }
            )
          );
        } else if (element.type === "circle") {
          roughCanvas.draw(
            generator.circle(
              element.offsetX,
              element.offsetY,
              element.diameter,
              {
                stroke: element.stroke,
                roughness: 0,
              }
            )
          );
        }
        // Redraw your elements here based on the updated canvas dimensions
      });
    };

    // Call resizeCanvas initially to set canvas dimensions
    resizeCanvas();

    // Add event listener for window resize
    window.addEventListener("resize", resizeCanvas);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [elements]); // Include elements as a dependency to ensure proper cleanup and rerendering

  useEffect(() => {
    if (!user) {
      navigate("/myDocuments");
    }
    // console.log(user);
    if (user && !(user.editAccess && user.host)) {
      setTool("");
    }
    socket.on("onDraw", (data) => {
      // console.log(data);
      setElements(data.data);
      setHistory(data.history);
    });
    socket.on("load-document", (data) => {
      // console.log(data);
      if (data) {
        setElements(data);
      }
    });
  }, [user, navigate, users]);

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    const context = canvasRef.current.getContext("2d");

    if (elements.length > 0) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
    // console.log(elements);
    elements.forEach((element, index) => {
      if (index === 0) {
        return;
      }
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, {
          stroke: element.stroke,
          roughness: 0,
        });
      } else if (element.type === "line") {
        roughCanvas.draw(
          generator.line(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            { stroke: element.stroke, roughness: 0 }
          )
        );
      } else if (element.type === "rectangle") {
        roughCanvas.draw(
          generator.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            { stroke: element.stroke, roughness: 0 }
          )
        );
      } else if (element.type === "circle") {
        roughCanvas.draw(
          generator.circle(element.offsetX, element.offsetY, element.diameter, {
            stroke: element.stroke,
            roughness: 0,
          })
        );
      }
    });
    // console.log(elements.length);
  }, [elements]);

  const startDrawing = (e) => {
    if (!user) {
      navigate("/myDocuments");
    }
    const { offsetX, offsetY } = e.nativeEvent;
    // console.log(offsetX, offsetY);

    if (tool === "pencil") {
      setElements((prev) => [
        ...prev,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: "black",
        },
      ]);
    } else {
      setElements((prev) => [
        ...prev,
        {
          type: tool,
          offsetX,
          offsetY,
          //   width: offsetX,
          //   height: offsetY,
          stroke: "black",
        },
      ]);
    }
    // socket.emit("draw", elements);

    setIsDrawing(true);
  };

  const draw = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (isDrawing) {
      if (tool === "pencil") {
        const { path } = elements[elements.length - 1];
        const newPath = [...path, [offsetX, offsetY]];

        setElements((prev) =>
          prev.map((ele, index) => {
            if (index === elements.length - 1) {
              return { ...ele, path: newPath };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "line") {
        setElements((prev) =>
          prev.map((ele, index) => {
            if (index === elements.length - 1) {
              return { ...ele, width: offsetX, height: offsetY };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "rectangle") {
        setElements((prev) =>
          prev.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "circle") {
        setElements((prev) =>
          prev.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                diameter: offsetX - ele.offsetX + (offsetY - ele.offsetY),
              };
            } else {
              return ele;
            }
          })
        );
      }

      socket.emit("draw", {
        data: elements,
        history: history,
      });
    }
  };

  const finishDrawing = (e) => {
    setIsDrawing(false);
  };

  const undo = () => {
    if (elements.length === 1) return;

    // Save the element to history
    // console.log(elements.length);
    const removedElement = elements[elements.length - 1];
    setHistory((prev) => [...prev, removedElement]);

    // Update the elements state
    setElements((prevElements) => {
      const updatedElements = prevElements.slice(0, -1);
      // Emit the draw event after updating the state
      socket.emit("draw", { data: updatedElements, history: history });
      // console.log(updatedElements.length);
      return updatedElements;
    });
  };

  const redo = () => {
    if (history.length === 0) return;

    // Get the element from history
    const restoredElement = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    // Update the elements state
    setElements((prevElements) => {
      const updatedElements = [...prevElements, restoredElement];
      // Emit the draw event after updating the state
      socket.emit("draw", { data: updatedElements, history: history });
      return updatedElements;
    });
  };

  const handleSave = () => {
    socket.emit("save", elements);
    toast.success("Successfully saved document!");
  };

  const handleEditAccess = (userId, roomId, users) => {
    // console.log("clicked", userId, roomId, users);
    socket.emit("updateEditAccess", { userId, roomId, users });
    // socket.emit("controlsAccess")
    const userToUpdate = users.find((user) => user.userId === userId);
    if (socket.id === userToUpdate.socketId) {
      setUser(userToUpdate);
    }
    // console.log(users);
    // console.log(userToUpdate);
    if (user.host) {
      socket.emit("changeControls", {
        socketId: userToUpdate.socketId,
        showControls,
      });
    }
    // console.log(showControls);
  };
  const toggleShowConnectedUsers = () => {
    setShowConnectedUsers(!showConnectedUsers);
  };

  const handleShare = async (email) => {
    try {
      setIsLoading(true);
      const response = await makeUnauthenicationPOSTRequest("/share/sendMail", {
        email,
        name: user.name,
        id: user.roomId,
      });
      toast.success("Meeting details shared successfully!");
      // console.log(email, user.name, user.roomId);
      // setShowEmailModal(!showEmailModal);
      // console.log(response);
      setTimeout(() => {
        setShowEmailModal(!showEmailModal);
      }, 2500);
    } catch (error) {
      toast.error("Something Went Wrong!")
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      {isLoading && <Loader />}
      {showEmailModal && (
        <EmailModal
          showEmailModal={showEmailModal}
          setShowEmailModal={setShowEmailModal}
          handleShare={handleShare}
          isLoading={isLoading}
        />
      )}
      {showControls ? (
        <div className="flex justify-between items-center bg-[#357d70] bg-gradient-to-r from-blue-500 to-green-500 w-full h-screen px-4">
          <Controls
            setTool={setTool}
            undo={undo}
            redo={redo}
            tool={tool}
            handleSave={handleSave}
          />
          <div className="flex gap-2 items-center">
            <div
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-black cursor-pointer font-semibold"
              onClick={toggleShowConnectedUsers}
            >
              Connected Users
            </div>
            <div
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-black cursor-pointer font-semibold flex gap-1 items-center"
              onClick={() => {
                setShowEmailModal(!showEmailModal);
              }}
            >
              <div>Share</div>
              <Icon
                icon="mdi-light:share"
                style={{ color: "black" }}
                width={25}
              />
            </div>
            <div
              className="py-2 px-4 bg-red-600 hover:bg-red-500 rounded-md text-white cursor-pointer font-semibold"
              onClick={()=>{navigate("/myDocuments")}}
            >
              Leave
            </div>
          </div>
          {/* JSON.stringify(elements.length) */}
          {/* JSON.stringify(users) */}
        </div>
      ) : (
        <div className="flex justify-between items-center bg-[#357d70] bg-gradient-to-r from-blue-500 to-green-500 w-full h-screen px-4">
          <div className="text-white font-bold text-2xl">DrawHub</div>
          <div className="flex gap-2 items-center">
            <div
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-black cursor-pointer font-semibold"
              onClick={toggleShowConnectedUsers}
            >
              Connected Users
            </div>
            <div
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-black cursor-pointer font-semibold flex gap-1 items-center"
              onClick={() => {
                setShowEmailModal(!showEmailModal);
              }}
            >
              <div>Share</div>
              <Icon
                icon="mdi-light:share"
                style={{ color: "black" }}
                width={25}
              />
            </div>
          </div>
        </div>
      )}
      <div className="relative ">
        <canvas
          ref={canvasRef}
          className="  cursor-crosshair"
          // width={window.innerWidth}
          // height={window.innerHeight}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
        />
        {showConnectedUsers && (
          <ConnectedUsers
            users={users}
            user={user}
            setUser={setUser}
            handleEditAccess={handleEditAccess}
          />
        )}
      </div>
    </div>
  );
}
