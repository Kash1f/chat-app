import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODdkNWUwNDI4YzgxM2JhYTVjZTAyMyIsImlhdCI6MTc1Mzc3MjE5MiwiZXhwIjoxNzU1MDY4MTkyfQ.fSD5JFzz5QHHec1o96mncXmUSeOEcI5iEofJ1pOTDf4";
const receiverId = "6887a93812160e82da9fe1f3"; //user ID of the receiver

console.log("1. Connecting to Socket.IO...");
const socket = io("http://localhost:5000", {
  auth: { token }, //primary method
  query: { token }, //fallback method
  extraHeaders: { Authorization: `Bearer ${token}` },
  transports: ["websocket"],
  reconnection: false //for clearer debugging
});

//add this debug handler
socket.onAny((event, ...args) => {
  console.log(`Socket event: ${event}`, args);
});

//connection events
socket.on("connect", () => {
  console.log("2. Connected! Socket ID:", socket.id);
  console.log("2. Sending test message...");
  socket.emit("sendMessage", {
    receiverId,
    message: "Test from backend script 4"
  });
});

//message events
socket.on("receiveMessage", (msg) => {
  console.log("3. Message received:", msg);
});

//error handling
socket.on("connect_error", (err) => {
  console.error("Connection failed:", err.message);
  console.error("Full error:", err);
});

socket.on("error", (err) => {
  console.error("Socket error:", err);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

//add timeout to exit
setTimeout(() => {
  console.log("Script completed");
  socket.disconnect();
  process.exit(0);
}, 3000);