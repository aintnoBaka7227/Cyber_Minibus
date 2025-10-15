import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { authRouter } from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/userRoutes.js"
import { destinationRouter } from "./routes/destinationsRoutes.js"
import { bookingRouter } from "./routes/bookingRoutes.js"

const app = express();
const port = 3000;
await connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// API Routes
app.get("/", (req, res) => {
    res.send("server running ....");
});

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/destination", destinationRouter);
app.use("/api/booking", bookingRouter);

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
