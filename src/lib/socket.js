import { io } from "socket.io-client";

const socket = io("https://chat-backend-2qm3.onrender.com", {
  transports: ["websocket"],
});

export default socket;
