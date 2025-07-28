import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15d" }); //return the generated token, so it can be stored
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    //check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //Validate role
    if (!["player", "fan"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    const token = generateToken(user._id); //generate token

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    //check if the password is correct
    const isMatch = await user.comparePassword(password); //compare the password with the hashed password in the database
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { register, login };
