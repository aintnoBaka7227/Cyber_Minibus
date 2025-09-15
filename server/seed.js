// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";

import { destinations, tripInstances, bookings, users } from "./dummyData.js"; 
import Destination from "./models/Destination.js";
import TripInstance from "./models/TripInstance.js";
import Booking from "./models/Booking.js";
import User from "./models/User.js";
import connectDB from "./configs/db.js";  // 👈 use your db.js

dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. connect to MongoDB using your helper
    await connectDB();

    // 2. clear old data (optional)
    await Promise.all([
      Destination.deleteMany(),
      TripInstance.deleteMany(),
      Booking.deleteMany(),
      User.deleteMany(),
    ]);
    console.log("🧹 Old data cleared");

    // 3. insert dummy data
    await User.insertMany(users);
    await Destination.insertMany(destinations);
    await TripInstance.insertMany(tripInstances);
    await Booking.insertMany(bookings);

    console.log("🎉 Dummy data inserted!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();
