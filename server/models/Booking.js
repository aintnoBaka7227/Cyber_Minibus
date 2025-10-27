import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tripInstanceID: { type: mongoose.Schema.Types.ObjectId, ref: "TripInstance", required: true },
  seats: [String],
  status: { type: String, enum: ["paid", "cancelled", "pending"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);
