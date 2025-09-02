import express from "express";
import {
  getUserBookings,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/jwtAuth.js";

const userRouter = express.Router();

// All user routes require authentication
userRouter.use(authenticateToken);

userRouter.get("/bookings", getUserBookings);

export default userRouter;
