import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

import {
  getRevenue,
  getAllUsers,
  getDashboardStats,
} from "../controllers/adminController.js";


const adminRouter = express.Router();

adminRouter.get("/dashboard-stats", requireAuth, requireAdmin, getDashboardStats);   // Get dashboard statistics
adminRouter.get("/get-revenue", requireAuth, requireAdmin, getRevenue);   // The total amount made from each booking will be added to generate the revenue
adminRouter.get("/all-users", requireAuth, requireAdmin, getAllUsers);   // Admin will be able to see all the users using the app

export default adminRouter;
