import logEvent from "../configs/LogEvent.js";

const errorHandler = (err, req, res, next) => {
  logEvent(`${err.name}: ${err.message}`, "error.log");
  res.status(500).json({ msg: "Oops Something went wrong" });
};

export default errorHandler;
