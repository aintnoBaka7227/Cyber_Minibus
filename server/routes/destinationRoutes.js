import express from "express";
import {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} from "../controllers/destinationController.js";
import { authenticateToken, protectAdmin } from "../middleware/jwtAuth.js";

const destinationRouter = express.Router();

// Public routes
destinationRouter.get("/", getAllDestinations);
destinationRouter.get("/:id", getDestinationById);

// Admin routes
destinationRouter.use(authenticateToken);
destinationRouter.use(protectAdmin);

destinationRouter.post("/", createDestination);
destinationRouter.put("/:id", updateDestination);
destinationRouter.delete("/:id", deleteDestination);

export default destinationRouter;
