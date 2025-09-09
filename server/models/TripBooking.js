import mongoose from "mongoose";

const tripBookingSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tripInstanceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TripInstance",
      required: true,
    },
    seats: {
      type: [String], // e.g., ["A1", "A2"]
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TripBooking = mongoose.model("TripBooking", tripBookingSchema);

export default TripBooking;
