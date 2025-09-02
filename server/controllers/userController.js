import Booking from "../models/Booking.js";
import User from "../models/User.js";

// API Controller Function to Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userID: userId })
      .populate({
        path: "tripInstanceID",
        populate: { path: "tripTemplateID" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Note: Movie favorites functionality removed as it's not relevant for minibus bookings
