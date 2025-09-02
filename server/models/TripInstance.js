import mongoose from "mongoose";

const tripInstanceSchema = new mongoose.Schema({
  tripTemplateID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Destination.tripTemplates" },
  date: { type: String, required: true }, // Format: "2025-09-15"
  time: { type: String, required: true }, // Format: "09:00"
  bookedSeats: [{ type: String, required: true }] // Array of seat IDs like ["A1", "A2"]
}, {
  timestamps: true
});

const TripInstance = mongoose.model("TripInstance", tripInstanceSchema);

export default TripInstance;
