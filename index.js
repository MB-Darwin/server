import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import connect from "./src/configs/db.js";
import appRoutes from "./src/routes/index.js";
import events from "./src/middlewares/event.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import corsOptions from "./src/configs/corsOptions.js";

config();

const app = express();

app.use(events);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to JobHub server");
});

app.use("/api", appRoutes);

connect();

app.use(errorHandler);

const PORT = process.env.PORT || 443;

const start = async () => {
  try {
    mongoose.connection.once("open", () => {
      console.log("Connected to DB");
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
  } catch (error) {
    console.error(error);
  }
};

start();
