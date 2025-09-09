import User from "../models/User.js";
import TripInstance from "../models/TripInstance.js";
import TripBooking from "../models/TripBooking.js";

/**
 * Get all bookings for the logged-in user
 */
export const getUserBookings = async (req, res) => {
  try {
    // Assuming user ID is available from authentication middleware (e.g., req.user.id)
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const bookings = await TripInstance.find({ bookedSeats: userId })
      .populate("tripTemplateID") // include trip details
      .lean();

    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get the profile of the logged-in user
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const user = await User.findById(userId).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};