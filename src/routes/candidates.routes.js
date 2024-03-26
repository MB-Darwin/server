import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import * as handle from "../controllers/candidate.controller.js";

const candidateRoutes = express.Router();

candidateRoutes.get("/list/:id", verifyJWT, handle.getCandidatesByJobId);

export default candidateRoutes;
