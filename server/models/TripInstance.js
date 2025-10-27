import mongoose from "mongoose";

// Stores a specific departure of a trip template on a given date/time
const tripInstanceSchema = new mongoose.Schema({
  tripTemplateID: { type: mongoose.Schema.Types.ObjectId, ref: "Destination.tripTemplates", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  bookedSeats: [String]
});

// Enforce one instance per (template, date-only, time).
// This prevents two inserts for the same departure when requests race.
tripInstanceSchema.index({ tripTemplateID: 1, date: 1, time: 1 }, { unique: true });

export default mongoose.model("TripInstance", tripInstanceSchema);
