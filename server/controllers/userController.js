import User from "../models/User.js";
import Booking from "../models/Booking.js"

export const getUserBookings = async (req, res) => {
    try {
        const booking = await Booking.find({ userID: req.user.id });
        res.json({ success: true, booking });
    } catch (error) {
        return res.status(500).json({ success:false, message: error.message});
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const profile = await User.findById(req.user.id)
        res.json({ success: true, profile });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message});
    }
}

export const updateUserProfile = async (req, res) => {
  try {
    const { username, password, firstname, lastname, email, phone, address, role } = req.body;

    const updates = { username, firstname, lastname, email, phone, address, role };
    if (password) {
      updates.password = password; 
    }

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User profile updated",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        address: user.address,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
