import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import TripInstance from "../models/TripInstance.js";
import Destination from "../models/Destination.js";

// Function to check availability of selected seats for a trip
const checkSeatsAvailability = async (tripInstanceId, selectedSeats) => {
  try {
    const tripInstance = await TripInstance.findById(tripInstanceId);
    if (!tripInstance) return false;

    const bookedSeats = tripInstance.bookedSeats;

    const isAnySeatTaken = selectedSeats.some((seat) => bookedSeats.includes(seat));

    return !isAnySeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tripInstanceId, selectedSeats } = req.body;
    const { origin } = req.headers;

    // Check if the seat is available for the selected trip
    const isAvailable = await checkSeatsAvailability(tripInstanceId, selectedSeats);

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Selected Seats are not available.",
      });
    }

    // Get the trip instance details
    const tripInstance = await TripInstance.findById(tripInstanceId);
    if (!tripInstance) {
      return res.json({
        success: false,
        message: "Trip instance not found.",
      });
    }

    // Get destination details to calculate price
    const destination = await Destination.findOne({
      "tripTemplates._id": tripInstance.tripTemplateID
    });
    
    const tripTemplate = destination.tripTemplates.find(
      template => template._id.toString() === tripInstance.tripTemplateID.toString()
    );

    const totalAmount = tripTemplate.price * selectedSeats.length;

    // Create a new booking
    const booking = await Booking.create({
      userID: userId,
      tripInstanceID: tripInstanceId,
      seats: selectedSeats,
      amount: totalAmount,
      status: "pending"
    });

    // Update trip instance with booked seats
    tripInstance.bookedSeats.push(...selectedSeats);
    await tripInstance.save();

    // MOCK PAYMENT: immediately mark as paid and provide a fake URL
    booking.status = "paid";
    booking.paymentLink = `${origin}/payment/mock-success?bookingId=${booking._id.toString()}`;
    await booking.save();

    // No delayed payment check needed in mock mode

    res.json({ success: true, url: booking.paymentLink });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { tripInstanceId } = req.params;
    const tripInstance = await TripInstance.findById(tripInstanceId);

    if (!tripInstance) {
      return res.json({ success: false, message: "Trip instance not found" });
    }

    res.json({ success: true, occupiedSeats: tripInstance.bookedSeats });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
