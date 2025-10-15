import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import TripInstance from "../models/TripInstance.js";
import User from "../models/User.js";

// POST /create-booking
export const createBooking = async (req, res) => {
  try {
    const { tripInstanceID, seats } = req.body;
    const userID = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(tripInstanceID)) {
      return res.status(400).json({ success: false, message: "Invalid tripInstanceID" });
    }

    const tripInstance = await TripInstance.findById(tripInstanceID);
    if (!tripInstance) {
      return res.status(404).json({ success: false, message: "Trip instance not found" });
    }

    // normalize bookedSeats
    const bookedSeats = Array.isArray(tripInstance.bookedSeats) ? tripInstance.bookedSeats : [];

    // find intersection
    const alreadyBooked = seats.filter(seat => bookedSeats.includes(seat));

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${alreadyBooked.join(", ")}`,
        bookedSeats,
      });
    }

    // create booking record
    const booking = new Booking({
      userID: userID,
      tripInstanceID,
      seats,
      status: "paid" // or "pending" depending on flow
    });

    await booking.save();
    
    // only save the bookedseats in the database if the booking is successful otherwise not
    tripInstance.bookedSeats = Array.from(new Set([...tripInstance.bookedSeats, ...seats]));
    await tripInstance.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message
    });
  }
};

// GET /all-bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userID", "username email firstName lastName")
      .populate({
        path: "tripInstanceID",
        populate: {
          path: "tripTemplateID",
          model: "Destination", // if tripTemplateID references destination
          select: "name teaser"
        }
      });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("getBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message
    });
  }
};

// POST /update-booking/:bookingId
export const updateBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid bookingId" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // only allow owner or admin
    if (!req.user || (req.user.role !== "admin" && booking.userID.toString() !== req.user.id.toString())) {
      return res.status(403).json({ success: false, message: "Forbidden: not authorized" });
    }

    // if cancelling, free up the seats in TripInstance
    if (status === "cancelled" && booking.status !== "cancelled") {
      const tripInstance = await TripInstance.findById(booking.tripInstanceID);
      if (tripInstance) {
        tripInstance.bookedSeats = tripInstance.bookedSeats.filter(seat => !booking.seats.includes(seat));
        await tripInstance.save();
      }
    }

    booking.status = status || booking.status;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking
    });
  } catch (error) {
    console.error("updateBookingDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating booking",
      error: error.message
    });
  }
};
