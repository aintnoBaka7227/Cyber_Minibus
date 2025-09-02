import Booking from "../models/Booking.js";
import TripInstance from "../models/TripInstance.js";
import Destination from "../models/Destination.js";
import User from "../models/User.js";

// API to check if user is an admin
export const isAdmin = async (req, res) => {
  res.json({ success: true, isAdmin: true });
};

// API to get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "paid" });
    const activeTrips = await TripInstance.find({
      date: { $gte: new Date().toISOString().split('T')[0] }
    });

    const totalUsers = await User.countDocuments();
    const totalDestinations = await Destination.countDocuments();

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeTrips: activeTrips.length,
      totalUsers,
      totalDestinations,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all trip instances
export const getAllTripInstances = async (req, res) => {
  try {
    const tripInstances = await TripInstance.find({})
      .sort({ date: 1, time: 1 });

    res.json({ success: true, tripInstances });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("userID")
      .populate("tripInstanceID")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
