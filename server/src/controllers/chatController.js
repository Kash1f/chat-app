import Chat from '../models/Chat.js';
import User from '../models/User.js';

export const getConversation = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    //validate that users have opposite roles
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (sender.role === receiver.role) {
      return res.status(400).json({ message: 'Chat only allowed between players and fans' });
    }

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    })
    .sort({ createdAt: -1 }) 
    .populate('senderId', 'name')
    .populate('receiverId', 'name');

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};