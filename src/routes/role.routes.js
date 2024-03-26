import express from "express";
import { createRole } from "../controllers/role.controller.js";
const roleRoutes = express.Router();

roleRoutes.post("/create", createRole);

export default roleRoutes;
