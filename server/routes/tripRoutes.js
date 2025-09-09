import express from "express";
import {
  addTrip,
  getOnGoingTrips,
  getTrip,
  getTrips,
} from "../controllers/tripController.js";
import { requireAdmin } from "../middleware/auth.js";

const tripRouter = express.Router();

tripRouter.get("/on-going-trip", requireAdmin, getOnGoingTrips);
tripRouter.post("/add", requireAdmin, addTrip);
tripRouter.get("/all", getTrips);
tripRouter.get("/:tripId", getTrip);

export default tripRouter;