import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { authRouter } from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

await connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credential: true
}));

// API Routes
app.get("/", (req, res) => {
    console.log("hehe");
    res.send("server running ....");
});

app.use(cookieParser());
app.use("/api/auth", authRouter);

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
