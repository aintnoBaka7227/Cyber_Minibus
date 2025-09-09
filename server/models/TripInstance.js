import mongoose from "mongoose";

const tripInstanceSchema = new mongoose.Schema({
  tripTemplateID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TripTemplate",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  bookedSeats:
    {
      type: [String],
    }
});

const Trip = mongoose.model("Trip", tripInstanceSchema);

export default Trip;
