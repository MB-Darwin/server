import express from "express";
import * as handle from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import errorHandler from "../middlewares/errorHandler.js";

const userRoutes = express.Router();

userRoutes.use(verifyJWT);

userRoutes.get("/:id", handle.getUser);
userRoutes.patch("/edit/:id", handle.editUser);

userRoutes.use(errorHandler);

export default userRoutes;
