import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import TripInstance from "../models/TripInstance.js";
import User from "../models/User.js";
import Destination from "../models/Destination.js";

// POST /create-booking
export const createBooking = async (req, res) => {
  try {
    const { tripInstanceID, tripTemplateID, date, time, seats } = req.body;
    const userID = req.user?.id;

    let tripInstance;

    // Option 1: tripInstanceID is provided directly
    if (tripInstanceID) {
      if (!mongoose.Types.ObjectId.isValid(tripInstanceID)) {
        return res.status(400).json({ success: false, message: "Invalid tripInstanceID" });
      }
      tripInstance = await TripInstance.findById(tripInstanceID);
      if (!tripInstance) {
        return res.status(404).json({ success: false, message: "Trip instance not found" });
      }
    }
    // Option 2: Find or create trip instance based on tripTemplateID, date, and time
    else if (tripTemplateID && date && time) {
      if (!mongoose.Types.ObjectId.isValid(tripTemplateID)) {
        return res.status(400).json({ success: false, message: "Invalid tripTemplateID" });
      }

      // Try to find existing trip instance
      tripInstance = await TripInstance.findOne({
        tripTemplateID,
        date: new Date(date),
        time
      });

      // If not found, create a new one
      if (!tripInstance) {
        tripInstance = new TripInstance({
          tripTemplateID,
          date: new Date(date),
          time,
          bookedSeats: []
        });
        await tripInstance.save();
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Either tripInstanceID or (tripTemplateID, date, time) must be provided"
      });
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
      tripInstanceID: tripInstance._id,
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
      .populate({ path: "tripInstanceID", model: "TripInstance" });

    // Manually enrich bookings with destination and trip template data
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const bookingObj = booking.toObject();
        
        if (bookingObj.tripInstanceID?.tripTemplateID) {
          const tripTemplateId = bookingObj.tripInstanceID.tripTemplateID;
          
          // Find the destination that contains this trip template
          const destination = await Destination.findOne({
            "tripTemplates._id": tripTemplateId
          });
          
          if (destination) {
            // Find the specific trip template in the destination
            const tripTemplate = destination.tripTemplates.find(
              template => template._id.toString() === tripTemplateId.toString()
            );
            
            if (tripTemplate) {
              // Replace tripTemplateID with enriched data
              bookingObj.tripInstanceID.tripTemplateID = {
                _id: destination._id,
                name: destination.name,
                mainphoto: destination.mainphoto,
                price: tripTemplate.price,
                startPoints: tripTemplate.startPoints,
                departureTimes: tripTemplate.departureTimes
              };
            }
          }
        }
        
        return bookingObj;
      })
    );

    return res.status(200).json({
      success: true,
      count: enrichedBookings.length,
      bookings: enrichedBookings
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
