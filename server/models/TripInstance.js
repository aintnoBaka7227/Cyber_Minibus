import mongoose from "mongoose";

const tripInstanceSchema = new mongoose.Schema({
  tripTemplateID: { type: mongoose.Schema.Types.ObjectId, ref: "Destination.tripTemplates", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  bookedSeats: [String]
});

// Uniqueness per (template, date-only, time) to avoid duplicates when creating on booking
tripInstanceSchema.index({ tripTemplateID: 1, date: 1, time: 1 }, { unique: true });

export default mongoose.model("TripInstance", tripInstanceSchema);
