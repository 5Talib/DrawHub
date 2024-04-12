import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? 'https://draw-hub-eta.vercel.app/' : 'https://draw-hub-eta.vercel.app/';
const URL = "https://draw-hub-eta.vercel.app/";

export const socket = io(URL);
