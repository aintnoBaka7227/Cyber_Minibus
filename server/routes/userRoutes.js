import express from "express";
import { getUserBookings, getUserProfile } from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.get("/bookings", getUserBookings);
userRouter.get("/profile", getUserProfile);

export default userRouter;