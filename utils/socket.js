import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

export default socket;
