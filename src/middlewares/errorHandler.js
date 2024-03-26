import logEvent from "../configs/LogEvent.js";

const errorHandler = (err, req, res, next) => {
  logEvent(`${err.name}: ${err.message}`, "error.log");
};

export default errorHandler;
