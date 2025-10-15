import express from "express";


import {
  createBooking,
  getBookings,
  updateBookingDetails
} from "../controllers/bookingController.js";

import {
  requireAdmin,
  requireAuth
 } from "../middleware/auth.js";

export const bookingRouter = express.Router();

bookingRouter.post("/create-booking/", requireAuth, createBooking)      // When user clicks on a particular trip and makes all the necessary selections such as date, time and seats, a booking will be created under user's name.
bookingRouter.get("/all-bookings", requireAuth, requireAdmin, getBookings);       // The admin will be able to see all the bookings
bookingRouter.post("/update-booking/:bookingId", requireAuth ,updateBookingDetails);     // user can change the status of the booking either active or cancelled