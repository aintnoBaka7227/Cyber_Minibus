import express from "express";
import {
  createBooking,
  getOccupiedSeats,
} from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/jwtAuth.js";

const bookingRouter = express.Router();

// Create booking requires authentication
bookingRouter.post("/create", authenticateToken, createBooking);
// Getting seats doesn't require authentication
bookingRouter.get("/seats/:tripInstanceId", getOccupiedSeats);

export default bookingRouter;
