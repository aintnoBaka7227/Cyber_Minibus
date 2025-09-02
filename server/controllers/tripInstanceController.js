import TripInstance from "../models/TripInstance.js";
import Destination from "../models/Destination.js";

// Get all trip instances
export const getAllTripInstances = async (req, res) => {
  try {
    const tripInstances = await TripInstance.find({});
    res.json({ success: true, tripInstances });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get trip instance by ID
export const getTripInstanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const tripInstance = await TripInstance.findById(id);
    
    if (!tripInstance) {
      return res.json({ success: false, message: "Trip instance not found" });
    }
    
    res.json({ success: true, tripInstance });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get trip instances by date range
export const getTripInstancesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const tripInstances = await TripInstance.find(query);
    res.json({ success: true, tripInstances });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Create new trip instance (admin only)
export const createTripInstance = async (req, res) => {
  try {
    const tripInstanceData = req.body;
    const tripInstance = await TripInstance.create(tripInstanceData);
    res.json({ success: true, tripInstance });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update trip instance (admin only)
export const updateTripInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const tripInstance = await TripInstance.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!tripInstance) {
      return res.json({ success: false, message: "Trip instance not found" });
    }
    
    res.json({ success: true, tripInstance });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Delete trip instance (admin only)
export const deleteTripInstance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tripInstance = await TripInstance.findByIdAndDelete(id);
    
    if (!tripInstance) {
      return res.json({ success: false, message: "Trip instance not found" });
    }
    
    res.json({ success: true, message: "Trip instance deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
