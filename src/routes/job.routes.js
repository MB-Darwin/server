import express from "express";
import * as handle from "../controllers/job.controller.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import errorHandler from "../middlewares/errorHandler.js";

const jobRoutes = express.Router();

jobRoutes.post("/create", verifyJWT, handle.create);
jobRoutes.get("/list", handle.getJobs);
jobRoutes.get("/myList", verifyJWT, handle.getJobsByEmployerId);
jobRoutes.get("/details/:id", handle.getJob);
jobRoutes.patch("/edit/:id", verifyJWT, handle.editJob);
jobRoutes.delete("/delete/:id", verifyJWT, handle.deleteJob);

jobRoutes.use(errorHandler);

export default jobRoutes;
