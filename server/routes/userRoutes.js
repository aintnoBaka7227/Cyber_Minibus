import express from "express";
import { getUserBookings, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

export const userRouter = express.Router();

userRouter.get("/bookings", requireAuth, getUserBookings);
userRouter.get("/profile", requireAuth, getUserProfile);
userRouter.post("/update-profile", requireAuth, updateUserProfile);
