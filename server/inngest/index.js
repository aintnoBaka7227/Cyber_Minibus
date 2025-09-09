import { Inngest } from "inngest";
import User from "../models/User.js";
import TripInstance from "../models/TripInstance.js";
import TripTemplate from "../models/TripBooking.js";
import { sendEmail } from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "trip-booking-app" });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.create(userData);
  }
);

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest Function to cancel booking and release seats after 10 minutes if payment is not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

    await step.run("check-payment-status", async () => {
      const instanceId = event.data.tripInstanceId;
      const tripInstance = await TripInstance.findById(instanceId);

      // If payment is not made, release seats (clear booking)
      if (tripInstance && !tripInstance.isPaid) {
        tripInstance.bookedSeats = []; // release seats
        await tripInstance.deleteOne();
      }
    });
  }
);

// Inngest Function to send email when user books a trip
const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/trip.booked" },
  async ({ event }) => {
    const { tripInstanceId, userId } = event.data;

    const tripInstance = await TripInstance.findById(tripInstanceId)
      .populate("tripTemplateID")
      .lean();

    const user = await User.findById(userId);

    if (!tripInstance || !user) return;

    const trip = tripInstance.tripTemplateID;

    await sendEmail({
      to: user.email,
      subject: `Booking Confirmation: "${trip.title}" trip booked!`,
      body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hi ${user.firstName || user.username},</h2>
        <p>Your booking for <strong style="color: #1E90FF;">"${
          trip.title
        }"</strong> is confirmed.</p>
        <p>
          <strong>Date:</strong> ${new Date(tripInstance.date).toLocaleDateString("en-US")}<br />
          <strong>Time:</strong> ${tripInstance.time}
        </p>
        <p>We look forward to having you on this trip! 🧳</p>
        <p>Thanks for booking with us!<br />- TripMate Team</p>
      </div>`,
    });
  }
);

// Inngest Function to send reminders for upcoming trips
const sendTripReminders = inngest.createFunction(
  { id: "send-trip-reminders" },
  { cron: "0 */8 * * *" }, // Every 8 hours
  async ({ step }) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    // Find upcoming trips within this window
    const reminderTasks = await step.run("prepare-reminder-tasks", async () => {
      const trips = await TripInstance.find({
        date: { $gte: windowStart, $lte: in8Hours },
      }).populate("tripTemplateID");

      const tasks = [];

      for (const tripInstance of trips) {
        const userIds = tripInstance.bookedSeats || [];
        if (userIds.length === 0) continue;

        const users = await User.find({ _id: { $in: userIds } }).select("firstName email");

        for (const user of users) {
          tasks.push({
            userEmail: user.email,
            userName: user.firstName || user.username,
            tripTitle: tripInstance.tripTemplateID.title,
            tripDate: tripInstance.date,
            tripTime: tripInstance.time,
          });
        }
      }

      return tasks;
    });

    if (reminderTasks.length === 0) {
      return { sent: 0, message: "No reminders to send." };
    }

    // Send reminder emails
    const results = await step.run("send-all-reminders", async () => {
      return await Promise.allSettled(
        reminderTasks.map((task) =>
          sendEmail({
            to: task.userEmail,
            subject: `Reminder: Your trip "${task.tripTitle}" is coming up!`,
            body: `<div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Hello ${task.userName},</h2>
              <p>This is a reminder for your upcoming trip:</p>
              <h3 style="color: #1E90FF;">"${task.tripTitle}"</h3>
              <p>
                Scheduled for <strong>${new Date(task.tripDate).toLocaleDateString("en-US")}</strong> at
                <strong>${task.tripTime}</strong>.
              </p>
              <p>It starts in approximately <strong>8 hours</strong> - get ready for your adventure!</p>
              <br />
              <p>Safe travels 🌍 - TripMate Team</p>
            </div>`,
          })
        )
      );
    });

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - sent;

    return {
      sent,
      failed,
      message: `Sent ${sent} reminder(s), ${failed} failed.`,
    };
  }
);

// Inngest Function to notify users when a new trip is added
const sendNewTripNotifications = inngest.createFunction(
  { id: "send-new-trip-notifications" },
  { event: "app/trip.added" },
  async ({ event }) => {
    const { tripTitle } = event.data;

    const users = await User.find({});

    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: `🌍 New Trip Added: ${tripTitle}`,
        body: `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${user.firstName || user.username},</h2>
          <p>We've just added a new trip to our catalog:</p>
          <h3 style="color: #1E90FF;">"${tripTitle}"</h3>
          <p>Visit our website to explore and book your next adventure! ✈️</p>
          <br />
          <p>Thanks, <br />TripMate Team</p>
        </div>`,
      });
    }

    return { message: "Notifications sent." };
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendTripReminders,
  sendNewTripNotifications,
];