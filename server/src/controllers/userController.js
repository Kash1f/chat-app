
import User from '../models/User.js';

const getUsersByRole = async (req, res) => {
  try {
    //getting opposite role of current user
    const oppositeRole = req.user.role === 'player' ? 'fan' : 'player';
    
    const users = await User.find({ role: oppositeRole }).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

export default getUsersByRole;