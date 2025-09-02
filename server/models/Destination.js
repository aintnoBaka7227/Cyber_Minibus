import mongoose from "mongoose";

const startPointSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true }
});

const tripTemplateSchema = new mongoose.Schema({
  startPoints: [startPointSchema],
  departureTimes: [String],
  price: { type: Number, required: true },
  seatLayout: [String]
});

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teaser: { type: String },
  description: { type: String },
  rating: { type: Number, default: 0 },
  mainphoto: { type: String },
  tripTemplates: [tripTemplateSchema]
});

export default mongoose.model("Destination", destinationSchema);
