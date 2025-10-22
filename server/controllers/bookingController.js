import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import TripInstance from "../models/TripInstance.js";
import User from "../models/User.js";
// Helper that finds or creates a TripInstance by (templateId, date, time)
// and is safe under races (unique index + upsert)
import { ensureTripInstance } from "../utils/tripInstance.js";

// POST /create-booking
// Accepts either an existing `tripInstanceID` or the tuple
// `{ templateId, date: "YYYY-MM-DD", time: "HH:mm" }` to create-on-book.
export const createBooking = async (req, res) => {
  try {
    const { tripInstanceID, seats, templateId, date, time } = req.body;
    const userID = req.user?.id;

    // Require at least one requested seat
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: "seats array is required" });
    }

    let instanceId = tripInstanceID;

    if (!instanceId) {
      // No instance provided: ensure/find the instance for the natural key
      if (!templateId || !date || !time) {
        return res.status(400).json({ success: false, message: "Provide tripInstanceID or (templateId, date, time)" });
      }
      const instance = await ensureTripInstance({ templateId, date, time });
      instanceId = instance._id;
    } else {
      // Validate provided instance id exists
      if (!mongoose.Types.ObjectId.isValid(instanceId)) {
        return res.status(400).json({ success: false, message: "Invalid tripInstanceID" });
      }
      const exists = await TripInstance.exists({ _id: instanceId });
      if (!exists) {
        return res.status(404).json({ success: false, message: "Trip instance not found" });
      }
    }

    // Atomically reserve seats; ensure none of requested seats are already taken
    // Single conditional update prevents double-booking without requiring a transaction
    const updated = await TripInstance.findOneAndUpdate(
      { _id: instanceId, bookedSeats: { $nin: seats } },
      { $addToSet: { bookedSeats: { $each: seats } } },
      { new: true }
    ).lean();

    if (!updated) {
      // If the conditional update failed, compute which seats conflicted for a clear error
      const current = await TripInstance.findById(instanceId).select("bookedSeats").lean();
      const taken = (current?.bookedSeats || []).filter(s => seats.includes(s));
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${taken.join(", ")}`,
        bookedSeats: current?.bookedSeats || [],
      });
    }

    // Now that seats are reserved, persist the Booking document
    const booking = new Booking({
      userID,
      tripInstanceID: instanceId,
      seats,
      status: "paid",
    });
    await booking.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
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
