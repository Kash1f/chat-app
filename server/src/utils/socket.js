import Chat from "../models/Chat.js";
import User from "../models/User.js";

const handleSocketConnection = (socket, io) => {
  console.log(`User ${socket.userId} connected`);

  //marking user as online and join personal room
  User.findByIdAndUpdate(socket.userId, { isOnline: true }).catch(
    console.error
  );
  socket.join(socket.userId);

  //handling messages
  const handleMessage = async ({ receiverId, message }, callback) => {
    try {
      console.log(
        `Message from ${socket.userId} to ${receiverId}: "${message}"`
      );

      const [sender, receiver] = await Promise.all([
        User.findById(socket.userId),
        User.findById(receiverId),
      ]);

      if (!sender || !receiver) throw new Error("User not found");
      if (sender.role === receiver.role)
        throw new Error("Only players and fans can chat");

      const newMessage = await Chat.create({
        senderId: socket.userId,
        receiverId,
        message,
      });

      console.log("Message saved:", newMessage._id);

      //send to receiver and confirm to sender
      io.to(receiverId).emit("receiveMessage", newMessage);
      socket.emit("messageSent", newMessage);

      //callback for acknowledgment
      callback?.({ status: "success", messageId: newMessage._id });
    } catch (error) {
      console.error("Message error:", error.message);
      socket.emit("error", error.message);
      callback?.({ status: "error", error: error.message });
    }
  };

  //listen to both event types
  socket.on("sendMessage", handleMessage);
  socket.on("message", handleMessage);

  //handle disconnection
  socket.on("disconnect", async () => {
    await User.findByIdAndUpdate(socket.userId, { isOnline: false }).catch(
      console.error
    );
    console.log(`User ${socket.userId} disconnected`);
  });
};

export default handleSocketConnection;
