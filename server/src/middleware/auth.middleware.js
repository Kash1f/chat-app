import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectedRoute = async (req, res, next) => {
  try {
    //getting token from header
    const authToken = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!authToken) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    //verifying token
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

    //geting user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found, access denied' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token, access denied' });
  }
};

export default protectedRoute;