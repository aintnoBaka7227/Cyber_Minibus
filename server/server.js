import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
// import { serve } from "inngest/express";
// import { inngest, functions } from "./inngest/index.js";
import destinationRouter from "./routes/destinationRoutes.js";
import tripInstanceRouter from "./routes/tripInstanceRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
// Removed Stripe webhooks

const app = express();
const port = 3000;

await connectDB();

// Stripe Webhooks Route removed (using mock payments now)

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.get("/", (req, res) => res.send("Server is Live!"));
app.use("/api/auth", authRouter);
// Inngest disabled (kept for future use)
// app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/destinations", destinationRouter);
app.use("/api/trip-instances", tripInstanceRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
