import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hash before saving!
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true },
  address: { type: String },
  role: { type: String, enum: ["client", "admin"], default: "client" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
