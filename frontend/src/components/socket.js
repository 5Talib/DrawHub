import { io } from "socket.io-client";
import { backendURL } from "../utils/config";

// "undefined" means the URL will be computed from the `window.location` object
const URL = backendURL

export const socket = io(URL, {
  transports: ["websocket"],
});
