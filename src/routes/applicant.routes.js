import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import * as handle from "../controllers/applicant.controller.js";
import errorHandler from "../middlewares/errorHandler.js";

const applicantRoutes = express.Router();

applicantRoutes.use(verifyJWT);

applicantRoutes.get("/status/:id", handle.getStatus);
applicantRoutes.post("/apply/:id", handle.applyJob);
applicantRoutes.get("/list/:id", verifyJWT, handle.getApplicantsByJobId);
applicantRoutes.patch("/edit/:id", handle.editStatus);

applicantRoutes.use(errorHandler);

export default applicantRoutes;
