import jwt from "jsonwebtoken";
import User from "../models/User.js";

const socketAuth = async (socket, next) => {
  try {
    const authHeader = socket.handshake?.headers?.authorization;
    const token =
      socket.handshake?.auth?.token ||
      socket.handshake?.query?.token ||
      (authHeader && authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null);

    if (!token) {
      return next(new Error("Authentication failed: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return next(new Error("Authentication failed: Invalid token"));
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new Error("Authentication failed: User not found"));
    }

    socket.userId = user._id.toString();
    socket.user = user;

    next();
  } catch (error) {
    next(new Error(`Authentication failed: ${error.message}`));
  }
};

export default socketAuth;