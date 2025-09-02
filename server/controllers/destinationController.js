import Destination from "../models/Destination.js";

// Get all destinations
export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({});
    res.json({ success: true, destinations });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get destination by ID
export const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findById(id);
    
    if (!destination) {
      return res.json({ success: false, message: "Destination not found" });
    }
    
    res.json({ success: true, destination });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Create new destination (admin only)
export const createDestination = async (req, res) => {
  try {
    const destinationData = req.body;
    const destination = await Destination.create(destinationData);
    res.json({ success: true, destination });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update destination (admin only)
export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const destination = await Destination.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!destination) {
      return res.json({ success: false, message: "Destination not found" });
    }
    
    res.json({ success: true, destination });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Delete destination (admin only)
export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    
    const destination = await Destination.findByIdAndDelete(id);
    
    if (!destination) {
      return res.json({ success: false, message: "Destination not found" });
    }
    
    res.json({ success: true, message: "Destination deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
