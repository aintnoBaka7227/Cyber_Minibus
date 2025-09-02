import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teaser: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  mainphoto: { type: String, required: true },
  tripTemplates: [{
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    startPoints: [{
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true }
    }],
    departureTimes: [{ type: String, required: true }],
    price: { type: Number, required: true },
    seatLayout: [{ type: String, required: true }]
  }]
}, {
  timestamps: true
});

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
