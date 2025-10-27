import express from "express";


import {
  getTrips,
  getTripByParams,
} from "../controllers/tripInstanceController.js";

import { requireAuth, requireAdmin } from "../middleware/auth.js";

const tripRouter = express.Router();

// Admin overview (raw trip instances)
tripRouter.get("/all-trips", requireAuth, requireAdmin, getTrips);

// Public preview by template/date/time; does not create instances
tripRouter.get("/instance", getTripByParams);

export default tripRouter;
