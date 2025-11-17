import { io } from "socket.io-client";

const socket = io("https://rococo-fairy-e1d6f8.netlify.app", {
  withCredentials: true,
});

export default socket;
