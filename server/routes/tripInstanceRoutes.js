import express from "express";
import {
  getAllTripInstances,
  getTripInstanceById,
  getTripInstancesByDateRange,
  createTripInstance,
  updateTripInstance,
  deleteTripInstance
} from "../controllers/tripInstanceController.js";
import { authenticateToken, protectAdmin } from "../middleware/jwtAuth.js";

const tripInstanceRouter = express.Router();

// Public routes
tripInstanceRouter.get("/", getAllTripInstances);
tripInstanceRouter.get("/search", getTripInstancesByDateRange);
tripInstanceRouter.get("/:id", getTripInstanceById);

// Admin routes
tripInstanceRouter.use(authenticateToken);
tripInstanceRouter.use(protectAdmin);

tripInstanceRouter.post("/", createTripInstance);
tripInstanceRouter.put("/:id", updateTripInstance);
tripInstanceRouter.delete("/:id", deleteTripInstance);

export default tripInstanceRouter;
