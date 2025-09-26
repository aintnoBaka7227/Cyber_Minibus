import express from "express";

import {
  getDestinations,
  getDestination,
  addDestination
} from "../controllers/destinationsController.js";

import { requireAdmin } from "../middleware/auth.js";

const destinationRouter = express.Router();

destinationRouter.get("/all-destinations", getDestinations);      // All the destinations can be viewed on the web page without logging in
destinationRouter.get("/get-destination-details/:destinationId", getDestination);   // When user clicks a particular destination, the details of that destination will be displayed
destinationRouter.post("/add-destination", requireAdmin, addDestination);       // This endpoint is called when Admin adds a destination to the list of available destinations

export default destinationRouter;