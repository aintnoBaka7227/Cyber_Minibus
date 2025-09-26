import express from "express";


import {
  getTrip,
  getTrips,
  updateTrip,
} from "../controllers/tripController.js";

import { requireAuth, requireAdmin } from "../middleware/auth.js";

const tripRouter = express.Router();

tripRouter.get("/all-trips", requireAdmin, getTrips);       // Admin will be able to see all the trips
tripRouter.get("/get-trip-detail/:tripId", requireAuth, getTrip);      // User may click on a particular trip and request details of that trip
tripRouter.post("/update-trip-detail/:tripId", requireAuth, updateTrip);   // User can change their selected trip after making a booking

export default tripRouter;
