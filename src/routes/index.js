import express from "express";
import authRoutes from "./auth.routes.js";
import roleRoutes from "./role.routes.js";
import userRoutes from "./user.routes.js";
import jobRoutes from "./job.routes.js";
import candidateRoutes from "./candidates.routes.js";

const appRoutes = express();

appRoutes.use("/auth", authRoutes);
appRoutes.use("/role", roleRoutes);
appRoutes.use("/user", userRoutes);
appRoutes.use("/job", jobRoutes);
appRoutes.use("/candidate", candidateRoutes);

export default appRoutes;
