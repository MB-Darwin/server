import express from "express";
import * as handle from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import errorHandler from "../middlewares/errorHandler.js";

const authRoutes = express.Router();

authRoutes.post("/sign-up", handle.signUp);
// authRoutes.patch("/email-verification", handle.emailVerification);
authRoutes.post("/sign-in", handle.signIn);
// authRoutes.post("/refresh-token", verifyJWT, handle.refreshToken);
// authRoutes.post("/forgot-password", handle.forgotPassword);
// authRoutes.patch("/reset-password", verifyJWT, handle.resetPassword);

authRoutes.use(errorHandler);

export default authRoutes;
