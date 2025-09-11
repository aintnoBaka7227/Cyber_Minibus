import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const cookieOpts = {
  httpOnly: false,
  secure: false,
  sameSite: "Lax",
  path:"/"
};

export const register = async (req, res) => {
  try {
    const { email, username, password, role} = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "username, email and password are required" });
    }

    const exist = await User.findOne({ $or: [{ email }, { username }] });
    if (exist) return res.status(409).json({ success: false, message: "User already exists" });

    const new_user = await User.create({ username, email, password, role });

    const token = signToken(new_user)

    res
      .cookie("accessToken", token, cookieOpts)
      .status(201)
      .json({
        user: { id: new_user._id, username: new_user.username, email: new_user.email, role: new_user.role },
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email or username, and password are required" });
    }
    const user = await User.findOne(email ? { email } : { username });
    console.log(user);
    if (!user || ! (req.body.password == user.password)) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signToken(user);

    res
      .cookie("accessToken", token, cookieOpts)
      .json({
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email role");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken", cookieOpts);
  res.json({ message: "Logged out" });
};

