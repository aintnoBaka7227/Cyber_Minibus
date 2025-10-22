import mongoose from "mongoose";
import Destination from "../models/Destination.js";

// GET /all-destinations
// Return all destinations (basic info)
export const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().select(
      "name teaser rating mainphoto"
    ); // only preview fields

    return res.status(200).json({
      success: true,
      count: destinations.length,
      destinations,
    });
  } catch (error) {
    console.error("getDestinations error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching destinations",
      error: error.message,
    });
  }
};

// GET /get-destination-details/:destinationId
// Return full details for a single destination
export const getDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(destinationId)) {
      return res.status(400).json({ success: false, message: "Invalid destinationId" });
    }

    const destination = await Destination.findById(destinationId);

    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }

    return res.status(200).json({ success: true, destination });
  } catch (error) {
    console.error("getDestination error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching destination",
      error: error.message,
    });
  }
};

// POST /add-destination
// Add a new destination (admin only)
export const addDestination = async (req, res) => {
  try {
    const { name, teaser, description, rating, mainphoto, tripTemplates } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    // Validate tripTemplates if provided
    if (tripTemplates && tripTemplates.length > 0) {
      for (const template of tripTemplates) {
        if (!template.price || template.price <= 0) {
          return res.status(400).json({
            success: false,
            message: "Trip template must have a valid price",
          });
        }
        if (!template.startPoints || template.startPoints.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Trip template must have at least one start point",
          });
        }
        if (!template.departureTimes || template.departureTimes.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Trip template must have at least one departure time",
          });
        }
      }
    }

    const newDestination = new Destination({
      name,
      teaser,
      description,
      rating: rating || 0,
      mainphoto,
      tripTemplates: tripTemplates || [],
    });

    await newDestination.save();

    return res.status(201).json({
      success: true,
      message: "Destination added successfully",
      destination: newDestination,
    });
  } catch (error) {
    console.error("addDestination error:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding destination",
      error: error.message,
    });
  }
};
