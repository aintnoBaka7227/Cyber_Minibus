import express from "express"
import { requireAuth } from "../middleware/auth.js"
import {register, login, me, logout} from "../controllers/authController.js"

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/me", requireAuth, me);
authRouter.post("/logout", logout);

//export default authRouter;