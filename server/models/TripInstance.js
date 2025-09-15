import mongoose from "mongoose";

const tripInstanceSchema = new mongoose.Schema({
  tripTemplateID: { type: mongoose.Schema.Types.ObjectId, ref: "Destination.tripTemplates", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  bookedSeats: [String]
});

export default mongoose.model("TripInstance", tripInstanceSchema);
