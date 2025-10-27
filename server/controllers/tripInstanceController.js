import TripInstance from "../models/TripInstance.js";
import mongoose from "mongoose";
// Read-only preview helper that does not create a trip instance
import { previewTripByParams } from "../utils/tripInstance.js";

// Admin list: return raw trip instances (no populate) for overview
export const getTrips = async (req, res) => {
  try {
    const trips = await TripInstance.find()
      .select("_id tripTemplateID date time bookedSeats")
      .sort({ date: 1, time: 1 })
      .lean();

    return res.status(200).json({ success: true, count: trips.length, trips });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// GET /instance?templateId=&date=YYYY-MM-DD&time=HH:mm (public preview; does not create)
export const getTripByParams = async (req, res) => {
  try {
    const { templateId, date, time } = req.query;
    if (!templateId || !date || !time) {
      return res.status(400).json({ success: false, message: "templateId, date and time are required" });
    }
    const result = await previewTripByParams({ templateId, date, time });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("getTripByParams error:", error);
    return res.status(500).json({ success: false, message: "Error fetching trip preview", error: error.message });
  }
};
