import logEvent from "../configs/LogEvent.js";

const events = (req, res, next) => {
  logEvent(`${req.method}\t${req.header.origin}\`${req.url}`, "event.log");
  console.log(`${req.method} ${req.path}`);
  next();
};

export default events;
