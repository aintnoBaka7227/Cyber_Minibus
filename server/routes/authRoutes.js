import express from "express";
import { login, register, verifyToken } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/verify", verifyToken);

export default authRouter;
