import express from "express";
import { createRole } from "../controllers/role.controller.js";
import errorHandler from "../middlewares/errorHandler.js";
const roleRoutes = express.Router();

roleRoutes.post("/create", createRole);

roleRoutes.use(errorHandler);

export default roleRoutes;
