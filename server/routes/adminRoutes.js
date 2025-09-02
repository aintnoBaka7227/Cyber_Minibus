import express from "express";
import { authenticateToken, protectAdmin } from "../middleware/jwtAuth.js";
import {
  getAllBookings,
  getAllTripInstances,
  getDashboardData,
  isAdmin,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// All admin routes require authentication and admin role
adminRouter.use(authenticateToken);

adminRouter.get("/is-admin", protectAdmin, isAdmin);
adminRouter.get("/dashboard", protectAdmin, getDashboardData);
adminRouter.get("/all-trip-instances", protectAdmin, getAllTripInstances);
adminRouter.get("/all-bookings", protectAdmin, getAllBookings);

export default adminRouter;
