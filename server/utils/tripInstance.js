import mongoose from "mongoose";
import TripInstance from "../models/TripInstance.js";
import Destination from "../models/Destination.js";

// Normalize a calendar date string to a Date at UTC midnight
// Keeps the unique index consistent and avoids timezone drift
export const normalizeDateOnly = (dateStr) => {
  // Expect YYYY-MM-DD; store as UTC midnight
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};


// Find or create a TripInstance by (templateId, date, time)
// Uses unique index + upsert; on duplicate-key race, re-queries the winner
export const ensureTripInstance = async ({ templateId, date, time }) => {
  const tripTemplateID = new mongoose.Types.ObjectId(templateId);
  const normalizedDate = normalizeDateOnly(date);

  try {
    const instance = await TripInstance.findOneAndUpdate(
      { tripTemplateID, date: normalizedDate, time },
      { $setOnInsert: { bookedSeats: [] } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    return instance;
  } catch (err) {
    // Handle race on unique index: another request inserted concurrently
    if (err && err.code === 11000) {
      return await TripInstance.findOne({ tripTemplateID, date: normalizedDate, time }).lean();
    }
    throw err;
  }
};

// Read-only preview of seat layout by params without creating an instance
// Pure read: preview seats by (templateId, date, time) without creating an instance
export const previewTripByParams = async ({ templateId, date, time }) => {
  const tripTemplateID = new mongoose.Types.ObjectId(templateId);
  const normalizedDate = normalizeDateOnly(date);

  // Try existing instance first; if present, include its current bookedSeats
  const existing = await TripInstance.findOne({ tripTemplateID, date: normalizedDate, time })
    .select("_id bookedSeats tripTemplateID date time")
    .lean();
  if (existing) {
    return {
      exists: true,
      tripInstanceId: existing._id,
      seatLayout: await deriveSeatLayout(templateId),
      bookedSeats: existing.bookedSeats || [],
    };
  }

  // Not found: derive seatLayout from template; bookedSeats empty
  return {
    exists: false,
    tripInstanceId: null,
    seatLayout: await deriveSeatLayout(templateId),
    bookedSeats: [],
  };
};

// Resolve seat layout from the destination.tripTemplates entry
const deriveSeatLayout = async (templateId) => {
  const tid = new mongoose.Types.ObjectId(templateId);
  const dest = await Destination.findOne({ "tripTemplates._id": tid }, { "tripTemplates.$": 1 }).lean();
  const tpl = dest?.tripTemplates?.[0];
  return Array.isArray(tpl?.seatLayout) ? tpl.seatLayout : [];
};

