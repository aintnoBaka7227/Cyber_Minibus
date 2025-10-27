import express from "express";
import { getUserBookings, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

export const userRouter = express.Router();

userRouter.get("/bookings/:userId", requireAuth ,getUserBookings);    // User can see all the bookings that they have made
userRouter.get("/profile/:userId", requireAuth, getUserProfile);      // User can get all of their profile details
userRouter.post("/update-profile/:userId", requireAuth ,updateUserProfile);   // User can update their profile details
