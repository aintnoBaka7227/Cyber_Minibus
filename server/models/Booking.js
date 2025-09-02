import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    tripInstanceID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "TripInstance" },
    seats: [{ type: String, required: true }], // Array of seat IDs like ["A1", "A2"]
    status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
    amount: { type: Number, required: true },
    paymentLink: { type: String },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
