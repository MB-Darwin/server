import express from "express";
import * as handle from "../controllers/job.controller.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const jobRoutes = express.Router();

jobRoutes.post("/create", verifyJWT, handle.create);
jobRoutes.get("/list", verifyJWT, handle.getJobs);
jobRoutes.get("/details/:id", verifyJWT, handle.getJob);

export default jobRoutes;
