import express from "express";
import * as handle from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const userRoutes = express.Router();

userRoutes.patch("/edit-general", verifyJWT, handle.generalEdit);

export default userRoutes;
