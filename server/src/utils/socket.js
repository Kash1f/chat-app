import Chat from '../models/Chat.js';
import User from '../models/User.js';

const handleSocketConnection = (socket, io) => {
  console.log(`User ${socket.userId} connected`);
  console.log(`User object:`, socket.user ? `${socket.user._id} (${socket.user.role})` : 'No user object');
  
  //mark user as online
  User.findByIdAndUpdate(socket.userId, { isOnline: true }).catch(console.error);

  //join personal room of user
  socket.join(socket.userId);

  //handle messages with acknowledgement
  socket.on('sendMessage', async ({ receiverId, message }, callback) => {
    try {
      console.log(`Message from ${socket.userId} to ${receiverId}: "${message}"`);
      
      const [sender, receiver] = await Promise.all([
        User.findById(socket.userId),
        User.findById(receiverId)
      ]);

      if (!sender || !receiver) {
        throw new Error('User not found');
      }

      if (sender.role === receiver.role) {
        throw new Error('Only players and fans can chat');
      }

      const newMessage = await Chat.create({
        senderId: socket.userId,
        receiverId,
        message
      });

      console.log('Message saved:', newMessage._id);
      
      //send acknowledgement back to sender
      if (callback) {
        callback({ 
          status: 'success',
          messageId: newMessage._id 
        });
      }

      //emit to receiver if they're online
      io.to(receiverId).emit('receiveMessage', newMessage);
      
      //confirm the message to the sender
      socket.emit('messageSent', newMessage);

    } catch (error) {
      console.error('Message error:', error.message);
      
      if (callback) {
        callback({ 
          status: 'error',
          error: error.message 
        });
      }
      
      socket.emit('error', error.message);
    }
  });

  //handle the disconnection
  socket.on('disconnect', async () => {
    try {
      await User.findByIdAndUpdate(socket.userId, { isOnline: false });
      console.log(`User ${socket.userId} disconnected`);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
};

export default handleSocketConnection;