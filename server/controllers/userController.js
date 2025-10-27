// server/controllers/userController.js
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Destination from "../models/Destination.js";
import vulnerable from "../configs/vulnerable.js";
import mongoose from "mongoose";

// helper to check authorization: allow if requester is same user or is admin
const isAuthorized = (reqUser, targetUserId) => {
  if (!reqUser) return false;
  if (reqUser.role === "admin") return true;
  // reqUser.id may be stored as string or _id; compare as strings
  return String(reqUser.id || reqUser._id) === String(targetUserId);
};

// GET /user/bookings/:userId
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // validate userId is an ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    // authorization: same user or admin
    if (!isAuthorized(req.user, userId)) {
      return res.status(403).json({ success: false, message: "Forbidden: not authorized" });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    // query bookings where userID matches
    const bookings = await Booking.find({ userID: userObjectId })
      .populate({ path: "tripInstanceID", model: "TripInstance" })
      .populate({ path: "userID", select: "username email firstName lastName" });

    // Manually enrich bookings with destination and trip template data
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const bookingObj = booking.toObject();
        
        if (bookingObj.tripInstanceID?.tripTemplateID) {
          const tripTemplateId = bookingObj.tripInstanceID.tripTemplateID;
          
          // Find the destination that contains this trip template
          const destination = await Destination.findOne({
            "tripTemplates._id": tripTemplateId
          });
          
          if (destination) {
            // Find the specific trip template in the destination
            const tripTemplate = destination.tripTemplates.find(
              template => template._id.toString() === tripTemplateId.toString()
            );
            
            if (tripTemplate) {
              // Replace tripTemplateID with enriched data
              bookingObj.tripInstanceID.tripTemplateID = {
                _id: destination._id,
                name: destination.name,
                mainphoto: destination.mainphoto,
                price: tripTemplate.price,
                startPoints: tripTemplate.startPoints,
                departureTimes: tripTemplate.departureTimes
              };
            }
          }
        }
        
        return bookingObj;
      })
    );

    return res.status(200).json({ success: true, bookings: enrichedBookings });
  } catch (error) {
    console.error("getUserBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

// GET /user/profile/:userId
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    if (!isAuthorized(req.user, userId)) {
      return res.status(403).json({ success: false, message: "Forbidden: not authorized" });
    }

    // exclude password
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("getUserProfile error:", error);
    return res.status(500).json({ success: false, message: "Error fetching profile", error: error.message });
  }
};

// POST /user/update-profile/:userId
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    // auth check
    if (!isAuthorized(req.user, userId)) {
      return res.status(403).json({ success: false, message: "Forbidden: not authorized" });
    }

    // VULNERABLE BRANCH (toggle via VULNERABLE_SQLI_MODE=true):
    // Allow raw update payload from client, including MongoDB update operators
    // Example attack bodies:
    //  - { "$set": { "role": "admin" } }
    //  - { "$unset": { "email": 1 } }
    //  - { "address": "new", "$rename": { "username": "uname" } }
    // This bypasses the allowlist and permits privilege escalation or destructive ops.
    if (vulnerable.isSqlIVulnerable()) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        req.body, // VULNERABLE: apply client body directly (operators allowed)
        { new: true, runValidators: false }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated (vulnerable mode)",
        user: updatedUser,
      });
    }

    // SAFE BRANCH (default): only allow certain fields to be updated
    const allowedFields = ["username", "firstName", "lastName", "email", "phone", "address"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password"); // exclude password

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
