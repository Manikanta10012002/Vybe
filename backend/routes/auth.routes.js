import express from "express";
import { resetPassword, sendOtp, signIn, signOut, signup, verifyOtp } from "../controllers/auth.controller.js";


const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signIn);
authRouter.post("/sendOtp", sendOtp);
authRouter.post("/verifyOtp", verifyOtp);
authRouter.post("/resetPassword", resetPassword);
authRouter.post("/signout", signOut);

export default authRouter;
