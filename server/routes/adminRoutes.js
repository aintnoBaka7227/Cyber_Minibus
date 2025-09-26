import express from "express";
import { requireAdmin } from "../middleware/auth.js";

import {
  getRevenue,
  getAllUsers,
} from "../controllers/adminController.js";


const adminRouter = express.Router();

adminRouter.get("/get-revenue", requireAdmin, getRevenue);   // The total amount made from each booking will be added to generate the revenue
adminRouter.get("/all-users", requireAdmin, getAllUsers);   // Admin will be able to see all the users using the app

export default adminRouter;
